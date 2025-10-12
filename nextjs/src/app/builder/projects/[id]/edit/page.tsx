"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { checkUserSession, handleApiError } from "@/lib/auth-utils";
import { projectsService } from "@/lib/services/projects.service";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditProjectPage() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        project_name: "",
        description: "",
        status: "",
        location_address: "",
        location_city: "",
        location_state: "",
        location_zipcode: "",
        project_area: "",
        price_range_min: "",
        price_range_max: "",
        amenities: "",
    });

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
                const project = response.data;
                setFormData({
                    project_name: project.project_name || "",
                    description: project.description || "",
                    status: project.status || "",
                    location_address: project.location_address || "",
                    location_city: project.location_city || "",
                    location_state: project.location_state || "",
                    location_zipcode: project.location_zipcode || "",
                    project_area: project.project_area?.toString() || "",
                    price_range_min: project.price_range_min?.toString() || "",
                    price_range_max: project.price_range_max?.toString() || "",
                    amenities: project.amenities ? project.amenities.join(", ") : "",
                });
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            // Parse amenities from comma-separated string to array
            const amenitiesArray = formData.amenities
                .split(",")
                .map(a => a.trim())
                .filter(a => a.length > 0);

            // Prepare update data
            const updateData: any = {
                project_name: formData.project_name,
                description: formData.description,
                status: formData.status,
                location_address: formData.location_address,
                location_city: formData.location_city,
                location_state: formData.location_state,
                location_zipcode: formData.location_zipcode,
            };

            // Add optional numeric fields only if they have values
            if (formData.project_area) {
                updateData.project_area = parseFloat(formData.project_area);
            }
            if (formData.price_range_min) {
                updateData.price_range_min = parseFloat(formData.price_range_min);
            }
            if (formData.price_range_max) {
                updateData.price_range_max = parseFloat(formData.price_range_max);
            }
            if (amenitiesArray.length > 0) {
                updateData.amenities = amenitiesArray;
            }

            const response = await projectsService.updateProject(Number(params.id), updateData);

            if (response.error) {
                handleApiError(response.error, router, toast);
                return;
            }

            toast({
                title: "Success",
                description: "Project updated successfully",
            });

            router.push(`/builder/projects/${params.id}`);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update project",
                variant: "destructive",
            });
        } finally {
            setSaving(false);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10" />
                    <Skeleton className="h-8 w-64" />
                </div>
                <div className="grid gap-6">
                    <Skeleton className="h-64" />
                    <Skeleton className="h-64" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href={`/builder/projects/${params.id}`}>
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">Edit Project</h1>
                        <p className="text-muted-foreground">Update project information</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                        <CardDescription>Update the basic details of your project</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="project_name">Project Name *</Label>
                                <Input
                                    id="project_name"
                                    value={formData.project_name}
                                    onChange={e => handleInputChange("project_name", e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="status">Status *</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={value => handleInputChange("status", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="PLANNING">Planning</SelectItem>
                                        <SelectItem value="ONGOING">Ongoing</SelectItem>
                                        <SelectItem value="COMPLETED">Completed</SelectItem>
                                        <SelectItem value="ON_HOLD">On Hold</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={e => handleInputChange("description", e.target.value)}
                                rows={3}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Location Details */}
                <Card>
                    <CardHeader>
                        <CardTitle>Location Details</CardTitle>
                        <CardDescription>Update the project location</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="location_address">Address</Label>
                            <Input
                                id="location_address"
                                value={formData.location_address}
                                onChange={e => handleInputChange("location_address", e.target.value)}
                            />
                        </div>
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="space-y-2">
                                <Label htmlFor="location_city">City</Label>
                                <Input
                                    id="location_city"
                                    value={formData.location_city}
                                    onChange={e => handleInputChange("location_city", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="location_state">State</Label>
                                <Input
                                    id="location_state"
                                    value={formData.location_state}
                                    onChange={e => handleInputChange("location_state", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="location_zipcode">Pincode</Label>
                                <Input
                                    id="location_zipcode"
                                    value={formData.location_zipcode}
                                    onChange={e => handleInputChange("location_zipcode", e.target.value)}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Project Details */}
                <Card>
                    <CardHeader>
                        <CardTitle>Project Details</CardTitle>
                        <CardDescription>Area and other specifications</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="project_area">Project Area (sq ft)</Label>
                            <Input
                                id="project_area"
                                type="number"
                                value={formData.project_area}
                                onChange={e => handleInputChange("project_area", e.target.value)}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Pricing & Amenities */}
                <Card>
                    <CardHeader>
                        <CardTitle>Pricing & Amenities</CardTitle>
                        <CardDescription>Update pricing and amenities</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="price_range_min">Minimum Price (₹)</Label>
                                <Input
                                    id="price_range_min"
                                    type="number"
                                    value={formData.price_range_min}
                                    onChange={e => handleInputChange("price_range_min", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="price_range_max">Maximum Price (₹)</Label>
                                <Input
                                    id="price_range_max"
                                    type="number"
                                    value={formData.price_range_max}
                                    onChange={e => handleInputChange("price_range_max", e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="amenities">Amenities (comma-separated)</Label>
                            <Textarea
                                id="amenities"
                                value={formData.amenities}
                                onChange={e => handleInputChange("amenities", e.target.value)}
                                placeholder="Swimming Pool, Gym, Parking, Garden"
                                rows={3}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Form Actions */}
                <div className="flex justify-end gap-4">
                    <Link href={`/builder/projects/${params.id}`}>
                        <Button type="button" variant="outline">
                            Cancel
                        </Button>
                    </Link>
                    <Button type="submit" disabled={saving}>
                        {saving ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4 mr-2" />
                                Save Changes
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
