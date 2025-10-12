"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { checkUserSession, handleApiError } from "@/lib/auth-utils";
import { bookingsService, projectsService } from "@/lib/services";
import { AlertCircle, Calendar, Camera, CheckCircle, Clock, FileText, Play, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CustomerProgressPage() {
    const router = useRouter();
    const [projects, setProjects] = useState<any[]>([]);
    const [selectedProject, setSelectedProject] = useState<any>(null);
    const [progressData, setProgressData] = useState<any[]>([]);
    const [updates, setUpdates] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    const fetchUserProjects = async () => {
        setIsLoading(true);
        try {
            // Check if user session exists
            const user = checkUserSession(router, toast);
            if (!user) return;

            // Get user's bookings to find their projects
            const bookingsResponse = await bookingsService.getCustomerBookings(user.id);
            const bookings = bookingsResponse.data || [];

            // Extract unique projects from bookings
            const uniqueProjects = bookings
                .filter((b: any) => b.unit?.project)
                .map((b: any) => b.unit.project)
                .filter(
                    (project: any, index: number, self: any[]) => index === self.findIndex(p => p.id === project.id)
                );

            setProjects(uniqueProjects);

            if (uniqueProjects.length > 0) {
                setSelectedProject(uniqueProjects[0]);
                await fetchProjectProgress(uniqueProjects[0].id);
            }
        } catch (error: any) {
            console.error("Error fetching projects:", error);

            // Check if it's an authentication error
            if (handleApiError(error, router, toast)) {
                return;
            }

            toast({
                title: "Error",
                description: "Failed to load projects",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const fetchProjectProgress = async (projectId: number) => {
        try {
            // Fetch progress data
            const progressResponse = await projectsService.getProjectProgress(projectId);
            setProgressData(progressResponse.data || []);

            // Fetch construction updates
            const updatesResponse = await projectsService.getConstructionUpdates(projectId);
            setUpdates(updatesResponse.data || []);
        } catch (error: any) {
            console.error("Error fetching project progress:", error);

            // Check if it's an authentication error
            if (handleApiError(error, router, toast)) {
                return;
            }

            toast({
                title: "Error",
                description: "Failed to load progress data",
                variant: "destructive",
            });
        }
    };

    useEffect(() => {
        fetchUserProjects();
    }, []);

    const refreshData = () => {
        fetchUserProjects();
        toast({
            title: "Refreshed",
            description: "Progress data updated",
        });
    };

    const handleProjectChange = async (project: any) => {
        setSelectedProject(project);
        await fetchProjectProgress(project.id);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "completed":
                return "bg-green-500/10 text-green-500 border-green-500/20";
            case "in-progress":
                return "bg-blue-500/10 text-blue-500 border-blue-500/20";
            case "pending":
                return "bg-gray-500/10 text-gray-500 border-gray-500/20";
            case "delayed":
                return "bg-red-500/10 text-red-500 border-red-500/20";
            default:
                return "bg-gray-500/10 text-gray-500 border-gray-500/20";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "completed":
                return <CheckCircle className="h-4 w-4" />;
            case "in-progress":
                return <Play className="h-4 w-4" />;
            case "delayed":
                return <AlertCircle className="h-4 w-4" />;
            default:
                return <Clock className="h-4 w-4" />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Construction Progress</h1>
                    <p className="text-muted-foreground">Track the progress of your property construction</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={refreshData}>
                        <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button variant="outline">
                        <FileText className="mr-2 h-4 w-4" />
                        Download Report
                    </Button>
                </div>
            </div>

            {isLoading ? (
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2 mt-2" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-32 w-full" />
                    </CardContent>
                </Card>
            ) : projects.length === 0 ? (
                <Card className="p-12">
                    <div className="text-center space-y-4">
                        <AlertCircle className="h-16 w-16 mx-auto text-muted-foreground" />
                        <div>
                            <h3 className="text-lg font-semibold">No projects found</h3>
                            <p className="text-sm text-muted-foreground">
                                You don't have any active construction projects.
                            </p>
                        </div>
                    </div>
                </Card>
            ) : selectedProject ? (
                <>
                    {/* Project Selector */}
                    {projects.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {projects.map((project: any) => (
                                <Button
                                    key={project.id}
                                    variant={selectedProject.id === project.id ? "default" : "outline"}
                                    onClick={() => handleProjectChange(project)}
                                    className="whitespace-nowrap"
                                >
                                    {project.project_name}
                                </Button>
                            ))}
                        </div>
                    )}

                    {/* Project Overview */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div>
                                    <CardTitle className="text-xl">{selectedProject.project_name}</CardTitle>
                                    <CardDescription className="mt-1">
                                        Builder: {selectedProject.builder?.full_name || "N/A"}
                                    </CardDescription>
                                </div>
                                <Badge className={getStatusColor(selectedProject.status || "in-progress")}>
                                    {selectedProject.status?.replace("_", " ") || "In Progress"}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-muted-foreground">Overall Progress</p>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-2xl font-bold">
                                                {progressData.length > 0
                                                    ? Math.round(
                                                          (progressData.filter((p: any) => p.status === "completed")
                                                              .length /
                                                              progressData.length) *
                                                              100
                                                      )
                                                    : 0}
                                                %
                                            </span>
                                            <span className="text-sm text-muted-foreground">Complete</span>
                                        </div>
                                        <Progress
                                            value={
                                                progressData.length > 0
                                                    ? (progressData.filter((p: any) => p.status === "completed")
                                                          .length /
                                                          progressData.length) *
                                                      100
                                                    : 0
                                            }
                                            className="h-2"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-muted-foreground">Timeline</p>
                                    <div className="space-y-1">
                                        <p className="flex items-center gap-2 text-sm">
                                            <Calendar className="h-4 w-4" />
                                            Expected:{" "}
                                            {selectedProject.expected_completion
                                                ? new Date(selectedProject.expected_completion).toLocaleDateString()
                                                : "TBD"}
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-muted-foreground">Actions</p>
                                    <div className="flex flex-col gap-2">
                                        <Button variant="outline" size="sm">
                                            View 3D Model
                                        </Button>
                                        <Button variant="outline" size="sm">
                                            Schedule Visit
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Tabs defaultValue="phases" className="space-y-6">
                        <TabsList>
                            <TabsTrigger value="phases">Construction Phases</TabsTrigger>
                            <TabsTrigger value="updates">Recent Updates</TabsTrigger>
                            <TabsTrigger value="timeline">Timeline View</TabsTrigger>
                        </TabsList>

                        <TabsContent value="phases" className="space-y-4">
                            {isLoading ? (
                                <Card>
                                    <CardHeader>
                                        <Skeleton className="h-6 w-3/4" />
                                    </CardHeader>
                                    <CardContent>
                                        <Skeleton className="h-20 w-full" />
                                    </CardContent>
                                </Card>
                            ) : progressData.length === 0 ? (
                                <Card className="p-8">
                                    <div className="text-center space-y-4">
                                        <Clock className="h-12 w-12 mx-auto text-muted-foreground" />
                                        <div>
                                            <h3 className="text-lg font-semibold">No progress data available</h3>
                                            <p className="text-sm text-muted-foreground">
                                                Progress tracking will be updated soon.
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            ) : (
                                progressData.map((phase: any, index: number) => (
                                    <Card key={index}>
                                        <CardHeader>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    {getStatusIcon(phase.status)}
                                                    <div>
                                                        <CardTitle className="text-lg">{phase.phase_name}</CardTitle>
                                                        <CardDescription>{phase.description}</CardDescription>
                                                    </div>
                                                </div>
                                                <Badge className={getStatusColor(phase.status)}>
                                                    {phase.status?.replace("_", " ")}
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <p className="text-sm font-medium text-muted-foreground">
                                                        Progress
                                                    </p>
                                                    <div className="space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-lg font-semibold">
                                                                {phase.completion_percentage || 0}%
                                                            </span>
                                                            <span className="text-sm text-muted-foreground">
                                                                Complete
                                                            </span>
                                                        </div>
                                                        <Progress
                                                            value={phase.completion_percentage || 0}
                                                            className="h-2"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <p className="text-sm font-medium text-muted-foreground">
                                                        Schedule
                                                    </p>
                                                    <div className="space-y-1">
                                                        <p className="text-sm">
                                                            Start:{" "}
                                                            {phase.start_date
                                                                ? new Date(phase.start_date).toLocaleDateString()
                                                                : "TBD"}
                                                        </p>
                                                        <p className="text-sm">
                                                            End:{" "}
                                                            {phase.end_date
                                                                ? new Date(phase.end_date).toLocaleDateString()
                                                                : "TBD"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </TabsContent>

                        <TabsContent value="updates" className="space-y-4">
                            {isLoading ? (
                                <Card>
                                    <CardHeader>
                                        <Skeleton className="h-6 w-3/4" />
                                    </CardHeader>
                                    <CardContent>
                                        <Skeleton className="h-32 w-full" />
                                    </CardContent>
                                </Card>
                            ) : updates.length === 0 ? (
                                <Card className="p-8">
                                    <div className="text-center space-y-4">
                                        <Camera className="h-12 w-12 mx-auto text-muted-foreground" />
                                        <div>
                                            <h3 className="text-lg font-semibold">No updates available</h3>
                                            <p className="text-sm text-muted-foreground">
                                                Construction updates will be posted here.
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            ) : (
                                updates.map((update: any) => (
                                    <Card key={update.id}>
                                        <CardHeader>
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <CardTitle className="text-lg">{update.title}</CardTitle>
                                                    <CardDescription className="flex items-center gap-2 mt-1">
                                                        <Calendar className="h-4 w-4" />
                                                        {new Date(update.update_date).toLocaleDateString()}
                                                    </CardDescription>
                                                </div>
                                                {update.images && update.images.length > 0 && (
                                                    <Button variant="outline" size="sm">
                                                        <Camera className="mr-2 h-4 w-4" />
                                                        View Photos
                                                    </Button>
                                                )}
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <p className="text-muted-foreground">{update.description}</p>
                                            {update.images && update.images.length > 0 && (
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    {update.images.map((image: string, index: number) => (
                                                        <div
                                                            key={index}
                                                            className="aspect-video bg-muted rounded-lg overflow-hidden"
                                                        >
                                                            <img
                                                                src={image || "/placeholder.svg"}
                                                                alt={`Update ${index + 1}`}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </TabsContent>

                        <TabsContent value="timeline" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Project Timeline</CardTitle>
                                    <CardDescription>Visual timeline of all construction phases</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        {progressData.length === 0 ? (
                                            <div className="text-center py-8">
                                                <p className="text-muted-foreground">No timeline data available</p>
                                            </div>
                                        ) : (
                                            progressData.map((phase: any, index: number) => (
                                                <div key={index} className="flex items-start gap-4">
                                                    <div className="flex flex-col items-center">
                                                        <div
                                                            className={`w-4 h-4 rounded-full border-2 ${
                                                                phase.status === "completed"
                                                                    ? "bg-green-500 border-green-500"
                                                                    : phase.status === "in_progress"
                                                                    ? "bg-blue-500 border-blue-500"
                                                                    : "bg-gray-200 border-gray-300"
                                                            }`}
                                                        />
                                                        {index < progressData.length - 1 && (
                                                            <div className="w-0.5 h-16 bg-gray-200 mt-2" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 pb-8">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <h3 className="font-semibold">{phase.phase_name}</h3>
                                                            <Badge
                                                                className={getStatusColor(phase.status)}
                                                                variant="outline"
                                                            >
                                                                {phase.completion_percentage || 0}%
                                                            </Badge>
                                                        </div>
                                                        <p className="text-sm text-muted-foreground mb-2">
                                                            {phase.description}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {phase.start_date
                                                                ? new Date(phase.start_date).toLocaleDateString()
                                                                : "TBD"}{" "}
                                                            -{" "}
                                                            {phase.end_date
                                                                ? new Date(phase.end_date).toLocaleDateString()
                                                                : "TBD"}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </>
            ) : null}
        </div>
    );
}
