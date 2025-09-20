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
  Search,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
} from "lucide-react"

const changeRequests = [
  {
    id: 1,
    title: "Kitchen Cabinet Upgrade",
    description: "Request to upgrade kitchen cabinets from standard to premium oak finish",
    project: "Sunset Residences - Unit A-204",
    customer: "John Smith",
    category: "Interior",
    priority: "medium",
    status: "pending",
    submittedDate: "2024-01-20",
    estimatedCost: 5000,
    estimatedDays: 7,
    attachments: ["kitchen-design.pdf", "cabinet-samples.jpg"],
  },
  {
    id: 2,
    title: "Bathroom Tile Change",
    description: "Change bathroom tiles from ceramic to marble finish in master bathroom",
    project: "Sunset Residences - Unit A-204",
    customer: "John Smith",
    category: "Interior",
    priority: "low",
    status: "approved",
    submittedDate: "2024-01-15",
    estimatedCost: 2500,
    estimatedDays: 3,
    responseDate: "2024-01-18",
    attachments: ["marble-samples.jpg"],
  },
  {
    id: 3,
    title: "Additional Electrical Outlet",
    description: "Add extra electrical outlet in living room for entertainment center",
    project: "Sunset Residences - Unit A-204",
    customer: "John Smith",
    category: "Electrical",
    priority: "high",
    status: "rejected",
    submittedDate: "2024-01-10",
    estimatedCost: 300,
    estimatedDays: 1,
    responseDate: "2024-01-12",
    attachments: [],
  },
  {
    id: 4,
    title: "Balcony Railing Design",
    description: "Request to change balcony railing from standard to glass panels",
    project: "Sunset Residences - Unit A-204",
    customer: "John Smith",
    category: "Exterior",
    priority: "medium",
    status: "in-review",
    submittedDate: "2024-01-22",
    estimatedCost: 1800,
    estimatedDays: 5,
    attachments: ["glass-railing-design.pdf"],
  },
  {
    id: 5,
    title: "Flooring Material Change",
    description: "Change from laminate to hardwood flooring in all bedrooms",
    project: "Green Valley Homes - Unit B-105",
    customer: "Sarah Johnson",
    category: "Interior",
    priority: "medium",
    status: "pending",
    submittedDate: "2024-01-24",
    estimatedCost: 8000,
    estimatedDays: 10,
    attachments: ["hardwood-samples.jpg"],
  },
]

export default function BuilderChangeRequestsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [projectFilter, setProjectFilter] = useState("all")
  const [selectedRequest, setSelectedRequest] = useState<(typeof changeRequests)[0] | null>(null)
  const [showResponseForm, setShowResponseForm] = useState(false)

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
      request.customer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || request.status === statusFilter
    const matchesProject = projectFilter === "all" || request.project.includes(projectFilter)
    return matchesSearch && matchesStatus && matchesProject
  })

  const pendingCount = changeRequests.filter((r) => r.status === "pending").length
  const reviewCount = changeRequests.filter((r) => r.status === "in-review").length

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Change Requests</h1>
          <p className="text-muted-foreground">Review and respond to customer change requests</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
            {pendingCount} Pending
          </Badge>
          <Badge variant="outline" className="text-blue-600 border-blue-600">
            {reviewCount} In Review
          </Badge>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by title or customer..."
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
        <Select value={projectFilter} onValueChange={setProjectFilter}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Filter by project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            <SelectItem value="Sunset Residences">Sunset Residences</SelectItem>
            <SelectItem value="Green Valley">Green Valley Homes</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Requests ({filteredRequests.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingCount})</TabsTrigger>
          <TabsTrigger value="review">In Review ({reviewCount})</TabsTrigger>
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
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <User className="h-4 w-4" />
                      {request.customer} • {request.project}
                    </CardDescription>
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
                      <p className="text-sm">Customer: {request.customer}</p>
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

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedRequest(request)
                      setShowResponseForm(true)
                    }}
                    disabled={request.status === "approved" || request.status === "rejected"}
                  >
                    {request.status === "pending" ? "Review" : "Respond"}
                  </Button>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Message Customer
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
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <User className="h-4 w-4" />
                        {request.customer} • {request.project}
                      </CardDescription>
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
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedRequest(request)
                        setShowResponseForm(true)
                      }}
                    >
                      Review Request
                    </Button>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Contact Customer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="review" className="space-y-4">
          {filteredRequests
            .filter((request) => request.status === "in-review")
            .map((request) => (
              <Card key={request.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        {getStatusIcon(request.status)}
                        {request.title}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <User className="h-4 w-4" />
                        {request.customer} • {request.project}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{request.description}</p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedRequest(request)
                        setShowResponseForm(true)
                      }}
                    >
                      Complete Review
                    </Button>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>
      </Tabs>

      {/* Response Form Modal */}
      {showResponseForm && selectedRequest && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Respond to Change Request</CardTitle>
                <Button variant="outline" onClick={() => setShowResponseForm(false)}>
                  Cancel
                </Button>
              </div>
              <CardDescription>
                {selectedRequest.title} - {selectedRequest.customer}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Original Request</h4>
                <p className="text-sm text-muted-foreground">{selectedRequest.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Decision</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select decision" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="approve">Approve</SelectItem>
                      <SelectItem value="reject">Reject</SelectItem>
                      <SelectItem value="needs-review">Needs More Review</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Revised Cost (if applicable)</label>
                  <Input
                    type="number"
                    placeholder="Enter revised cost..."
                    defaultValue={selectedRequest.estimatedCost}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Response Message</label>
                <Textarea placeholder="Provide detailed response to the customer..." rows={4} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Timeline Impact</label>
                <Textarea placeholder="Explain any impact on project timeline..." rows={2} />
              </div>

              <div className="flex gap-2">
                <Button className="flex-1">Send Response</Button>
                <Button variant="outline" onClick={() => setShowResponseForm(false)}>
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
