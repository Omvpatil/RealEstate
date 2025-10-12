"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { checkUserSession } from "@/lib/auth-utils";
import { projectsService } from "@/lib/services/projects.service";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function NewProjectPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const currentUser = checkUserSession(router, toast);
        if (currentUser) {
            setUser(currentUser);
        }
    }, [router, toast]);

    const [formData, setFormData] = useState({
        project_name: "",
        description: "",
        project_type: "",
        location_address: "",
        location_city: "",
        location_state: "",
        location_pincode: "",
        total_units: "",
        start_date: "",
        expected_completion_date: "",
        total_area: "",
        price_range_min: "",
        price_range_max: "",
        amenities: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Check if user is logged in
            if (!user || !user.id) {
                toast({
                    title: "Authentication Error",
                    description: "Please login again to continue.",
                    variant: "destructive",
                });
                router.push("/login");
                return;
            }

            // Check if builder_id exists
            if (!user.builder_id) {
                toast({
                    title: "Error",
                    description: "Builder profile not found. Please contact support.",
                    variant: "destructive",
                });
                setLoading(false);
                return;
            }

            // Validate required fields
            if (!formData.project_name || !formData.project_type || !formData.location_city) {
                toast({
                    title: "Validation Error",
                    description: "Please fill in all required fields",
                    variant: "destructive",
                });
                setLoading(false);
                return;
            }

            // Parse amenities (comma-separated string to array)
            const amenitiesArray = formData.amenities
                ? formData.amenities
                      .split(",")
                      .map(a => a.trim())
                      .filter(Boolean)
                : [];

            const projectData = {
                builder_id: user.builder_id, // Use builder_id from user object
                project_name: formData.project_name,
                description: formData.description,
                project_type: formData.project_type,
                location_address: formData.location_address,
                location_city: formData.location_city,
                location_state: formData.location_state,
                location_zipcode: formData.location_pincode,
                total_units: parseInt(formData.total_units) || 0,
                available_units: parseInt(formData.total_units) || 0, // Initially all units are available
                start_date: formData.start_date,
                expected_completion_date: formData.expected_completion_date,
                project_area: parseFloat(formData.total_area) || undefined,
                price_range_min: parseFloat(formData.price_range_min) || undefined,
                price_range_max: parseFloat(formData.price_range_max) || undefined,
                amenities: amenitiesArray,
            };

            const response = await projectsService.createProject(projectData);

            if (response.error) {
                // Handle validation errors (array of error objects)
                let errorMessage = "Failed to create project";

                if (Array.isArray(response.error.detail)) {
                    // FastAPI validation errors
                    errorMessage = response.error.detail.map((err: any) => err.msg || JSON.stringify(err)).join(", ");
                } else if (typeof response.error.detail === "string") {
                    errorMessage = response.error.detail;
                } else if (response.error.message) {
                    errorMessage = response.error.message;
                }

                toast({
                    title: "Error",
                    description: errorMessage,
                    variant: "destructive",
                });
                return;
            }

            toast({
                title: "Success",
                description: "Project created successfully!",
            });

            router.push("/builder/projects");
        } catch (error) {
            toast({
                title: "Error",
                description: "An unexpected error occurred",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/builder/projects">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Create New Project</h1>
                    <p className="text-muted-foreground">Add a new construction project to your portfolio</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                {/* Basic Information */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                        <CardDescription>Enter the project's basic details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="project_name">
                                    Project Name <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="project_name"
                                    value={formData.project_name}
                                    onChange={e => handleInputChange("project_name", e.target.value)}
                                    placeholder="Enter project name"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="project_type">
                                    Project Type <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                    value={formData.project_type}
                                    onValueChange={value => handleInputChange("project_type", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select project type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="residential">Residential</SelectItem>
                                        <SelectItem value="commercial">Commercial</SelectItem>
                                        <SelectItem value="mixed_use">Mixed Use</SelectItem>
                                        <SelectItem value="industrial">Industrial</SelectItem>
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
                                placeholder="Enter project description"
                                rows={4}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Location Details */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Location Details</CardTitle>
                        <CardDescription>Specify where the project is located</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="location_address">Address</Label>
                            <Input
                                id="location_address"
                                value={formData.location_address}
                                onChange={e => handleInputChange("location_address", e.target.value)}
                                placeholder="Street address"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="location_city">
                                    City <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="location_city"
                                    value={formData.location_city}
                                    onChange={e => handleInputChange("location_city", e.target.value)}
                                    placeholder="City"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="location_state">State</Label>
                                <Input
                                    id="location_state"
                                    value={formData.location_state}
                                    onChange={e => handleInputChange("location_state", e.target.value)}
                                    placeholder="State"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="location_pincode">Pincode</Label>
                                <Input
                                    id="location_pincode"
                                    value={formData.location_pincode}
                                    onChange={e => handleInputChange("location_pincode", e.target.value)}
                                    placeholder="Pincode"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Project Details */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Project Details</CardTitle>
                        <CardDescription>Enter project specifications and timeline</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="total_units">Total Units</Label>
                                <Input
                                    id="total_units"
                                    type="number"
                                    value={formData.total_units}
                                    onChange={e => handleInputChange("total_units", e.target.value)}
                                    placeholder="Number of units"
                                    min="0"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="total_area">Total Area (sq ft)</Label>
                                <Input
                                    id="total_area"
                                    type="number"
                                    value={formData.total_area}
                                    onChange={e => handleInputChange("total_area", e.target.value)}
                                    placeholder="Total area in square feet"
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="start_date">Start Date</Label>
                                <Input
                                    id="start_date"
                                    type="date"
                                    value={formData.start_date}
                                    onChange={e => handleInputChange("start_date", e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="expected_completion_date">Expected Completion Date</Label>
                                <Input
                                    id="expected_completion_date"
                                    type="date"
                                    value={formData.expected_completion_date}
                                    onChange={e => handleInputChange("expected_completion_date", e.target.value)}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Pricing & Amenities */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Pricing & Amenities</CardTitle>
                        <CardDescription>Set price range and list amenities</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="price_range_min">Minimum Price</Label>
                                <Input
                                    id="price_range_min"
                                    type="number"
                                    value={formData.price_range_min}
                                    onChange={e => handleInputChange("price_range_min", e.target.value)}
                                    placeholder="Minimum price"
                                    min="0"
                                    step="0.01"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="price_range_max">Maximum Price</Label>
                                <Input
                                    id="price_range_max"
                                    type="number"
                                    value={formData.price_range_max}
                                    onChange={e => handleInputChange("price_range_max", e.target.value)}
                                    placeholder="Maximum price"
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="amenities">Amenities (comma-separated)</Label>
                            <Textarea
                                id="amenities"
                                value={formData.amenities}
                                onChange={e => handleInputChange("amenities", e.target.value)}
                                placeholder="e.g., Swimming Pool, Gym, Parking, Security"
                                rows={3}
                            />
                            <p className="text-sm text-muted-foreground">Enter amenities separated by commas</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Submit Button */}
                <div className="flex justify-end gap-4">
                    <Link href="/builder/projects">
                        <Button type="button" variant="outline" disabled={loading}>
                            Cancel
                        </Button>
                    </Link>
                    <Button type="submit" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {loading ? "Creating..." : "Create Project"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
