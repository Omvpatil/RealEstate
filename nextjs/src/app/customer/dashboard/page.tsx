"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { appointmentsService, bookingsService, notificationsService } from "@/lib/services";
import { ArrowRight, Bell, Building2, Calendar, Clock, Eye, MapPin, RefreshCw, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CustomerDashboard() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [customerName, setCustomerName] = useState("Customer");
    const [stats, setStats] = useState({
        bookedProperties: 0,
        upcomingAppointments: 0,
        activeProjects: 0,
        notifications: 0,
    });
    const [bookedProperties, setBookedProperties] = useState<any[]>([]);
    const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
    const [recentNotifications, setRecentNotifications] = useState<any[]>([]);

    const fetchDashboardData = async () => {
        setIsLoading(true);
        try {
            // Get user info from localStorage
            const userStr = localStorage.getItem("user");
            let userId = 0;
            if (userStr) {
                const user = JSON.parse(userStr);
                setCustomerName(user.full_name || "Customer");
                userId = user.id;
            }

            if (!userId) {
                toast({
                    title: "Error",
                    description: "Please log in again",
                    variant: "destructive",
                });
                return;
            }

            // Fetch bookings
            const bookingsResponse = await bookingsService.getCustomerBookings(userId);
            if (bookingsResponse.data) {
                const bookings = Array.isArray(bookingsResponse.data) ? bookingsResponse.data : [];
                setBookedProperties(
                    bookings.slice(0, 2).map((booking: any) => ({
                        id: booking.id,
                        name: booking.unit?.project?.project_name || "Unknown Project",
                        unit: booking.unit?.unit_number || "N/A",
                        location: booking.unit?.project?.location || "Unknown",
                        status: booking.status,
                        progress: 0, // Can be calculated or fetched separately
                        nextMilestone: "In Progress",
                        bookingDate: new Date(booking.booking_date).toLocaleDateString(),
                        expectedCompletion: booking.unit?.project?.expected_completion || "TBD",
                        image: booking.unit?.project?.images?.[0] || "/placeholder.jpg",
                    }))
                );
                setStats(prev => ({
                    ...prev,
                    bookedProperties: bookings.length,
                    activeProjects: bookings.filter((b: any) => b.status === "confirmed" || b.status === "pending")
                        .length,
                }));
            }

            // Fetch appointments
            const appointmentsResponse = await appointmentsService.getAppointments({ page: 1, limit: 3 });
            if (appointmentsResponse.data) {
                const appointments = Array.isArray(appointmentsResponse.data) ? appointmentsResponse.data : [];

                setUpcomingAppointments(
                    appointments.slice(0, 3).map((apt: any) => ({
                        id: apt.id,
                        project: apt.project?.project_name || "Unknown Project",
                        type: apt.appointment_type.replace("_", " "),
                        date: new Date(apt.scheduled_at).toLocaleDateString(),
                        time: new Date(apt.scheduled_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                        builder: apt.builder?.company_name || "Unknown Builder",
                        status: apt.status,
                    }))
                );
                setStats(prev => ({
                    ...prev,
                    upcomingAppointments: appointments.length,
                }));
            }

            // Fetch notifications
            const notificationsResponse = await notificationsService.getNotifications({ unread_only: false, limit: 3 });
            if (notificationsResponse.data) {
                const notifications = Array.isArray(notificationsResponse.data) ? notificationsResponse.data : [];

                setRecentNotifications(
                    notifications.slice(0, 3).map((notif: any) => ({
                        id: notif.id,
                        title: notif.title,
                        message: notif.message,
                        time: new Date(notif.created_at).toLocaleDateString(),
                        type: notif.notification_type,
                        read: notif.is_read,
                    }))
                );
                setStats(prev => ({
                    ...prev,
                    notifications: notifications.filter((n: any) => !n.is_read).length,
                }));
            }
        } catch (error) {
            console.error("Dashboard error:", error);
            toast({
                title: "Error",
                description: "Failed to load dashboard data",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const refreshDashboard = () => {
        fetchDashboardData();
        toast({
            title: "Refreshed",
            description: "Dashboard data updated",
        });
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "in_progress":
            case "confirmed":
                return "default";
            case "pending":
                return "secondary";
            case "completed":
                return "outline";
            default:
                return "secondary";
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-10 w-32" />
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {[1, 2, 3, 4].map(i => (
                        <Skeleton key={i} className="h-32" />
                    ))}
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                    <Skeleton className="h-96" />
                    <Skeleton className="h-96" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Welcome back, {customerName}!</h1>
                    <p className="text-muted-foreground">Track your construction projects and manage appointments</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={refreshDashboard}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                    </Button>
                    <Link href="/customer/projects">
                        <Button>
                            <Search className="h-4 w-4 mr-2" />
                            Browse Projects
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Booked Properties</CardTitle>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.bookedProperties}</div>
                        <p className="text-xs text-muted-foreground">Active bookings</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Appointments</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.upcomingAppointments}</div>
                        <p className="text-xs text-muted-foreground">
                            Next: <span className="text-accent">Today 2:00 PM</span>
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.activeProjects}</div>
                        <p className="text-xs text-muted-foreground">In construction</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Notifications</CardTitle>
                        <Bell className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.notifications}</div>
                        <p className="text-xs text-muted-foreground">
                            <span className="text-accent">2 unread</span>
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Booked Properties */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Your Properties</CardTitle>
                                <CardDescription>Track construction progress of your booked properties</CardDescription>
                            </div>
                            <Link href="/customer/bookings">
                                <Button variant="outline" size="sm">
                                    View All
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {bookedProperties.map(property => (
                                    <div key={property.id} className="border border-border rounded-lg p-4">
                                        <div className="flex items-start gap-4">
                                            <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center">
                                                <Building2 className="h-8 w-8 text-muted-foreground" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="font-semibold text-foreground">{property.name}</h3>
                                                    <Badge variant={getStatusColor(property.status)}>
                                                        {property.status}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                                                    <MapPin className="h-3 w-3" />
                                                    {property.location} • Unit {property.unit}
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-muted-foreground">
                                                            Progress: {property.progress}%
                                                        </span>
                                                        <span className="text-muted-foreground">
                                                            Next: {property.nextMilestone}
                                                        </span>
                                                    </div>
                                                    <Progress value={property.progress} className="h-2" />
                                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                        <Clock className="h-3 w-3" />
                                                        Expected completion: {property.expectedCompletion}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <Link href={`/customer/projects/${property.id}`}>
                                                    <Button variant="outline" size="sm">
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        View
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Upcoming Appointments */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-lg">Upcoming Appointments</CardTitle>
                                <CardDescription>Your scheduled meetings</CardDescription>
                            </div>
                            <Link href="/customer/appointments">
                                <Button variant="ghost" size="sm">
                                    <Calendar className="h-4 w-4" />
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {upcomingAppointments.map(appointment => (
                                    <div
                                        key={appointment.id}
                                        className="flex items-center gap-3 p-3 border border-border rounded-lg"
                                    >
                                        <div className="flex-shrink-0">
                                            <div
                                                className={`w-2 h-2 rounded-full ${
                                                    appointment.status === "Confirmed"
                                                        ? "bg-green-500"
                                                        : "bg-yellow-500"
                                                }`}
                                            ></div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-foreground truncate">
                                                {appointment.project}
                                            </p>
                                            <p className="text-xs text-muted-foreground truncate">{appointment.type}</p>
                                            <p className="text-xs text-accent">
                                                {appointment.date} at {appointment.time}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Notifications */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-lg">Recent Updates</CardTitle>
                                <CardDescription>Latest notifications</CardDescription>
                            </div>
                            <Link href="/customer/notifications">
                                <Button variant="ghost" size="sm">
                                    <Bell className="h-4 w-4" />
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {recentNotifications.map(notification => (
                                    <div key={notification.id} className="flex items-start gap-3">
                                        <div className="flex-shrink-0 mt-1">
                                            <div
                                                className={`w-2 h-2 rounded-full ${
                                                    notification.read ? "bg-muted-foreground" : "bg-accent"
                                                }`}
                                            ></div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-foreground">{notification.title}</p>
                                            <p className="text-xs text-muted-foreground">{notification.message}</p>
                                            <p className="text-xs text-muted-foreground">{notification.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
