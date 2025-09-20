"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Filter, MoreHorizontal, Eye, Edit, Trash2, MapPin, Users, Calendar } from "lucide-react"
import Link from "next/link"

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Mock data - replace with real API calls
  const projects = [
    {
      id: 1,
      name: "Sunset Residences",
      location: "Downtown District",
      status: "In Progress",
      progress: 75,
      totalUnits: 24,
      bookedUnits: 18,
      availableUnits: 6,
      startDate: "2024-01-15",
      expectedCompletion: "2024-12-30",
      budget: "$2.4M",
      bookings: 8,
    },
    {
      id: 2,
      name: "Green Valley Homes",
      location: "Suburban Area",
      status: "Planning",
      progress: 25,
      totalUnits: 36,
      bookedUnits: 12,
      availableUnits: 24,
      startDate: "2024-03-01",
      expectedCompletion: "2025-06-15",
      budget: "$3.6M",
      bookings: 12,
    },
    {
      id: 3,
      name: "Urban Towers",
      location: "City Center",
      status: "In Progress",
      progress: 60,
      totalUnits: 48,
      bookedUnits: 30,
      availableUnits: 18,
      startDate: "2023-09-01",
      expectedCompletion: "2024-08-30",
      budget: "$4.8M",
      bookings: 5,
    },
    {
      id: 4,
      name: "Riverside Apartments",
      location: "Waterfront",
      status: "Completed",
      progress: 100,
      totalUnits: 20,
      bookedUnits: 20,
      availableUnits: 0,
      startDate: "2023-01-01",
      expectedCompletion: "2023-12-15",
      budget: "$2.0M",
      bookings: 0,
    },
    {
      id: 5,
      name: "Mountain View Villas",
      location: "Hillside",
      status: "On Hold",
      progress: 15,
      totalUnits: 12,
      bookedUnits: 3,
      availableUnits: 9,
      startDate: "2024-02-01",
      expectedCompletion: "2025-01-30",
      budget: "$1.8M",
      bookings: 2,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress":
        return "default"
      case "Planning":
        return "secondary"
      case "Completed":
        return "outline"
      case "On Hold":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || project.status.toLowerCase().replace(" ", "-") === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Projects</h1>
          <p className="text-muted-foreground">Manage your construction projects and track progress</p>
        </div>
        <Link href="/builder/projects/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="planning">Planning</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="on-hold">On Hold</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Projects Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Projects ({filteredProjects.length})</CardTitle>
          <CardDescription>Overview of your construction projects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Units</TableHead>
                  <TableHead>Bookings</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Completion</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium text-foreground">{project.name}</div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {project.location}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(project.status)}>{project.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{project.totalUnits} total</div>
                        <div className="text-muted-foreground">{project.availableUnits} available</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{project.bookings}</span>
                        <span className="text-muted-foreground">pending</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{project.budget}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {project.expectedCompletion}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/builder/projects/${project.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/builder/projects/${project.id}/edit`}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Project
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Project
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
