"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Camera, FileText, Clock, CheckCircle, AlertCircle, Play } from "lucide-react"

const projects = [
  {
    id: 1,
    name: "Sunset Residences - Unit A-204",
    builder: "Premium Builders Ltd",
    startDate: "2024-01-01",
    expectedCompletion: "2024-12-15",
    overallProgress: 35,
    status: "on-track",
    phases: [
      {
        name: "Foundation",
        progress: 100,
        status: "completed",
        startDate: "2024-01-01",
        endDate: "2024-02-15",
        description: "Excavation, foundation laying, and basement construction",
      },
      {
        name: "Structure",
        progress: 75,
        status: "in-progress",
        startDate: "2024-02-16",
        endDate: "2024-05-30",
        description: "Frame construction, walls, and roofing",
      },
      {
        name: "MEP Installation",
        progress: 20,
        status: "in-progress",
        startDate: "2024-04-01",
        endDate: "2024-07-15",
        description: "Mechanical, Electrical, and Plumbing systems",
      },
      {
        name: "Interior Finishing",
        progress: 0,
        status: "pending",
        startDate: "2024-07-16",
        endDate: "2024-10-30",
        description: "Flooring, painting, fixtures, and interior work",
      },
      {
        name: "Final Inspection",
        progress: 0,
        status: "pending",
        startDate: "2024-11-01",
        endDate: "2024-12-15",
        description: "Quality checks, certifications, and handover",
      },
    ],
    updates: [
      {
        id: 1,
        title: "Foundation Work Completed",
        description: "All foundation work has been completed successfully. Ready to move to structure phase.",
        date: "2024-02-15",
        images: ["/construction-foundation.png"],
        phase: "Foundation",
      },
      {
        id: 2,
        title: "Frame Construction Progress",
        description: "75% of the frame construction is complete. All major structural elements are in place.",
        date: "2024-03-20",
        images: ["/building-frame-construction.jpg"],
        phase: "Structure",
      },
      {
        id: 3,
        title: "Electrical Rough-in Started",
        description: "Electrical rough-in work has begun. All major electrical panels installed.",
        date: "2024-04-05",
        images: ["/electrical-installation.png"],
        phase: "MEP Installation",
      },
    ],
  },
]

export default function CustomerProgressPage() {
  const [selectedProject] = useState(projects[0])

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
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "in-progress":
        return <Play className="h-4 w-4" />
      case "delayed":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Construction Progress</h1>
          <p className="text-muted-foreground">Track the progress of your property construction</p>
        </div>
        <Button variant="outline">
          <FileText className="mr-2 h-4 w-4" />
          Download Report
        </Button>
      </div>

      {/* Project Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl">{selectedProject.name}</CardTitle>
              <CardDescription className="mt-1">Builder: {selectedProject.builder}</CardDescription>
            </div>
            <Badge className={getStatusColor(selectedProject.status)}>{selectedProject.status.replace("-", " ")}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Overall Progress</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{selectedProject.overallProgress}%</span>
                  <span className="text-sm text-muted-foreground">Complete</span>
                </div>
                <Progress value={selectedProject.overallProgress} className="h-2" />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Timeline</p>
              <div className="space-y-1">
                <p className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  Started: {new Date(selectedProject.startDate).toLocaleDateString()}
                </p>
                <p className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  Expected: {new Date(selectedProject.expectedCompletion).toLocaleDateString()}
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
          {selectedProject.phases.map((phase, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(phase.status)}
                    <div>
                      <CardTitle className="text-lg">{phase.name}</CardTitle>
                      <CardDescription>{phase.description}</CardDescription>
                    </div>
                  </div>
                  <Badge className={getStatusColor(phase.status)}>{phase.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Progress</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold">{phase.progress}%</span>
                        <span className="text-sm text-muted-foreground">Complete</span>
                      </div>
                      <Progress value={phase.progress} className="h-2" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Schedule</p>
                    <div className="space-y-1">
                      <p className="text-sm">Start: {new Date(phase.startDate).toLocaleDateString()}</p>
                      <p className="text-sm">End: {new Date(phase.endDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="updates" className="space-y-4">
          {selectedProject.updates.map((update) => (
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
                  <Button variant="outline" size="sm">
                    <Camera className="mr-2 h-4 w-4" />
                    View Photos
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{update.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {update.images.map((image, index) => (
                    <div key={index} className="aspect-video bg-muted rounded-lg overflow-hidden">
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Update ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Timeline</CardTitle>
              <CardDescription>Visual timeline of all construction phases</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {selectedProject.phases.map((phase, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-4 h-4 rounded-full border-2 ${
                          phase.status === "completed"
                            ? "bg-green-500 border-green-500"
                            : phase.status === "in-progress"
                              ? "bg-blue-500 border-blue-500"
                              : "bg-gray-200 border-gray-300"
                        }`}
                      />
                      {index < selectedProject.phases.length - 1 && <div className="w-0.5 h-16 bg-gray-200 mt-2" />}
                    </div>
                    <div className="flex-1 pb-8">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{phase.name}</h3>
                        <Badge className={getStatusColor(phase.status)} variant="outline">
                          {phase.progress}%
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{phase.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(phase.startDate).toLocaleDateString()} -{" "}
                        {new Date(phase.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
