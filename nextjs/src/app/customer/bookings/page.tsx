"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { bookingsService } from "@/lib/services";
import { Calendar, Filter, MapPin, RefreshCw, Search } from "lucide-react";
import { useEffect, useState } from "react";

export default function CustomerBookingsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [bookings, setBookings] = useState<any[]>([]);
    const [preBookings, setPreBookings] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    const fetchBookings = async () => {
        setIsLoading(true);
        try {
            const user = JSON.parse(localStorage.getItem("user") || "{}");
            if (!user.id) {
                toast({
                    title: "Error",
                    description: "User not found. Please login again.",
                    variant: "destructive",
                });
                return;
            }

            const response = await bookingsService.getCustomerBookings(user.id);
            const allBookings = response.data || [];

            // Separate confirmed/pending bookings from pre-bookings
            setBookings(allBookings.filter((b: any) => b.booking_status !== "pre_booked"));
            setPreBookings(allBookings.filter((b: any) => b.booking_status === "pre_booked"));
        } catch (error) {
            console.error("Error fetching bookings:", error);
            toast({
                title: "Error",
                description: "Failed to load bookings",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const refreshBookings = () => {
        fetchBookings();
        toast({
            title: "Refreshed",
            description: "Bookings data updated",
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "confirmed":
                return "bg-green-500/10 text-green-500 border-green-500/20";
            case "pending":
                return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
            case "pre-booked":
                return "bg-blue-500/10 text-blue-500 border-blue-500/20";
            default:
                return "bg-gray-500/10 text-gray-500 border-gray-500/20";
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">My Bookings</h1>
                    <p className="text-muted-foreground">Manage your property bookings and pre-bookings</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={refreshBookings}>
                        <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button>New Booking</Button>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col gap-4 md:flex-row">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search bookings..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-48">
                        <Filter className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="pre-booked">Pre-booked</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Tabs defaultValue="bookings" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="bookings">Active Bookings ({bookings.length})</TabsTrigger>
                    <TabsTrigger value="pre-bookings">Pre-bookings ({preBookings.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="bookings" className="space-y-4">
                    {isLoading ? (
                        Array.from({ length: 2 }).map((_, i) => (
                            <Card key={i}>
                                <CardHeader>
                                    <Skeleton className="h-6 w-3/4" />
                                    <Skeleton className="h-4 w-1/2 mt-2" />
                                </CardHeader>
                                <CardContent>
                                    <Skeleton className="h-20 w-full" />
                                </CardContent>
                            </Card>
                        ))
                    ) : bookings.length === 0 ? (
                        <Card className="p-12">
                            <div className="text-center space-y-4">
                                <Calendar className="h-16 w-16 mx-auto text-muted-foreground" />
                                <div>
                                    <h3 className="text-lg font-semibold">No bookings found</h3>
                                    <p className="text-sm text-muted-foreground">You haven't made any bookings yet.</p>
                                </div>
                            </div>
                        </Card>
                    ) : (
                        bookings
                            .filter((booking: any) => statusFilter === "all" || booking.booking_status === statusFilter)
                            .map((booking: any) => (
                                <Card key={booking.id}>
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <CardTitle className="text-xl">
                                                    {booking.unit?.project?.project_name || "N/A"}
                                                </CardTitle>
                                                <CardDescription className="flex items-center gap-2 mt-1">
                                                    <MapPin className="h-4 w-4" />
                                                    {booking.unit?.unit_type || "N/A"} - Unit{" "}
                                                    {booking.unit?.unit_number || "N/A"}
                                                </CardDescription>
                                            </div>
                                            <Badge className={getStatusColor(booking.booking_status)}>
                                                {booking.booking_status?.replace("_", " ")}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="space-y-2">
                                                <p className="text-sm font-medium text-muted-foreground">
                                                    Booking Details
                                                </p>
                                                <div className="space-y-1">
                                                    <p className="flex items-center gap-2 text-sm">
                                                        <Calendar className="h-4 w-4" />
                                                        Booked: {new Date(booking.booking_date).toLocaleDateString()}
                                                    </p>
                                                    <p className="text-sm">
                                                        Amount: ${booking.booking_amount?.toLocaleString() || "N/A"}
                                                    </p>
                                                    <p className="text-sm">
                                                        Builder: {booking.unit?.project?.builder?.full_name || "N/A"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-sm font-medium text-muted-foreground">Status</p>
                                                <div className="space-y-1">
                                                    <p className="text-sm">
                                                        Status: {booking.booking_status?.replace("_", " ")}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-sm font-medium text-muted-foreground">Actions</p>
                                                <div className="flex flex-col gap-2">
                                                    <Button variant="outline" size="sm">
                                                        View Details
                                                    </Button>
                                                    <Button variant="outline" size="sm">
                                                        Payment History
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                    )}
                </TabsContent>

                <TabsContent value="pre-bookings" className="space-y-4">
                    {isLoading ? (
                        Array.from({ length: 1 }).map((_, i) => (
                            <Card key={i}>
                                <CardHeader>
                                    <Skeleton className="h-6 w-3/4" />
                                    <Skeleton className="h-4 w-1/2 mt-2" />
                                </CardHeader>
                                <CardContent>
                                    <Skeleton className="h-20 w-full" />
                                </CardContent>
                            </Card>
                        ))
                    ) : preBookings.length === 0 ? (
                        <Card className="p-12">
                            <div className="text-center space-y-4">
                                <Calendar className="h-16 w-16 mx-auto text-muted-foreground" />
                                <div>
                                    <h3 className="text-lg font-semibold">No pre-bookings found</h3>
                                    <p className="text-sm text-muted-foreground">
                                        You haven't made any pre-bookings yet.
                                    </p>
                                </div>
                            </div>
                        </Card>
                    ) : (
                        preBookings.map((booking: any) => (
                            <Card key={booking.id}>
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <CardTitle className="text-xl">
                                                {booking.unit?.project?.project_name || "N/A"}
                                            </CardTitle>
                                            <CardDescription className="flex items-center gap-2 mt-1">
                                                <MapPin className="h-4 w-4" />
                                                {booking.unit?.unit_type || "N/A"}
                                            </CardDescription>
                                        </div>
                                        <Badge className={getStatusColor(booking.booking_status)}>
                                            {booking.booking_status?.replace("_", " ")}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <p className="text-sm font-medium text-muted-foreground">
                                                Pre-booking Details
                                            </p>
                                            <div className="space-y-1">
                                                <p className="flex items-center gap-2 text-sm">
                                                    <Calendar className="h-4 w-4" />
                                                    Pre-booked: {new Date(booking.booking_date).toLocaleDateString()}
                                                </p>
                                                <p className="text-sm">
                                                    Amount: ${booking.booking_amount?.toLocaleString() || "N/A"}
                                                </p>
                                                <p className="text-sm">
                                                    Builder: {booking.unit?.project?.builder?.full_name || "N/A"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-sm font-medium text-muted-foreground">Actions</p>
                                            <div className="flex flex-col gap-2">
                                                <Button size="sm">Convert to Booking</Button>
                                                <Button variant="outline" size="sm">
                                                    View Details
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
