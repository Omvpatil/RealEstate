"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { projectsService } from "@/lib/services";
import { Building2, Eye, Filter, Heart, MapPin, RefreshCw, Search, Square } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ProjectBrowsePage() {
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState("");
    const [locationFilter, setLocationFilter] = useState("all");
    const [propertyType, setPropertyType] = useState("all");
    const [priceRange, setPriceRange] = useState([0, 1000000]);
    const [showFilters, setShowFilters] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [projects, setProjects] = useState<any[]>([]);

    const fetchProjects = async () => {
        setIsLoading(true);
        try {
            const params: any = {
                page: 1,
                limit: 20,
            };

            if (locationFilter && locationFilter !== "all") {
                params.location = locationFilter;
            }

            if (propertyType && propertyType !== "all") {
                params.project_type = propertyType;
            }

            if (priceRange[0] > 0) {
                params.min_price = priceRange[0];
            }

            if (priceRange[1] < 1000000) {
                params.max_price = priceRange[1];
            }

            const response = await projectsService.getProjects(params);

            if (response.data) {
                setProjects(response.data.projects);
            } else if (response.error) {
                toast({
                    title: "Error",
                    description: response.error.message || "Failed to load projects",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error("Error fetching projects:", error);
            toast({
                title: "Error",
                description: "Failed to load projects",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, [locationFilter, propertyType, priceRange]);

    const refreshProjects = () => {
        fetchProjects();
        toast({
            title: "Refreshed",
            description: "Projects updated",
        });
    };

    const filteredProjects = projects.filter(project => {
        const matchesSearch =
            project.project_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.description?.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesSearch;
    });

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-10 w-64" />
                    <Skeleton className="h-10 w-32" />
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <Skeleton key={i} className="h-96" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Browse Projects</h1>
                    <p className="text-muted-foreground">Discover your perfect home from our construction projects</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={refreshProjects}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                    </Button>
                    <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
                        <Filter className="h-4 w-4 mr-2" />
                        Filters
                    </Button>
                </div>
            </div>

            {/* Search and Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="space-y-4">
                        {/* Search Bar */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search projects, locations, or amenities..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        {/* Filters */}
                        {showFilters && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border">
                                <div className="space-y-2">
                                    <Label>Location</Label>
                                    <Select value={locationFilter} onValueChange={setLocationFilter}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="All Locations" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Locations</SelectItem>
                                            <SelectItem value="downtown">Downtown District</SelectItem>
                                            <SelectItem value="suburban">Suburban Area</SelectItem>
                                            <SelectItem value="city">City Center</SelectItem>
                                            <SelectItem value="waterfront">Waterfront</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Property Type</Label>
                                    <Select value={propertyType} onValueChange={setPropertyType}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="All Types" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Types</SelectItem>
                                            <SelectItem value="apartment">Apartment</SelectItem>
                                            <SelectItem value="house">House</SelectItem>
                                            <SelectItem value="condo">Condo</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>
                                        Price Range: ${priceRange[0].toLocaleString()} - $
                                        {priceRange[1].toLocaleString()}
                                    </Label>
                                    <Slider
                                        value={priceRange}
                                        onValueChange={setPriceRange}
                                        max={500000}
                                        min={50000}
                                        step={10000}
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Results */}
            <div className="flex items-center justify-between">
                <p className="text-muted-foreground">
                    {filteredProjects.length} project{filteredProjects.length !== 1 ? "s" : ""} found
                </p>
            </div>

            {/* Empty State */}
            {filteredProjects.length === 0 && (
                <Card className="p-12">
                    <div className="text-center space-y-4">
                        <Building2 className="h-16 w-16 mx-auto text-muted-foreground" />
                        <div>
                            <h3 className="text-lg font-semibold">No projects found</h3>
                            <p className="text-sm text-muted-foreground">
                                {searchTerm
                                    ? `No results for "${searchTerm}". Try adjusting your filters.`
                                    : "No projects available at the moment."}
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setSearchTerm("");
                                setLocationFilter("all");
                                setPropertyType("all");
                            }}
                        >
                            Clear Filters
                        </Button>
                    </div>
                </Card>
            )}

            {/* Project Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map(project => (
                    <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="aspect-video bg-muted relative">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Building2 className="h-12 w-12 text-muted-foreground" />
                            </div>
                            <div className="absolute top-4 left-4">
                                <Badge variant={project.status === "completed" ? "outline" : "default"}>
                                    {project.status?.replace("_", " ") || "Active"}
                                </Badge>
                            </div>
                            <div className="absolute top-4 right-4">
                                <Button variant="ghost" size="sm" className="bg-background/80 hover:bg-background">
                                    <Heart className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div>
                                    <CardTitle className="text-lg">{project.project_name}</CardTitle>
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                        <MapPin className="h-3 w-3" />
                                        {project.location}
                                    </div>
                                </div>
                                <Badge variant={project.status === "in_progress" ? "default" : "secondary"}>
                                    {project.status?.replace("_", " ")}
                                </Badge>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>

                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1">
                                        <Building2 className="h-3 w-3" />
                                        {project.total_units} units
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Square className="h-3 w-3" />
                                        {project.available_units} available
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-1">
                                {project.amenities &&
                                    project.amenities.slice(0, 3).map((amenity: string) => (
                                        <Badge key={amenity} variant="secondary" className="text-xs">
                                            {amenity}
                                        </Badge>
                                    ))}
                                {project.amenities && project.amenities.length > 3 && (
                                    <Badge variant="secondary" className="text-xs">
                                        +{project.amenities.length - 3} more
                                    </Badge>
                                )}
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-lg font-bold text-foreground">
                                        ${project.price_range_start?.toLocaleString()} - $
                                        {project.price_range_end?.toLocaleString()}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {project.available_units} units available
                                    </p>
                                </div>
                                <Link href={`/customer/projects/${project.id}`}>
                                    <Button>
                                        <Eye className="h-4 w-4 mr-2" />
                                        View Details
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredProjects.length === 0 && (
                <Card>
                    <CardContent className="py-12 text-center">
                        <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">No projects found</h3>
                        <p className="text-muted-foreground">Try adjusting your search criteria or filters</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
