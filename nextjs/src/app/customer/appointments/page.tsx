"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { appointmentsService } from "@/lib/services";
import { Calendar, Clock, MapPin, Plus, RefreshCw, Search, User, Video } from "lucide-react";
import { useEffect, useState } from "react";

export default function CustomerAppointmentsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [typeFilter, setTypeFilter] = useState("all");
    const [appointments, setAppointments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    const fetchAppointments = async () => {
        setIsLoading(true);
        try {
            const response = await appointmentsService.getAppointments({});
            const data = response.data;
            setAppointments(Array.isArray(data) ? data : data?.appointments || []);
        } catch (error) {
            console.error("Error fetching appointments:", error);
            toast({
                title: "Error",
                description: "Failed to load appointments",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const refreshAppointments = () => {
        fetchAppointments();
        toast({
            title: "Refreshed",
            description: "Appointments data updated",
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "confirmed":
                return "bg-green-500/10 text-green-500 border-green-500/20";
            case "pending":
                return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
            case "completed":
                return "bg-blue-500/10 text-blue-500 border-blue-500/20";
            case "cancelled":
                return "bg-red-500/10 text-red-500 border-red-500/20";
            default:
                return "bg-gray-500/10 text-gray-500 border-gray-500/20";
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "site-visit":
                return <MapPin className="h-4 w-4" />;
            case "virtual":
                return <Video className="h-4 w-4" />;
            case "office":
                return <User className="h-4 w-4" />;
            default:
                return <Calendar className="h-4 w-4" />;
        }
    };

    const upcomingAppointments = appointments.filter(
        (apt: any) => apt.status === "confirmed" || apt.status === "scheduled"
    );
    const pastAppointments = appointments.filter(
        (apt: any) => apt.status === "completed" || apt.status === "cancelled"
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Appointments</h1>
                    <p className="text-muted-foreground">Manage your site visits and consultations</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={refreshAppointments}>
                        <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        New Appointment
                    </Button>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col gap-4 md:flex-row">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search appointments..."
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
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-full md:w-48">
                        <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="site-visit">Site Visit</SelectItem>
                        <SelectItem value="virtual">Virtual</SelectItem>
                        <SelectItem value="office">Office Meeting</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Tabs defaultValue="upcoming" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="upcoming">Upcoming ({upcomingAppointments.length})</TabsTrigger>
                    <TabsTrigger value="past">Past ({pastAppointments.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming" className="space-y-4">
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
                    ) : upcomingAppointments.length === 0 ? (
                        <Card className="p-12">
                            <div className="text-center space-y-4">
                                <Calendar className="h-16 w-16 mx-auto text-muted-foreground" />
                                <div>
                                    <h3 className="text-lg font-semibold">No upcoming appointments</h3>
                                    <p className="text-sm text-muted-foreground">
                                        You don't have any scheduled appointments.
                                    </p>
                                </div>
                            </div>
                        </Card>
                    ) : (
                        upcomingAppointments.map((appointment: any) => (
                            <Card key={appointment.id}>
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <CardTitle className="flex items-center gap-2 text-xl">
                                                {getTypeIcon(appointment.appointment_type)}
                                                {appointment.title || "Appointment"}
                                            </CardTitle>
                                            <CardDescription className="mt-1">
                                                {appointment.project?.project_name || "N/A"}
                                            </CardDescription>
                                        </div>
                                        <Badge className={getStatusColor(appointment.status)}>
                                            {appointment.status?.replace("_", " ")}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                                <span>
                                                    {new Date(appointment.appointment_date).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Clock className="h-4 w-4 text-muted-foreground" />
                                                <span>{appointment.appointment_time || "Time TBD"}</span>
                                            </div>
                                            {appointment.location && (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                                    <span>{appointment.location}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-sm">
                                                <User className="h-4 w-4 text-muted-foreground" />
                                                <span>{appointment.project?.builder?.full_name || "N/A"}</span>
                                            </div>
                                        </div>
                                    </div>
                                    {appointment.notes && (
                                        <div className="p-3 bg-muted/50 rounded-lg">
                                            <p className="text-sm font-medium mb-1">Notes:</p>
                                            <p className="text-sm text-muted-foreground">{appointment.notes}</p>
                                        </div>
                                    )}
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm">
                                            Reschedule
                                        </Button>
                                        <Button variant="outline" size="sm">
                                            Cancel
                                        </Button>
                                        <Button size="sm">View Details</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </TabsContent>

                <TabsContent value="past" className="space-y-4">
                    {isLoading ? (
                        Array.from({ length: 1 }).map((_, i) => (
                            <Card key={i}>
                                <CardHeader>
                                    <Skeleton className="h-6 w-3/4" />
                                </CardHeader>
                                <CardContent>
                                    <Skeleton className="h-16 w-full" />
                                </CardContent>
                            </Card>
                        ))
                    ) : pastAppointments.length === 0 ? (
                        <Card className="p-12">
                            <div className="text-center space-y-4">
                                <Calendar className="h-16 w-16 mx-auto text-muted-foreground" />
                                <div>
                                    <h3 className="text-lg font-semibold">No past appointments</h3>
                                    <p className="text-sm text-muted-foreground">
                                        You haven't completed any appointments yet.
                                    </p>
                                </div>
                            </div>
                        </Card>
                    ) : (
                        pastAppointments.map((appointment: any) => (
                            <Card key={appointment.id} className="opacity-75">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <CardTitle className="flex items-center gap-2 text-xl">
                                                {getTypeIcon(appointment.appointment_type)}
                                                {appointment.title || "Appointment"}
                                            </CardTitle>
                                            <CardDescription className="mt-1">
                                                {appointment.project?.project_name || "N/A"}
                                            </CardDescription>
                                        </div>
                                        <Badge className={getStatusColor(appointment.status)}>
                                            {appointment.status?.replace("_", " ")}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                                <span>
                                                    {new Date(appointment.appointment_date).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Clock className="h-4 w-4 text-muted-foreground" />
                                                <span>{appointment.appointment_time || "Time TBD"}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-sm">
                                                <User className="h-4 w-4 text-muted-foreground" />
                                                <span>{appointment.project?.builder?.full_name || "N/A"}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm">
                                            View Details
                                        </Button>
                                        <Button variant="outline" size="sm">
                                            Book Again
                                        </Button>
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
