import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Building2, Calendar, Eye, MapPin, Clock, Bell, ArrowRight, Search } from "lucide-react"
import Link from "next/link"

export default function CustomerDashboard() {
  // Mock data - replace with real API calls
  const customerName = "John Smith"

  const stats = {
    bookedProperties: 2,
    upcomingAppointments: 3,
    activeProjects: 2,
    notifications: 5,
  }

  const bookedProperties = [
    {
      id: 1,
      name: "Sunset Residences",
      unit: "A102",
      location: "Downtown District",
      status: "In Progress",
      progress: 75,
      nextMilestone: "Interior Finishing",
      bookingDate: "2024-01-15",
      expectedCompletion: "2024-12-30",
      image: "/sunset-residences.jpg",
    },
    {
      id: 2,
      name: "Green Valley Homes",
      unit: "B205",
      location: "Suburban Area",
      status: "Foundation",
      progress: 35,
      nextMilestone: "Structural Work",
      bookingDate: "2024-02-20",
      expectedCompletion: "2025-06-15",
      image: "/green-valley-homes.jpg",
    },
  ]

  const upcomingAppointments = [
    {
      id: 1,
      project: "Sunset Residences",
      type: "Site Visit",
      date: "Today",
      time: "2:00 PM",
      builder: "BuildCraft Construction",
      status: "Confirmed",
    },
    {
      id: 2,
      project: "Green Valley Homes",
      type: "Design Review",
      date: "Tomorrow",
      time: "10:00 AM",
      builder: "BuildCraft Construction",
      status: "Pending",
    },
    {
      id: 3,
      project: "Sunset Residences",
      type: "Progress Update",
      date: "Dec 22",
      time: "3:00 PM",
      builder: "BuildCraft Construction",
      status: "Confirmed",
    },
  ]

  const recentNotifications = [
    {
      id: 1,
      title: "Construction Progress Update",
      message: "Sunset Residences has reached 75% completion",
      time: "2 hours ago",
      type: "progress",
      read: false,
    },
    {
      id: 2,
      title: "Appointment Reminder",
      message: "Site visit scheduled for today at 2:00 PM",
      time: "4 hours ago",
      type: "appointment",
      read: false,
    },
    {
      id: 3,
      title: "Change Request Approved",
      message: "Your kitchen upgrade request has been approved",
      time: "1 day ago",
      type: "change",
      read: true,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress":
        return "default"
      case "Foundation":
        return "secondary"
      case "Completed":
        return "outline"
      default:
        return "secondary"
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome back, {customerName}!</h1>
          <p className="text-muted-foreground">Track your construction projects and manage appointments</p>
        </div>
        <Link href="/customer/projects">
          <Button>
            <Search className="h-4 w-4 mr-2" />
            Browse Projects
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Booked Properties</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.bookedProperties}</div>
            <p className="text-xs text-muted-foreground">Active bookings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingAppointments}</div>
            <p className="text-xs text-muted-foreground">
              Next: <span className="text-accent">Today 2:00 PM</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeProjects}</div>
            <p className="text-xs text-muted-foreground">In construction</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notifications</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.notifications}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-accent">2 unread</span>
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Booked Properties */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Your Properties</CardTitle>
                <CardDescription>Track construction progress of your booked properties</CardDescription>
              </div>
              <Link href="/customer/bookings">
                <Button variant="outline" size="sm">
                  View All
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {bookedProperties.map((property) => (
                  <div key={property.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center">
                        <Building2 className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-foreground">{property.name}</h3>
                          <Badge variant={getStatusColor(property.status)}>{property.status}</Badge>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                          <MapPin className="h-3 w-3" />
                          {property.location} • Unit {property.unit}
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Progress: {property.progress}%</span>
                            <span className="text-muted-foreground">Next: {property.nextMilestone}</span>
                          </div>
                          <Progress value={property.progress} className="h-2" />
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            Expected completion: {property.expectedCompletion}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Link href={`/customer/projects/${property.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Appointments */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Upcoming Appointments</CardTitle>
                <CardDescription>Your scheduled meetings</CardDescription>
              </div>
              <Link href="/customer/appointments">
                <Button variant="ghost" size="sm">
                  <Calendar className="h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center gap-3 p-3 border border-border rounded-lg">
                    <div className="flex-shrink-0">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          appointment.status === "Confirmed" ? "bg-green-500" : "bg-yellow-500"
                        }`}
                      ></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{appointment.project}</p>
                      <p className="text-xs text-muted-foreground truncate">{appointment.type}</p>
                      <p className="text-xs text-accent">
                        {appointment.date} at {appointment.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Notifications */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Recent Updates</CardTitle>
                <CardDescription>Latest notifications</CardDescription>
              </div>
              <Link href="/customer/notifications">
                <Button variant="ghost" size="sm">
                  <Bell className="h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentNotifications.map((notification) => (
                  <div key={notification.id} className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <div
                        className={`w-2 h-2 rounded-full ${notification.read ? "bg-muted-foreground" : "bg-accent"}`}
                      ></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{notification.title}</p>
                      <p className="text-xs text-muted-foreground">{notification.message}</p>
                      <p className="text-xs text-muted-foreground">{notification.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
