"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Search, Filter, MapPin, Building2, Eye, Heart, Bed, Bath, Square, Star } from "lucide-react"
import Link from "next/link"

export default function ProjectBrowsePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [locationFilter, setLocationFilter] = useState("all")
  const [propertyType, setPropertyType] = useState("all")
  const [priceRange, setPriceRange] = useState([50000, 500000])
  const [showFilters, setShowFilters] = useState(false)

  // Mock data - replace with real API calls
  const projects = [
    {
      id: 1,
      name: "Sunset Residences",
      location: "Downtown District",
      description: "Modern luxury apartments with stunning city views and premium amenities.",
      priceRange: "$85,000 - $165,000",
      minPrice: 85000,
      maxPrice: 165000,
      totalUnits: 24,
      availableUnits: 6,
      bedrooms: "1-3",
      bathrooms: "1-2",
      area: "650-1200 sq ft",
      amenities: ["Swimming Pool", "Fitness Center", "Parking", "Security"],
      rating: 4.8,
      reviews: 24,
      image: "/sunset-residences.jpg",
      gallery: ["/sunset-1.jpg", "/sunset-2.jpg", "/sunset-3.jpg"],
      builder: "BuildCraft Construction",
      completionDate: "Dec 2024",
      status: "In Progress",
    },
    {
      id: 2,
      name: "Green Valley Homes",
      location: "Suburban Area",
      description: "Family-friendly homes in a peaceful suburban setting with green spaces.",
      priceRange: "$120,000 - $180,000",
      minPrice: 120000,
      maxPrice: 180000,
      totalUnits: 36,
      availableUnits: 24,
      bedrooms: "2-4",
      bathrooms: "2-3",
      area: "900-1500 sq ft",
      amenities: ["Playground", "Garden", "Parking", "Community Center"],
      rating: 4.6,
      reviews: 18,
      image: "/green-valley-homes.jpg",
      gallery: ["/green-1.jpg", "/green-2.jpg", "/green-3.jpg"],
      builder: "BuildCraft Construction",
      completionDate: "Jun 2025",
      status: "Planning",
    },
    {
      id: 3,
      name: "Urban Towers",
      location: "City Center",
      description: "High-rise living with panoramic city views and modern conveniences.",
      priceRange: "$200,000 - $350,000",
      minPrice: 200000,
      maxPrice: 350000,
      totalUnits: 48,
      availableUnits: 18,
      bedrooms: "1-3",
      bathrooms: "1-2",
      area: "550-1100 sq ft",
      amenities: ["Rooftop Garden", "Concierge", "Gym", "Business Center"],
      rating: 4.9,
      reviews: 32,
      image: "/urban-towers.jpg",
      gallery: ["/urban-1.jpg", "/urban-2.jpg", "/urban-3.jpg"],
      builder: "Elite Builders Inc.",
      completionDate: "Aug 2024",
      status: "In Progress",
    },
    {
      id: 4,
      name: "Riverside Apartments",
      location: "Waterfront",
      description: "Waterfront living with beautiful river views and marina access.",
      priceRange: "$150,000 - $250,000",
      minPrice: 150000,
      maxPrice: 250000,
      totalUnits: 20,
      availableUnits: 0,
      bedrooms: "1-2",
      bathrooms: "1-2",
      area: "700-1000 sq ft",
      amenities: ["Marina", "Waterfront", "Parking", "Security"],
      rating: 4.7,
      reviews: 15,
      image: "/riverside-apartments.jpg",
      gallery: ["/riverside-1.jpg", "/riverside-2.jpg", "/riverside-3.jpg"],
      builder: "Waterfront Developers",
      completionDate: "Completed",
      status: "Completed",
    },
  ]

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesLocation =
      locationFilter === "all" || project.location.toLowerCase().includes(locationFilter.toLowerCase())

    const matchesPrice = project.minPrice <= priceRange[1] && project.maxPrice >= priceRange[0]

    return matchesSearch && matchesLocation && matchesPrice
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Browse Projects</h1>
          <p className="text-muted-foreground">Discover your perfect home from our construction projects</p>
        </div>
        <div className="flex gap-2">
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
                onChange={(e) => setSearchTerm(e.target.value)}
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
                    Price Range: ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}
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

      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video bg-muted relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <Building2 className="h-12 w-12 text-muted-foreground" />
              </div>
              <div className="absolute top-4 left-4">
                <Badge variant={project.status === "Completed" ? "outline" : "default"}>{project.status}</Badge>
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
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {project.location}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{project.rating}</span>
                  <span className="text-sm text-muted-foreground">({project.reviews})</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Bed className="h-3 w-3" />
                    {project.bedrooms}
                  </div>
                  <div className="flex items-center gap-1">
                    <Bath className="h-3 w-3" />
                    {project.bathrooms}
                  </div>
                  <div className="flex items-center gap-1">
                    <Square className="h-3 w-3" />
                    {project.area}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {project.amenities.slice(0, 3).map((amenity) => (
                  <Badge key={amenity} variant="secondary" className="text-xs">
                    {amenity}
                  </Badge>
                ))}
                {project.amenities.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{project.amenities.length - 3} more
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-foreground">{project.priceRange}</p>
                  <p className="text-xs text-muted-foreground">{project.availableUnits} units available</p>
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
  )
}
