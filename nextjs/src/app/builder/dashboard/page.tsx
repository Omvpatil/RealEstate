import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Building2, Calendar, Users, FileText, TrendingUp, Plus, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function BuilderDashboard() {
  // Mock data - replace with real API calls
  const stats = {
    totalProjects: 12,
    activeProjects: 8,
    pendingBookings: 15,
    upcomingAppointments: 6,
  }

  const recentProjects = [
    {
      id: 1,
      name: "Sunset Residences",
      location: "Downtown",
      status: "In Progress",
      progress: 75,
      bookings: 8,
      nextMilestone: "Foundation Complete",
    },
    {
      id: 2,
      name: "Green Valley Homes",
      location: "Suburbs",
      status: "Planning",
      progress: 25,
      bookings: 12,
      nextMilestone: "Permits Approved",
    },
    {
      id: 3,
      name: "Urban Towers",
      location: "City Center",
      status: "In Progress",
      progress: 60,
      bookings: 5,
      nextMilestone: "Structural Work",
    },
  ]

  const upcomingAppointments = [
    {
      id: 1,
      customer: "John Smith",
      project: "Sunset Residences",
      time: "10:00 AM",
      date: "Today",
      type: "Site Visit",
    },
    {
      id: 2,
      customer: "Sarah Johnson",
      project: "Green Valley Homes",
      time: "2:00 PM",
      date: "Tomorrow",
      type: "Design Review",
    },
    {
      id: 3,
      customer: "Mike Davis",
      project: "Urban Towers",
      time: "11:00 AM",
      date: "Dec 20",
      type: "Progress Update",
    },
  ]

  const recentActivity = [
    {
      id: 1,
      action: "New booking received",
      project: "Sunset Residences",
      time: "2 hours ago",
      type: "booking",
    },
    {
      id: 2,
      action: "Progress updated",
      project: "Urban Towers",
      time: "4 hours ago",
      type: "progress",
    },
    {
      id: 3,
      action: "Change request approved",
      project: "Green Valley Homes",
      time: "1 day ago",
      type: "change",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your projects.</p>
        </div>
        <Link href="/builder/projects/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProjects}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+2</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeProjects}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+1</span> from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Bookings</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingBookings}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-accent">3 new</span> today
            </p>
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
              Next: <span className="text-accent">Today 10:00 AM</span>
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Projects */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Projects</CardTitle>
                <CardDescription>Your latest construction projects</CardDescription>
              </div>
              <Link href="/builder/projects">
                <Button variant="outline" size="sm">
                  View All
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentProjects.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-foreground">{project.name}</h3>
                        <Badge variant={project.status === "In Progress" ? "default" : "secondary"}>
                          {project.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{project.location}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-muted-foreground">Progress: {project.progress}%</span>
                        <span className="text-muted-foreground">Bookings: {project.bookings}</span>
                      </div>
                      <Progress value={project.progress} className="mt-2 h-2" />
                    </div>
                    <div className="ml-4">
                      <Link href={`/builder/projects/${project.id}`}>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </Link>
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
              <Link href="/builder/appointments">
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
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{appointment.customer}</p>
                      <p className="text-xs text-muted-foreground truncate">{appointment.project}</p>
                      <p className="text-xs text-accent">
                        {appointment.date} at {appointment.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
              <CardDescription>Latest updates and notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {activity.type === "booking" && <Users className="h-4 w-4 text-blue-500" />}
                      {activity.type === "progress" && <TrendingUp className="h-4 w-4 text-green-500" />}
                      {activity.type === "change" && <FileText className="h-4 w-4 text-orange-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.project}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
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
