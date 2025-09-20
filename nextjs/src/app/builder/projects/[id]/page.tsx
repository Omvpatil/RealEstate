"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MapPin, Edit, Save, Plus, Eye, Bed, Bath, Square } from "lucide-react"
import Link from "next/link"

export default function ProjectDetailsPage({ params }: { params: { id: string } }) {
  const [isEditing, setIsEditing] = useState(false)

  // Mock data - replace with real API calls
  const project = {
    id: Number.parseInt(params.id),
    name: "Sunset Residences",
    description:
      "A modern residential complex featuring luxury apartments with stunning city views and premium amenities.",
    location: "Downtown District",
    address: "123 Sunset Boulevard, Downtown, City 12345",
    status: "In Progress",
    progress: 75,
    totalUnits: 24,
    bookedUnits: 18,
    availableUnits: 6,
    startDate: "2024-01-15",
    expectedCompletion: "2024-12-30",
    budget: "$2.4M",
    spent: "$1.8M",
    bookings: 8,
    developer: "BuildCraft Construction",
    architect: "Modern Design Studio",
    contractor: "Elite Builders Inc.",
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
      floorPlan: "/floor-plan-1-bedroom.jpg",
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
      status: "Booked",
      floorPlan: "/2-bedroom-floor-plan.png",
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
      floorPlan: "/floor-plan-1-bedroom.jpg",
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
      status: "Reserved",
      floorPlan: "/3-bedroom-floor-plan.png",
    },
  ]

  const amenities = [
    "Swimming Pool",
    "Fitness Center",
    "Rooftop Garden",
    "Parking Garage",
    "24/7 Security",
    "Concierge Service",
    "Children's Playground",
    "Business Center",
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "outline"
      case "Booked":
        return "default"
      case "Reserved":
        return "secondary"
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
            <Link href="/builder/projects" className="text-muted-foreground hover:text-foreground">
              Projects
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
            <Badge variant={project.status === "In Progress" ? "default" : "secondary"}>{project.status}</Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
            <Edit className="h-4 w-4 mr-2" />
            {isEditing ? "Cancel" : "Edit"}
          </Button>
          {isEditing && (
            <Button>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          )}
        </div>
      </div>

      {/* Project Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{project.progress}%</div>
            <Progress value={project.progress} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Units</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-1">{project.totalUnits}</div>
            <p className="text-xs text-muted-foreground">{project.availableUnits} available</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-1">{project.budget}</div>
            <p className="text-xs text-muted-foreground">{project.spent} spent</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-1">{project.bookings}</div>
            <p className="text-xs text-muted-foreground">pending approval</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabbed Content */}
      <Tabs defaultValue="details" className="space-y-6">
        <TabsList>
          <TabsTrigger value="details">Project Details</TabsTrigger>
          <TabsTrigger value="units">Units & Floor Plans</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="amenities">Amenities</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Information</CardTitle>
              <CardDescription>Basic details about the construction project</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="project-name">Project Name</Label>
                  <Input id="project-name" value={project.name} disabled={!isEditing} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" value={project.location} disabled={!isEditing} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input id="start-date" type="date" value={project.startDate} disabled={!isEditing} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="completion-date">Expected Completion</Label>
                  <Input id="completion-date" type="date" value={project.expectedCompletion} disabled={!isEditing} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={project.description} disabled={!isEditing} rows={3} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Full Address</Label>
                <Input id="address" value={project.address} disabled={!isEditing} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="units" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Units & Floor Plans</CardTitle>
                <CardDescription>Manage individual units and their specifications</CardDescription>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Unit
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Unit</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Specifications</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Floor Plan</TableHead>
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
                        <TableCell>
                          <span className="font-medium">{unit.price}</span>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(unit.status)}>{unit.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View Plan
                          </Button>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pricing Configuration</CardTitle>
              <CardDescription>Set pricing for different unit types and configurations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>1 Bedroom Units</Label>
                    <Input placeholder="$85,000" disabled={!isEditing} />
                  </div>
                  <div className="space-y-2">
                    <Label>2 Bedroom Units</Label>
                    <Input placeholder="$125,000" disabled={!isEditing} />
                  </div>
                  <div className="space-y-2">
                    <Label>3 Bedroom Units</Label>
                    <Input placeholder="$165,000" disabled={!isEditing} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Price per Square Foot</Label>
                    <Input placeholder="$130" disabled={!isEditing} />
                  </div>
                  <div className="space-y-2">
                    <Label>Booking Deposit</Label>
                    <Input placeholder="$5,000" disabled={!isEditing} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="amenities" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Amenities</CardTitle>
              <CardDescription>Features and facilities available in this project</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 border border-border rounded-lg">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <span className="text-foreground">{amenity}</span>
                  </div>
                ))}
              </div>
              {isEditing && (
                <div className="mt-4">
                  <Button variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Amenity
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
