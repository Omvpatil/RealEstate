"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { checkUserSession, handleApiError } from "@/lib/auth-utils";
import { bookingsService, changeRequestsService } from "@/lib/services";
import {
    AlertCircle,
    Calendar,
    CheckCircle,
    Clock,
    DollarSign,
    FileText,
    MessageSquare,
    Plus,
    RefreshCw,
    Search,
    XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ChangeRequest {
    id: number;
    booking_id: number;
    request_type: string;
    request_title: string;
    request_description: string;
    current_specification?: string;
    requested_specification?: string;
    estimated_cost?: number;
    estimated_timeline_days?: number;
    status: string;
    builder_response?: string;
    rejection_reason?: string;
    approval_date?: string;
    completion_date?: string;
    final_cost?: number;
    attachments?: string[];
    created_at: string;
}

export default function CustomerChangeRequestsPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [changeRequests, setChangeRequests] = useState<ChangeRequest[]>([]);
    const [bookings, setBookings] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [showNewRequestForm, setShowNewRequestForm] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // New request form state
    const [selectedBooking, setSelectedBooking] = useState<string>("");
    const [requestType, setRequestType] = useState<string>("");
    const [requestTitle, setRequestTitle] = useState("");
    const [requestDescription, setRequestDescription] = useState("");
    const [currentSpec, setCurrentSpec] = useState("");
    const [requestedSpec, setRequestedSpec] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const user = checkUserSession(router, toast);
            if (!user) return;

            // Fetch bookings to get projects
            const bookingsResponse = await bookingsService.getCustomerBookings(user.id);
            setBookings(bookingsResponse.data || []);

            // Fetch change requests
            const requestsResponse = await changeRequestsService.getChangeRequests();
            setChangeRequests(requestsResponse.data || []);
        } catch (error: any) {
            console.error("Error fetching data:", error);

            if (handleApiError(error, router, toast)) {
                return;
            }

            toast({
                title: "Error",
                description: "Failed to load change requests",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmitRequest = async () => {
        if (!selectedBooking || !requestType || !requestTitle || !requestDescription) {
            toast({
                title: "Validation Error",
                description: "Please fill in all required fields",
                variant: "destructive",
            });
            return;
        }

        setIsSubmitting(true);
        try {
            await changeRequestsService.createChangeRequest({
                booking_id: parseInt(selectedBooking),
                request_type: requestType as any,
                request_title: requestTitle,
                request_description: requestDescription,
                current_specification: currentSpec || undefined,
                requested_specification: requestedSpec || undefined,
            });

            toast({
                title: "Success",
                description: "Change request submitted successfully",
            });

            // Reset form and close modal
            setSelectedBooking("");
            setRequestType("");
            setRequestTitle("");
            setRequestDescription("");
            setCurrentSpec("");
            setRequestedSpec("");
            setShowNewRequestForm(false);

            // Refresh data
            fetchData();
        } catch (error: any) {
            console.error("Error submitting request:", error);

            if (handleApiError(error, router, toast)) {
                return;
            }

            toast({
                title: "Error",
                description: error.response?.data?.detail || "Failed to submit change request",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "approved":
                return "bg-green-500/10 text-green-500 border-green-500/20";
            case "rejected":
                return "bg-red-500/10 text-red-500 border-red-500/20";
            case "submitted":
                return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
            case "under_review":
                return "bg-blue-500/10 text-blue-500 border-blue-500/20";
            case "completed":
                return "bg-purple-500/10 text-purple-500 border-purple-500/20";
            default:
                return "bg-gray-500/10 text-gray-500 border-gray-500/20";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "approved":
            case "completed":
                return <CheckCircle className="h-4 w-4" />;
            case "rejected":
                return <XCircle className="h-4 w-4" />;
            case "under_review":
                return <AlertCircle className="h-4 w-4" />;
            default:
                return <Clock className="h-4 w-4" />;
        }
    };

    const getRequestTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            layout: "Layout",
            fixtures: "Fixtures",
            finishes: "Finishes",
            electrical: "Electrical",
            plumbing: "Plumbing",
            other: "Other",
        };
        return labels[type] || type;
    };

    const getBookingLabel = (bookingId: number) => {
        const booking = bookings.find(b => b.id === bookingId);
        if (booking?.unit?.project) {
            return `${booking.unit.project.project_name} - Unit ${booking.unit.unit_number}`;
        }
        return `Booking #${bookingId}`;
    };

    const filteredRequests = changeRequests.filter(request => {
        const matchesSearch =
            request.request_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.request_description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || request.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Skeleton className="h-8 w-64" />
                        <Skeleton className="h-4 w-96 mt-2" />
                    </div>
                    <Skeleton className="h-10 w-32" />
                </div>
                <Skeleton className="h-12 w-full" />
                <div className="space-y-4">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-48 w-full" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Change Requests</h1>
                    <p className="text-muted-foreground">Request modifications to your property construction</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={fetchData}>
                        <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button onClick={() => setShowNewRequestForm(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        New Request
                    </Button>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col gap-4 md:flex-row">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search change requests..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-48">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="submitted">Submitted</SelectItem>
                        <SelectItem value="under_review">Under Review</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Tabs defaultValue="all" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="all">All Requests ({filteredRequests.length})</TabsTrigger>
                    <TabsTrigger value="submitted">
                        Submitted ({filteredRequests.filter(r => r.status === "submitted").length})
                    </TabsTrigger>
                    <TabsTrigger value="approved">
                        Approved ({filteredRequests.filter(r => r.status === "approved").length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4">
                    {filteredRequests.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <p className="text-muted-foreground">No change requests found</p>
                            </CardContent>
                        </Card>
                    ) : (
                        filteredRequests.map(request => (
                            <Card key={request.id}>
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <CardTitle className="flex items-center gap-2 text-xl">
                                                {getStatusIcon(request.status)}
                                                {request.request_title}
                                            </CardTitle>
                                            <CardDescription className="mt-1">
                                                {getBookingLabel(request.booking_id)}
                                            </CardDescription>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline">{getRequestTypeLabel(request.request_type)}</Badge>
                                            <Badge className={getStatusColor(request.status)}>
                                                {request.status.replace("_", " ")}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-muted-foreground">{request.request_description}</p>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <p className="text-sm font-medium text-muted-foreground">Request Details</p>
                                            <div className="space-y-1">
                                                <p className="flex items-center gap-2 text-sm">
                                                    <Calendar className="h-4 w-4" />
                                                    Submitted: {new Date(request.created_at).toLocaleDateString()}
                                                </p>
                                                <p className="text-sm">
                                                    Type: {getRequestTypeLabel(request.request_type)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-sm font-medium text-muted-foreground">Cost & Timeline</p>
                                            <div className="space-y-1">
                                                {request.estimated_cost && (
                                                    <p className="flex items-center gap-2 text-sm">
                                                        <DollarSign className="h-4 w-4" />
                                                        Estimated: ${request.estimated_cost.toLocaleString()}
                                                    </p>
                                                )}
                                                {request.estimated_timeline_days && (
                                                    <p className="flex items-center gap-2 text-sm">
                                                        <Clock className="h-4 w-4" />
                                                        Duration: {request.estimated_timeline_days} days
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-sm font-medium text-muted-foreground">Specifications</p>
                                            <div className="space-y-1">
                                                {request.current_specification && (
                                                    <p className="text-sm">
                                                        <span className="font-medium">Current:</span>{" "}
                                                        {request.current_specification}
                                                    </p>
                                                )}
                                                {request.requested_specification && (
                                                    <p className="text-sm">
                                                        <span className="font-medium">Requested:</span>{" "}
                                                        {request.requested_specification}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {request.builder_response && (
                                        <div className="p-4 bg-muted/50 rounded-lg">
                                            <div className="flex items-center gap-2 mb-2">
                                                <MessageSquare className="h-4 w-4" />
                                                <p className="text-sm font-medium">Builder Response</p>
                                                {request.approval_date && (
                                                    <span className="text-xs text-muted-foreground">
                                                        • {new Date(request.approval_date).toLocaleDateString()}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground">{request.builder_response}</p>
                                        </div>
                                    )}

                                    {request.rejection_reason && (
                                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                            <div className="flex items-center gap-2 mb-2">
                                                <XCircle className="h-4 w-4 text-red-600" />
                                                <p className="text-sm font-medium text-red-800">Rejection Reason</p>
                                            </div>
                                            <p className="text-sm text-red-700">{request.rejection_reason}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))
                    )}
                </TabsContent>

                <TabsContent value="submitted" className="space-y-4">
                    {filteredRequests.filter(r => r.status === "submitted").length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <p className="text-muted-foreground">No submitted requests found</p>
                            </CardContent>
                        </Card>
                    ) : (
                        filteredRequests
                            .filter(r => r.status === "submitted")
                            .map(request => (
                                <Card key={request.id}>
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <CardTitle>{request.request_title}</CardTitle>
                                                <CardDescription>{getBookingLabel(request.booking_id)}</CardDescription>
                                            </div>
                                            <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground mb-4">{request.request_description}</p>
                                        <p className="text-sm text-muted-foreground">
                                            Submitted on {new Date(request.created_at).toLocaleDateString()}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))
                    )}
                </TabsContent>

                <TabsContent value="approved" className="space-y-4">
                    {filteredRequests.filter(r => r.status === "approved").length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <p className="text-muted-foreground">No approved requests found</p>
                            </CardContent>
                        </Card>
                    ) : (
                        filteredRequests
                            .filter(r => r.status === "approved")
                            .map(request => (
                                <Card key={request.id}>
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <CardTitle className="flex items-center gap-2">
                                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                                    {request.request_title}
                                                </CardTitle>
                                                <CardDescription>{getBookingLabel(request.booking_id)}</CardDescription>
                                            </div>
                                            <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <p className="text-muted-foreground">{request.request_description}</p>
                                        {request.builder_response && (
                                            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                                    <p className="text-sm font-medium text-green-800">Approved</p>
                                                </div>
                                                <p className="text-sm text-green-700">{request.builder_response}</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))
                    )}
                </TabsContent>
            </Tabs>

            {/* New Request Form Modal */}
            {showNewRequestForm && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Submit Change Request</CardTitle>
                                <Button variant="outline" onClick={() => setShowNewRequestForm(false)}>
                                    Cancel
                                </Button>
                            </div>
                            <CardDescription>Request modifications to your property construction</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Booking / Project</label>
                                <Select value={selectedBooking} onValueChange={setSelectedBooking}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select booking" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {bookings.map(booking => (
                                            <SelectItem key={booking.id} value={booking.id.toString()}>
                                                {getBookingLabel(booking.id)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Request Type</label>
                                <Select value={requestType} onValueChange={setRequestType}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="layout">Layout</SelectItem>
                                        <SelectItem value="fixtures">Fixtures</SelectItem>
                                        <SelectItem value="finishes">Finishes</SelectItem>
                                        <SelectItem value="electrical">Electrical</SelectItem>
                                        <SelectItem value="plumbing">Plumbing</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Request Title</label>
                                <Input
                                    placeholder="Brief title for your change request..."
                                    value={requestTitle}
                                    onChange={e => setRequestTitle(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Description</label>
                                <Textarea
                                    placeholder="Detailed description of the changes you want to make..."
                                    rows={4}
                                    value={requestDescription}
                                    onChange={e => setRequestDescription(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Current Specification (Optional)</label>
                                <Input
                                    placeholder="What is currently specified?"
                                    value={currentSpec}
                                    onChange={e => setCurrentSpec(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Requested Specification (Optional)</label>
                                <Input
                                    placeholder="What would you like instead?"
                                    value={requestedSpec}
                                    onChange={e => setRequestedSpec(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button className="flex-1" onClick={handleSubmitRequest} disabled={isSubmitting}>
                                    {isSubmitting ? "Submitting..." : "Submit Request"}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => setShowNewRequestForm(false)}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
