"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calendar,
  Clock,
  DollarSign,
  FileText,
  Plus,
  Search,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react"

const changeRequests = [
  {
    id: 1,
    title: "Kitchen Cabinet Upgrade",
    description: "Request to upgrade kitchen cabinets from standard to premium oak finish",
    project: "Sunset Residences - Unit A-204",
    category: "Interior",
    priority: "medium",
    status: "pending",
    submittedDate: "2024-01-20",
    estimatedCost: 5000,
    estimatedDays: 7,
    builder: "Premium Builders Ltd",
    builderResponse: null,
    attachments: ["kitchen-design.pdf", "cabinet-samples.jpg"],
  },
  {
    id: 2,
    title: "Bathroom Tile Change",
    description: "Change bathroom tiles from ceramic to marble finish in master bathroom",
    project: "Sunset Residences - Unit A-204",
    category: "Interior",
    priority: "low",
    status: "approved",
    submittedDate: "2024-01-15",
    estimatedCost: 2500,
    estimatedDays: 3,
    builder: "Premium Builders Ltd",
    builderResponse: "Approved. Work will be scheduled during interior finishing phase.",
    responseDate: "2024-01-18",
    attachments: ["marble-samples.jpg"],
  },
  {
    id: 3,
    title: "Additional Electrical Outlet",
    description: "Add extra electrical outlet in living room for entertainment center",
    project: "Sunset Residences - Unit A-204",
    category: "Electrical",
    priority: "high",
    status: "rejected",
    submittedDate: "2024-01-10",
    estimatedCost: 300,
    estimatedDays: 1,
    builder: "Premium Builders Ltd",
    builderResponse: "Cannot accommodate as electrical rough-in is already completed for this unit.",
    responseDate: "2024-01-12",
    attachments: [],
  },
  {
    id: 4,
    title: "Balcony Railing Design",
    description: "Request to change balcony railing from standard to glass panels",
    project: "Sunset Residences - Unit A-204",
    category: "Exterior",
    priority: "medium",
    status: "in-review",
    submittedDate: "2024-01-22",
    estimatedCost: 1800,
    estimatedDays: 5,
    builder: "Premium Builders Ltd",
    builderResponse: null,
    attachments: ["glass-railing-design.pdf"],
  },
]

export default function CustomerChangeRequestsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showNewRequestForm, setShowNewRequestForm] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "rejected":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "in-review":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4" />
      case "rejected":
        return <XCircle className="h-4 w-4" />
      case "in-review":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      case "medium":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "low":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  const filteredRequests = changeRequests.filter((request) => {
    const matchesSearch =
      request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || request.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Change Requests</h1>
          <p className="text-muted-foreground">Request modifications to your property construction</p>
        </div>
        <Button onClick={() => setShowNewRequestForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Request
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search change requests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in-review">In Review</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Requests ({filteredRequests.length})</TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({filteredRequests.filter((r) => r.status === "pending").length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({filteredRequests.filter((r) => r.status === "approved").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredRequests.map((request) => (
            <Card key={request.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      {getStatusIcon(request.status)}
                      {request.title}
                    </CardTitle>
                    <CardDescription className="mt-1">{request.project}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getPriorityColor(request.priority)} variant="outline">
                      {request.priority}
                    </Badge>
                    <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{request.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Request Details</p>
                    <div className="space-y-1">
                      <p className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4" />
                        Submitted: {new Date(request.submittedDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm">Category: {request.category}</p>
                      <p className="text-sm">Builder: {request.builder}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Cost & Timeline</p>
                    <div className="space-y-1">
                      <p className="flex items-center gap-2 text-sm">
                        <DollarSign className="h-4 w-4" />
                        Estimated: ${request.estimatedCost.toLocaleString()}
                      </p>
                      <p className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4" />
                        Duration: {request.estimatedDays} days
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Attachments</p>
                    <div className="space-y-1">
                      {request.attachments.length > 0 ? (
                        request.attachments.map((attachment, index) => (
                          <p key={index} className="flex items-center gap-2 text-sm">
                            <FileText className="h-4 w-4" />
                            {attachment}
                          </p>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No attachments</p>
                      )}
                    </div>
                  </div>
                </div>

                {request.builderResponse && (
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="h-4 w-4" />
                      <p className="text-sm font-medium">Builder Response</p>
                      {request.responseDate && (
                        <span className="text-xs text-muted-foreground">
                          • {new Date(request.responseDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{request.builderResponse}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  {request.status === "pending" && (
                    <Button variant="outline" size="sm">
                      Edit Request
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Message Builder
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {filteredRequests
            .filter((request) => request.status === "pending")
            .map((request) => (
              <Card key={request.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        {getStatusIcon(request.status)}
                        {request.title}
                      </CardTitle>
                      <CardDescription className="mt-1">{request.project}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor(request.priority)} variant="outline">
                        {request.priority}
                      </Badge>
                      <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{request.description}</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      Edit Request
                    </Button>
                    <Button variant="outline" size="sm">
                      Cancel Request
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          {filteredRequests
            .filter((request) => request.status === "approved")
            .map((request) => (
              <Card key={request.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        {getStatusIcon(request.status)}
                        {request.title}
                      </CardTitle>
                      <CardDescription className="mt-1">{request.project}</CardDescription>
                    </div>
                    <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{request.description}</p>
                  {request.builderResponse && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <p className="text-sm font-medium text-green-800">Approved</p>
                      </div>
                      <p className="text-sm text-green-700">{request.builderResponse}</p>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      Track Progress
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>
      </Tabs>

      {/* New Request Form Modal */}
      {showNewRequestForm && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Submit Change Request</CardTitle>
                <Button variant="outline" onClick={() => setShowNewRequestForm(false)}>
                  Cancel
                </Button>
              </div>
              <CardDescription>Request modifications to your property construction</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Project</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sunset-residences">Sunset Residences - Unit A-204</SelectItem>
                      <SelectItem value="green-valley">Green Valley Homes - Unit B-105</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="interior">Interior</SelectItem>
                      <SelectItem value="exterior">Exterior</SelectItem>
                      <SelectItem value="electrical">Electrical</SelectItem>
                      <SelectItem value="plumbing">Plumbing</SelectItem>
                      <SelectItem value="structural">Structural</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Request Title</label>
                <Input placeholder="Brief title for your change request..." />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea placeholder="Detailed description of the changes you want to make..." rows={4} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Priority</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Attachments</label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <FileText className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Click to upload files or drag and drop</p>
                  <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG files up to 10MB each</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1">Submit Request</Button>
                <Button variant="outline" onClick={() => setShowNewRequestForm(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
