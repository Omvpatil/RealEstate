"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Eye, Download, Edit, Trash2, Plus } from "lucide-react"

const models = [
  {
    id: 1,
    name: "Sunset Residences - Building A",
    project: "Sunset Residences",
    type: "Building Model",
    uploadDate: "2024-01-15",
    fileSize: "128.7 MB",
    format: "GLB",
    thumbnail: "/placeholder-67md9.png",
    description: "Complete building exterior with landscaping",
    status: "published",
    views: 45,
    downloads: 12,
  },
  {
    id: 2,
    name: "Unit Type A - 2 Bedroom",
    project: "Sunset Residences",
    type: "Unit Model",
    uploadDate: "2024-01-20",
    fileSize: "45.2 MB",
    format: "GLB",
    thumbnail: "/3d-apartment-unit.jpg",
    description: "Standard 2-bedroom unit layout with furniture",
    status: "published",
    views: 78,
    downloads: 23,
  },
  {
    id: 3,
    name: "Interior Design Option 1",
    project: "Sunset Residences",
    type: "Interior Model",
    uploadDate: "2024-01-22",
    fileSize: "32.1 MB",
    format: "GLB",
    thumbnail: "/modern-interior.png",
    description: "Modern interior design with contemporary furniture",
    status: "draft",
    views: 12,
    downloads: 3,
  },
  {
    id: 4,
    name: "Green Valley - Phase 1",
    project: "Green Valley Homes",
    type: "Site Model",
    uploadDate: "2024-01-25",
    fileSize: "89.4 MB",
    format: "GLB",
    thumbnail: "/construction-site-model.jpg",
    description: "Complete site layout with all buildings and amenities",
    status: "published",
    views: 34,
    downloads: 8,
  },
]

export default function Builder3DModelsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [projectFilter, setProjectFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "draft":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "archived":
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  const filteredModels = models.filter((model) => {
    const matchesSearch = model.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesProject = projectFilter === "all" || model.project === projectFilter
    const matchesType = typeFilter === "all" || model.type === typeFilter
    return matchesSearch && matchesProject && matchesType
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">3D Models</h1>
          <p className="text-muted-foreground">Manage and share 3D models with your customers</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Upload Model
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search models..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={projectFilter} onValueChange={setProjectFilter}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Filter by project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            <SelectItem value="Sunset Residences">Sunset Residences</SelectItem>
            <SelectItem value="Green Valley Homes">Green Valley Homes</SelectItem>
            <SelectItem value="Marina Heights">Marina Heights</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Building Model">Building Model</SelectItem>
            <SelectItem value="Unit Model">Unit Model</SelectItem>
            <SelectItem value="Interior Model">Interior Model</SelectItem>
            <SelectItem value="Site Model">Site Model</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Models ({filteredModels.length})</TabsTrigger>
          <TabsTrigger value="published">
            Published ({filteredModels.filter((m) => m.status === "published").length})
          </TabsTrigger>
          <TabsTrigger value="draft">Drafts ({filteredModels.filter((m) => m.status === "draft").length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredModels.map((model) => (
              <Card key={model.id}>
                <CardContent className="p-0">
                  <div className="aspect-video bg-muted rounded-t-lg overflow-hidden relative">
                    <img
                      src={model.thumbnail || "/placeholder.svg"}
                      alt={model.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className={getStatusColor(model.status)} variant="outline">
                        {model.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold text-sm">{model.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {model.project} • {model.type}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">{model.description}</p>
                    <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                      <div>
                        <span className="font-medium">{model.views}</span>
                        <br />
                        <span>Views</span>
                      </div>
                      <div>
                        <span className="font-medium">{model.downloads}</span>
                        <br />
                        <span>Downloads</span>
                      </div>
                      <div>
                        <span className="font-medium">{model.fileSize}</span>
                        <br />
                        <span>Size</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="published" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredModels
              .filter((model) => model.status === "published")
              .map((model) => (
                <Card key={model.id}>
                  <CardContent className="p-0">
                    <div className="aspect-video bg-muted rounded-t-lg overflow-hidden relative">
                      <img
                        src={model.thumbnail || "/placeholder.svg"}
                        alt={model.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge className={getStatusColor(model.status)} variant="outline">
                          {model.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      <div>
                        <h3 className="font-semibold text-sm">{model.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {model.project} • {model.type}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">{model.description}</p>
                      <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                        <div>
                          <span className="font-medium">{model.views}</span>
                          <br />
                          <span>Views</span>
                        </div>
                        <div>
                          <span className="font-medium">{model.downloads}</span>
                          <br />
                          <span>Downloads</span>
                        </div>
                        <div>
                          <span className="font-medium">{model.fileSize}</span>
                          <br />
                          <span>Size</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="mr-2 h-4 w-4" />
                          Preview
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="draft" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredModels
              .filter((model) => model.status === "draft")
              .map((model) => (
                <Card key={model.id}>
                  <CardContent className="p-0">
                    <div className="aspect-video bg-muted rounded-t-lg overflow-hidden relative">
                      <img
                        src={model.thumbnail || "/placeholder.svg"}
                        alt={model.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge className={getStatusColor(model.status)} variant="outline">
                          {model.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      <div>
                        <h3 className="font-semibold text-sm">{model.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {model.project} • {model.type}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">{model.description}</p>
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">
                          Publish
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
