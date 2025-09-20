"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Eye, Download, Maximize, RotateCcw, ZoomIn, ZoomOut } from "lucide-react"

const models = [
  {
    id: 1,
    name: "Sunset Residences - Unit A-204",
    type: "Unit Model",
    builder: "Premium Builders Ltd",
    uploadDate: "2024-01-15",
    fileSize: "45.2 MB",
    format: "GLB",
    thumbnail: "/3d-apartment-model.jpg",
    description: "Complete 3D model of your 2-bedroom unit with interior layout",
    status: "current",
  },
  {
    id: 2,
    name: "Sunset Residences - Building View",
    type: "Building Model",
    builder: "Premium Builders Ltd",
    uploadDate: "2024-01-10",
    fileSize: "128.7 MB",
    format: "GLB",
    thumbnail: "/placeholder-pjuv9.png",
    description: "Full building exterior with landscaping and surroundings",
    status: "current",
  },
  {
    id: 3,
    name: "Unit A-204 - Interior Design Option 1",
    type: "Interior Model",
    builder: "Premium Builders Ltd",
    uploadDate: "2024-01-20",
    fileSize: "32.1 MB",
    format: "GLB",
    thumbnail: "/3d-interior-design-modern.jpg",
    description: "Modern interior design option with contemporary furniture",
    status: "option",
  },
  {
    id: 4,
    name: "Unit A-204 - Interior Design Option 2",
    type: "Interior Model",
    builder: "Premium Builders Ltd",
    uploadDate: "2024-01-20",
    fileSize: "29.8 MB",
    format: "GLB",
    thumbnail: "/3d-interior-design-classic.jpg",
    description: "Classic interior design option with traditional furniture",
    status: "option",
  },
]

export default function Customer3DModelsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [selectedModel, setSelectedModel] = useState<(typeof models)[0] | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "current":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "option":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "archived":
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  const filteredModels = models.filter((model) => {
    const matchesSearch = model.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || model.type.toLowerCase().includes(typeFilter.toLowerCase())
    return matchesSearch && matchesType
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">3D Models</h1>
          <p className="text-muted-foreground">Explore 3D models of your property and design options</p>
        </div>
      </div>

      {selectedModel ? (
        // 3D Model Viewer
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => setSelectedModel(null)}>
              ← Back to Models
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button variant="outline" size="sm">
                <Maximize className="mr-2 h-4 w-4" />
                Fullscreen
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{selectedModel.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {selectedModel.builder} • {selectedModel.type}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(selectedModel.status)}>{selectedModel.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 3D Viewer Container */}
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center relative overflow-hidden">
                <img
                  src={selectedModel.thumbnail || "/placeholder.svg"}
                  alt={selectedModel.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-2xl font-bold mb-2">3D Model Viewer</div>
                    <div className="text-sm opacity-75">Interactive 3D model would load here</div>
                  </div>
                </div>

                {/* 3D Viewer Controls */}
                <div className="absolute bottom-4 left-4 flex gap-2">
                  <Button variant="secondary" size="sm">
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  <Button variant="secondary" size="sm">
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button variant="secondary" size="sm">
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Model Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">File Size:</span>
                      <span>{selectedModel.fileSize}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Format:</span>
                      <span>{selectedModel.format}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Upload Date:</span>
                      <span>{new Date(selectedModel.uploadDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Builder:</span>
                      <span>{selectedModel.builder}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold">Description</h3>
                  <p className="text-sm text-muted-foreground">{selectedModel.description}</p>
                  <div className="flex gap-2">
                    <Button size="sm">Request Changes</Button>
                    <Button variant="outline" size="sm">
                      Share Model
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        // Models Grid
        <>
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
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="unit">Unit Models</SelectItem>
                <SelectItem value="building">Building Models</SelectItem>
                <SelectItem value="interior">Interior Models</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Tabs defaultValue="current" className="space-y-6">
            <TabsList>
              <TabsTrigger value="current">Current Models</TabsTrigger>
              <TabsTrigger value="options">Design Options</TabsTrigger>
              <TabsTrigger value="archived">Archived</TabsTrigger>
            </TabsList>

            <TabsContent value="current" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredModels
                  .filter((model) => model.status === "current")
                  .map((model) => (
                    <Card key={model.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                      <CardContent className="p-0">
                        <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                          <img
                            src={model.thumbnail || "/placeholder.svg"}
                            alt={model.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-sm">{model.name}</h3>
                              <p className="text-xs text-muted-foreground mt-1">{model.type}</p>
                            </div>
                            <Badge className={getStatusColor(model.status)} variant="outline">
                              {model.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{model.description}</p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{model.fileSize}</span>
                            <span>{new Date(model.uploadDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" className="flex-1" onClick={() => setSelectedModel(model)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View 3D
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

            <TabsContent value="options" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredModels
                  .filter((model) => model.status === "option")
                  .map((model) => (
                    <Card key={model.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                      <CardContent className="p-0">
                        <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                          <img
                            src={model.thumbnail || "/placeholder.svg"}
                            alt={model.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-sm">{model.name}</h3>
                              <p className="text-xs text-muted-foreground mt-1">{model.type}</p>
                            </div>
                            <Badge className={getStatusColor(model.status)} variant="outline">
                              {model.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{model.description}</p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{model.fileSize}</span>
                            <span>{new Date(model.uploadDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" className="flex-1" onClick={() => setSelectedModel(model)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View 3D
                            </Button>
                            <Button variant="outline" size="sm">
                              Select
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="archived" className="space-y-4">
              <div className="text-center py-12">
                <p className="text-muted-foreground">No archived models found.</p>
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}
