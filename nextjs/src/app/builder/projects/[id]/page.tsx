"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { checkUserSession, handleApiError } from "@/lib/auth-utils";
import { projectsService } from "@/lib/services/projects.service";
import { ArrowLeft, Calendar, Edit, MapPin } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProjectDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = checkUserSession(router);
        if (!user) return;
        if (user.user_type !== "builder") {
            router.push("/login");
            return;
        }

        fetchProjectDetails();
    }, [params.id]);

    const fetchProjectDetails = async () => {
        setLoading(true);
        try {
            const response = await projectsService.getProject(Number(params.id));

            if (response.error) {
                handleApiError(response.error, router, toast);
                return;
            }

            if (response.data) {
                setProject(response.data);
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load project details",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string): "default" | "secondary" | "destructive" | "outline" => {
        const colors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
            PLANNING: "secondary",
            ONGOING: "default",
            COMPLETED: "outline",
            ON_HOLD: "destructive",
        };
        return colors[status] || "default";
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10" />
                    <Skeleton className="h-8 w-64" />
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                    <Skeleton className="h-64" />
                    <Skeleton className="h-64" />
                </div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/builder/projects">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold">Project Not Found</h1>
                </div>
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-muted-foreground">The requested project could not be found.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/builder/projects">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">{project.project_name}</h1>
                        <p className="text-muted-foreground">Project Details</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Link href={`/builder/projects/${project.id}/edit`}>
                        <Button variant="outline">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Project
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Project Overview */}
            <div className="grid gap-6 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Project Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Badge variant={getStatusColor(project.status)} className="text-lg px-4 py-1">
                            {project.status}
                        </Badge>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Total Units</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{project.total_units}</div>
                        <p className="text-xs text-muted-foreground">{project.available_units} available</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Project Area</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {project.project_area ? `${project.project_area} sq ft` : "N/A"}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Project Information */}
            <Card>
                <CardHeader>
                    <CardTitle>Project Information</CardTitle>
                    <CardDescription>Basic details about the project</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground mb-1">Project Type</h3>
                            <p className="font-medium">{project.project_type}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
                            <p className="font-medium">{project.description || "No description provided"}</p>
                        </div>
                    </div>

                    <Separator />

                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-3">Location</h3>
                        <div className="space-y-2">
                            <div className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                                <div>
                                    <p className="font-medium">{project.location_address || "Address not provided"}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {project.location_city}, {project.location_state} - {project.location_zipcode}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground mb-1">Start Date</h3>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <p className="font-medium">
                                    {project.start_date ? new Date(project.start_date).toLocaleDateString() : "Not set"}
                                </p>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground mb-1">Expected Completion</h3>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <p className="font-medium">
                                    {project.expected_completion_date
                                        ? new Date(project.expected_completion_date).toLocaleDateString()
                                        : "Not set"}
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Pricing Information */}
            <Card>
                <CardHeader>
                    <CardTitle>Pricing Information</CardTitle>
                    <CardDescription>Price range and financial details</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground mb-1">Minimum Price</h3>
                            <p className="text-2xl font-bold">
                                {project.price_range_min
                                    ? `₹${Number(project.price_range_min).toLocaleString()}`
                                    : "N/A"}
                            </p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground mb-1">Maximum Price</h3>
                            <p className="text-2xl font-bold">
                                {project.price_range_max
                                    ? `₹${Number(project.price_range_max).toLocaleString()}`
                                    : "N/A"}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Amenities */}
            {project.amenities && project.amenities.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Amenities</CardTitle>
                        <CardDescription>Available facilities and features</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {project.amenities.map((amenity: string, index: number) => (
                                <Badge key={index} variant="secondary">
                                    {amenity}
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
