"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { appointmentsService, bookingsService, projectsService } from "@/lib/services";
import { ArrowRight, Building2, Calendar, FileText, Plus, RefreshCw, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function BuilderDashboard() {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({
        totalProjects: 0,
        activeProjects: 0,
        pendingBookings: 0,
        upcomingAppointments: 0,
    });
    const [recentProjects, setRecentProjects] = useState<any[]>([]);
    const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
    const [recentActivity, setRecentActivity] = useState<any[]>([]);

    const fetchDashboardData = async () => {
        setIsLoading(true);
        try {
            // Fetch projects
            const projectsResponse = await projectsService.getProjects({ page: 1, limit: 3 });
            if (projectsResponse.data) {
                setRecentProjects(projectsResponse.data.projects);
                setStats(prev => ({
                    ...prev,
                    totalProjects: projectsResponse.data!.total,
                    activeProjects: projectsResponse.data!.projects.filter(
                        (p: any) => p.status === "in_progress" || p.status === "approved"
                    ).length,
                }));
            }

            // Fetch bookings
            const bookingsResponse = await bookingsService.getBuilderBookings({
                page: 1,
                limit: 5,
                status: "pending",
            });
            if (bookingsResponse.data) {
                setStats(prev => ({
                    ...prev,
                    pendingBookings: bookingsResponse.data!.total,
                }));

                // Create recent activity from bookings
                const bookingActivities = bookingsResponse.data!.bookings.slice(0, 3).map((booking: any) => ({
                    id: `booking-${booking.id}`,
                    action: "New booking received",
                    project: booking.unit?.project?.project_name || "Unknown Project",
                    time: new Date(booking.created_at).toLocaleDateString(),
                    type: "booking",
                }));
                setRecentActivity(bookingActivities);
            }

            // Fetch appointments
            const appointmentsResponse = await appointmentsService.getAppointments({
                page: 1,
                limit: 3,
            });
            if (appointmentsResponse.data) {
                const appointments = Array.isArray(appointmentsResponse.data) ? appointmentsResponse.data : [];

                setUpcomingAppointments(
                    appointments.slice(0, 3).map((apt: any) => ({
                        id: apt.id,
                        customer:
                            `${apt.customer?.first_name || ""} ${apt.customer?.last_name || ""}`.trim() || "Unknown",
                        project: apt.project?.project_name || "Unknown Project",
                        time: new Date(apt.scheduled_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                        date: new Date(apt.scheduled_at).toLocaleDateString(),
                        type: apt.appointment_type.replace("_", " "),
                    }))
                );
                setStats(prev => ({
                    ...prev,
                    upcomingAppointments: appointments.length,
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
                    <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
                    <p className="text-muted-foreground">Welcome back! Here's what's happening with your projects.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={refreshDashboard}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                    </Button>
                    <Link href="/builder/projects/new">
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            New Project
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalProjects}</div>
                        <p className="text-xs text-muted-foreground">
                            <span className="text-green-600">+2</span> from last month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.activeProjects}</div>
                        <p className="text-xs text-muted-foreground">
                            <span className="text-green-600">+1</span> from last week
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Bookings</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.pendingBookings}</div>
                        <p className="text-xs text-muted-foreground">
                            <span className="text-accent">3 new</span> today
                        </p>
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
                            Next: <span className="text-accent">Today 10:00 AM</span>
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Projects */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Recent Projects</CardTitle>
                                <CardDescription>Your latest construction projects</CardDescription>
                            </div>
                            <Link href="/builder/projects">
                                <Button variant="outline" size="sm">
                                    View All
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentProjects.map(project => (
                                    <div
                                        key={project.id}
                                        className="flex items-center justify-between p-4 border border-border rounded-lg"
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-semibold text-foreground">{project.name}</h3>
                                                <Badge
                                                    variant={project.status === "In Progress" ? "default" : "secondary"}
                                                >
                                                    {project.status}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-2">{project.location}</p>
                                            <div className="flex items-center gap-4 text-sm">
                                                <span className="text-muted-foreground">
                                                    Progress: {project.progress}%
                                                </span>
                                                <span className="text-muted-foreground">
                                                    Bookings: {project.bookings}
                                                </span>
                                            </div>
                                            <Progress value={project.progress} className="mt-2 h-2" />
                                        </div>
                                        <div className="ml-4">
                                            <Link href={`/builder/projects/${project.id}`}>
                                                <Button variant="ghost" size="sm">
                                                    View
                                                </Button>
                                            </Link>
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
                            <Link href="/builder/appointments">
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
                                            <div className="w-2 h-2 bg-accent rounded-full"></div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-foreground truncate">
                                                {appointment.customer}
                                            </p>
                                            <p className="text-xs text-muted-foreground truncate">
                                                {appointment.project}
                                            </p>
                                            <p className="text-xs text-accent">
                                                {appointment.date} at {appointment.time}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Activity */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Recent Activity</CardTitle>
                            <CardDescription>Latest updates and notifications</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {recentActivity.map(activity => (
                                    <div key={activity.id} className="flex items-start gap-3">
                                        <div className="flex-shrink-0 mt-1">
                                            {activity.type === "booking" && <Users className="h-4 w-4 text-blue-500" />}
                                            {activity.type === "progress" && (
                                                <TrendingUp className="h-4 w-4 text-green-500" />
                                            )}
                                            {activity.type === "change" && (
                                                <FileText className="h-4 w-4 text-orange-500" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-foreground">{activity.action}</p>
                                            <p className="text-xs text-muted-foreground">{activity.project}</p>
                                            <p className="text-xs text-muted-foreground">{activity.time}</p>
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
