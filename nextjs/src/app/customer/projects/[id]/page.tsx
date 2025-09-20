"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MapPin, Building2, Star, Heart, Share2, Bed, Bath, Square, Eye, BookOpen } from "lucide-react"
import Link from "next/link"

export default function CustomerProjectDetailsPage({ params }: { params: { id: string } }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  // Mock data - replace with real API calls
  const project = {
    id: Number.parseInt(params.id),
    name: "Sunset Residences",
    location: "Downtown District",
    address: "123 Sunset Boulevard, Downtown, City 12345",
    description:
      "A modern residential complex featuring luxury apartments with stunning city views and premium amenities. Experience urban living at its finest with thoughtfully designed spaces and world-class facilities.",
    priceRange: "$85,000 - $165,000",
    totalUnits: 24,
    availableUnits: 6,
    bedrooms: "1-3",
    bathrooms: "1-2",
    area: "650-1200 sq ft",
    rating: 4.8,
    reviews: 24,
    builder: "BuildCraft Construction",
    architect: "Modern Design Studio",
    completionDate: "December 2024",
    status: "In Progress",
    progress: 75,
    images: ["/sunset-1.jpg", "/sunset-2.jpg", "/sunset-3.jpg", "/sunset-4.jpg"],
    amenities: [
      "Swimming Pool",
      "Fitness Center",
      "Rooftop Garden",
      "24/7 Security",
      "Concierge Service",
      "Parking Garage",
      "Children's Playground",
      "Business Center",
      "Spa & Wellness",
      "Community Lounge",
    ],
    specifications: {
      "Building Height": "12 floors",
      "Total Area": "2.5 acres",
      "Parking Spaces": "48 covered",
      Elevators: "2 high-speed",
      "Construction Type": "RCC with modern finishes",
      Approval: "RERA approved",
    },
  }

  const units = [
    {
      id: 1,
      unitNumber: "A101",
      floor: 1,
      type: "1 Bedroom",
      bedrooms: 1,
      bathrooms: 1,
      area: 650,
      price: "$85,000",
      status: "Available",
      facing: "East",
    },
    {
      id: 2,
      unitNumber: "A102",
      floor: 1,
      type: "2 Bedroom",
      bedrooms: 2,
      bathrooms: 2,
      area: 950,
      price: "$125,000",
      status: "Reserved",
      facing: "North",
    },
    {
      id: 3,
      unitNumber: "A201",
      floor: 2,
      type: "1 Bedroom",
      bedrooms: 1,
      bathrooms: 1,
      area: 650,
      price: "$87,000",
      status: "Available",
      facing: "East",
    },
    {
      id: 4,
      unitNumber: "A202",
      floor: 2,
      type: "3 Bedroom",
      bedrooms: 3,
      bathrooms: 2,
      area: 1200,
      price: "$165,000",
      status: "Available",
      facing: "West",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "outline"
      case "Reserved":
        return "secondary"
      case "Sold":
        return "destructive"
      default:
        return "secondary"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link href="/customer/projects" className="text-muted-foreground hover:text-foreground">
              Browse Projects
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground">{project.name}</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground">{project.name}</h1>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {project.location}
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{project.rating}</span>
              <span className="text-muted-foreground">({project.reviews} reviews)</span>
            </div>
            <Badge variant={project.status === "In Progress" ? "default" : "secondary"}>{project.status}</Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Heart className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Link href={`/customer/projects/${project.id}/book`}>
            <Button>
              <BookOpen className="h-4 w-4 mr-2" />
              Book Now
            </Button>
          </Link>
        </div>
      </div>

      {/* Image Gallery */}
      <Card>
        <CardContent className="p-0">
          <div className="aspect-video bg-muted relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <Building2 className="h-16 w-16 text-muted-foreground" />
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex gap-2 overflow-x-auto">
                {project.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`w-16 h-12 bg-background/80 rounded flex items-center justify-center ${
                      activeImageIndex === index ? "ring-2 ring-accent" : ""
                    }`}
                  >
                    <Building2 className="h-6 w-6 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Project Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Price Range</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{project.priceRange}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Available Units</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{project.availableUnits}</div>
            <p className="text-xs text-muted-foreground">of {project.totalUnits} total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{project.completionDate}</div>
            <p className="text-xs text-muted-foreground">{project.progress}% complete</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Builder</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{project.builder}</div>
            <p className="text-xs text-muted-foreground">Trusted developer</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabbed Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="units">Available Units</TabsTrigger>
          <TabsTrigger value="amenities">Amenities</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="location">Location</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About This Project</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">{project.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Bed className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{project.bedrooms} Bedrooms</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{project.bathrooms} Bathrooms</span>
                </div>
                <div className="flex items-center gap-2">
                  <Square className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{project.area}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <h4 className="font-semibold mb-2">Project Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Builder:</span>
                    <span className="ml-2 font-medium">{project.builder}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Architect:</span>
                    <span className="ml-2 font-medium">{project.architect}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Address:</span>
                    <span className="ml-2 font-medium">{project.address}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Expected Completion:</span>
                    <span className="ml-2 font-medium">{project.completionDate}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="units" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Available Units</CardTitle>
              <CardDescription>Choose from our available units and floor plans</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Unit</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Specifications</TableHead>
                      <TableHead>Facing</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {units.map((unit) => (
                      <TableRow key={unit.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{unit.unitNumber}</div>
                            <div className="text-sm text-muted-foreground">Floor {unit.floor}</div>
                          </div>
                        </TableCell>
                        <TableCell>{unit.type}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <Bed className="h-3 w-3" />
                              {unit.bedrooms}
                            </div>
                            <div className="flex items-center gap-1">
                              <Bath className="h-3 w-3" />
                              {unit.bathrooms}
                            </div>
                            <div className="flex items-center gap-1">
                              <Square className="h-3 w-3" />
                              {unit.area} sq ft
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{unit.facing}</TableCell>
                        <TableCell>
                          <span className="font-medium">{unit.price}</span>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(unit.status)}>{unit.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              View Plan
                            </Button>
                            {unit.status === "Available" && (
                              <Link href={`/customer/projects/${project.id}/book?unit=${unit.id}`}>
                                <Button size="sm">
                                  <BookOpen className="h-4 w-4 mr-2" />
                                  Book
                                </Button>
                              </Link>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="amenities" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Amenities</CardTitle>
              <CardDescription>Premium facilities and features available to residents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {project.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border border-border rounded-lg">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <span className="text-foreground">{amenity}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="specifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Technical Specifications</CardTitle>
              <CardDescription>Detailed project specifications and features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(project.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center p-3 border border-border rounded-lg">
                    <span className="text-muted-foreground">{key}</span>
                    <span className="font-medium text-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="location" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Location & Connectivity</CardTitle>
              <CardDescription>Project location and nearby landmarks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Interactive Map</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="font-medium">Address:</p>
                <p className="text-muted-foreground">{project.address}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
