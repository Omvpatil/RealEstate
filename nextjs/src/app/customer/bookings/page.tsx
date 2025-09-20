"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, MapPin, Filter, Search } from "lucide-react"

const bookings = [
  {
    id: 1,
    projectName: "Sunset Residences",
    unitType: "2 Bedroom",
    unitNumber: "A-204",
    status: "confirmed",
    bookingDate: "2024-01-15",
    amount: 50000,
    builder: "Premium Builders Ltd",
    nextPayment: "2024-02-15",
    completionDate: "2024-12-15",
  },
  {
    id: 2,
    projectName: "Green Valley Homes",
    unitType: "3 Bedroom",
    unitNumber: "B-105",
    status: "pending",
    bookingDate: "2024-01-20",
    amount: 75000,
    builder: "EcoConstruct Inc",
    nextPayment: "2024-02-20",
    completionDate: "2025-06-20",
  },
]

const preBookings = [
  {
    id: 3,
    projectName: "Marina Heights",
    unitType: "1 Bedroom",
    status: "pre-booked",
    preBookingDate: "2024-01-10",
    amount: 25000,
    builder: "Coastal Developers",
    validUntil: "2024-03-10",
  },
]

export default function CustomerBookingsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "pre-booked":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Bookings</h1>
          <p className="text-muted-foreground">Manage your property bookings and pre-bookings</p>
        </div>
        <Button>New Booking</Button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search bookings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-48">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="pre-booked">Pre-booked</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="bookings" className="space-y-6">
        <TabsList>
          <TabsTrigger value="bookings">Active Bookings</TabsTrigger>
          <TabsTrigger value="pre-bookings">Pre-bookings</TabsTrigger>
        </TabsList>

        <TabsContent value="bookings" className="space-y-4">
          {bookings.map((booking) => (
            <Card key={booking.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{booking.projectName}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <MapPin className="h-4 w-4" />
                      {booking.unitType} - Unit {booking.unitNumber}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Booking Details</p>
                    <div className="space-y-1">
                      <p className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4" />
                        Booked: {new Date(booking.bookingDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm">Amount: ${booking.amount.toLocaleString()}</p>
                      <p className="text-sm">Builder: {booking.builder}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Payment Schedule</p>
                    <div className="space-y-1">
                      <p className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4" />
                        Next Payment: {new Date(booking.nextPayment).toLocaleDateString()}
                      </p>
                      <p className="text-sm">Completion: {new Date(booking.completionDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Actions</p>
                    <div className="flex flex-col gap-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        Payment History
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="pre-bookings" className="space-y-4">
          {preBookings.map((booking) => (
            <Card key={booking.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{booking.projectName}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <MapPin className="h-4 w-4" />
                      {booking.unitType}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Pre-booking Details</p>
                    <div className="space-y-1">
                      <p className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4" />
                        Pre-booked: {new Date(booking.preBookingDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm">Amount: ${booking.amount.toLocaleString()}</p>
                      <p className="text-sm">Builder: {booking.builder}</p>
                      <p className="text-sm text-orange-600">
                        Valid until: {new Date(booking.validUntil).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Actions</p>
                    <div className="flex flex-col gap-2">
                      <Button size="sm">Convert to Booking</Button>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
