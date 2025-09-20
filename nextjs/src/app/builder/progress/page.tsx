"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Camera, Upload, Plus, Edit, Eye } from "lucide-react"

const projects = [
  {
    id: 1,
    name: "Sunset Residences",
    totalUnits: 120,
    completedUnits: 42,
    overallProgress: 35,
    status: "on-track",
    phases: [
      { name: "Foundation", progress: 100, status: "completed" },
      { name: "Structure", progress: 75, status: "in-progress" },
      { name: "MEP Installation", progress: 20, status: "in-progress" },
      { name: "Interior Finishing", progress: 0, status: "pending" },
      { name: "Final Inspection", progress: 0, status: "pending" },
    ],
  },
  {
    id: 2,
    name: "Green Valley Homes",
    totalUnits: 80,
    completedUnits: 15,
    overallProgress: 18,
    status: "on-track",
    phases: [
      { name: "Foundation", progress: 60, status: "in-progress" },
      { name: "Structure", progress: 0, status: "pending" },
      { name: "MEP Installation", progress: 0, status: "pending" },
      { name: "Interior Finishing", progress: 0, status: "pending" },
      { name: "Final Inspection", progress: 0, status: "pending" },
    ],
  },
]

const recentUpdates = [
  {
    id: 1,
    project: "Sunset Residences",
    title: "Foundation Work Completed - Block A",
    description: "All foundation work for Block A has been completed successfully. Ready to move to structure phase.",
    date: "2024-01-24",
    phase: "Foundation",
    images: 3,
    status: "published",
  },
  {
    id: 2,
    project: "Green Valley Homes",
    title: "Site Preparation Progress",
    description: "60% of site preparation work completed. Excavation for Phase 1 buildings in progress.",
    date: "2024-01-23",
    phase: "Foundation",
    images: 5,
    status: "published",
  },
  {
    id: 3,
    project: "Sunset Residences",
    title: "Electrical Rough-in Update",
    description: "Electrical rough-in work progressing well. All major panels installed in Block A.",
    date: "2024-01-22",
    phase: "MEP Installation",
    images: 2,
    status: "draft",
  },
]

export default function BuilderProgressPage() {
  const [selectedProject, setSelectedProject] = useState(projects[0])
  const [showUpdateForm, setShowUpdateForm] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "in-progress":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "pending":
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
      case "delayed":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      case "on-track":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "published":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "draft":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Progress Tracking</h1>
          <p className="text-muted-foreground">Track and update construction progress for all projects</p>
        </div>
        <Button onClick={() => setShowUpdateForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Progress Update
        </Button>
      </div>

      {/* Project Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Project Overview</CardTitle>
          <CardDescription>Select a project to view and update progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((project) => (
              <Card
                key={project.id}
                className={`cursor-pointer transition-all ${
                  selectedProject.id === project.id ? "ring-2 ring-primary" : "hover:shadow-md"
                }`}
                onClick={() => setSelectedProject(project)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{project.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {project.completedUnits} of {project.totalUnits} units completed
                      </p>
                    </div>
                    <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Overall Progress</span>
                      <span className="font-medium">{project.overallProgress}%</span>
                    </div>
                    <Progress value={project.overallProgress} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="phases" className="space-y-6">
        <TabsList>
          <TabsTrigger value="phases">Construction Phases</TabsTrigger>
          <TabsTrigger value="updates">Progress Updates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="phases" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{selectedProject.name} - Construction Phases</CardTitle>
              <CardDescription>Track progress across different construction phases</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedProject.phases.map((phase, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{phase.name}</h4>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(phase.status)} variant="outline">
                          {phase.status}
                        </Badge>
                        <span className="text-sm font-medium">{phase.progress}%</span>
                      </div>
                    </div>
                    <Progress value={phase.progress} className="h-2" />
                  </div>
                  <div className="ml-4">
                    <Button variant="outline" size="sm">
                      <Edit className="mr-2 h-4 w-4" />
                      Update
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="updates" className="space-y-4">
          {recentUpdates
            .filter((update) => update.project === selectedProject.name)
            .map((update) => (
              <Card key={update.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{update.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(update.date).toLocaleDateString()} • {update.phase}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(update.status)}>{update.status}</Badge>
                      <Button variant="outline" size="sm">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{update.description}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Camera className="h-4 w-4" />
                      {update.images} photos
                    </span>
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Completion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{selectedProject.overallProgress}%</div>
                <p className="text-sm text-muted-foreground mt-1">Overall project completion</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Units Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{selectedProject.completedUnits}</div>
                <p className="text-sm text-muted-foreground mt-1">of {selectedProject.totalUnits} total units</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Project Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge className={getStatusColor(selectedProject.status)} variant="outline">
                  {selectedProject.status}
                </Badge>
                <p className="text-sm text-muted-foreground mt-2">Current project status</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Progress Update Modal/Form */}
      {showUpdateForm && (
        <Card className="fixed inset-4 z-50 bg-background shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Add Progress Update</CardTitle>
              <Button variant="outline" onClick={() => setShowUpdateForm(false)}>
                Cancel
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Project</label>
                <Select defaultValue={selectedProject.name}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.name}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phase</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select phase" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="foundation">Foundation</SelectItem>
                    <SelectItem value="structure">Structure</SelectItem>
                    <SelectItem value="mep">MEP Installation</SelectItem>
                    <SelectItem value="interior">Interior Finishing</SelectItem>
                    <SelectItem value="inspection">Final Inspection</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Update Title</label>
              <Input placeholder="Enter update title..." />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea placeholder="Describe the progress update..." rows={4} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Photos</label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Click to upload photos or drag and drop</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button>Publish Update</Button>
              <Button variant="outline">Save as Draft</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
