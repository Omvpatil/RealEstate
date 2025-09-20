"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Calendar, MessageSquare, Home, CreditCard, Settings, Clock } from "lucide-react"

const notifications = [
  {
    id: 1,
    type: "appointment",
    title: "Site Visit Reminder",
    message: "Your site visit for Sunset Residences is scheduled for tomorrow at 10:00 AM",
    timestamp: "2024-01-24 9:00 AM",
    read: false,
    priority: "high",
    project: "Sunset Residences",
  },
  {
    id: 2,
    type: "payment",
    title: "Payment Due Soon",
    message: "Your next payment of $25,000 is due in 3 days for Green Valley Homes",
    timestamp: "2024-01-24 8:30 AM",
    read: false,
    priority: "high",
    project: "Green Valley Homes",
  },
  {
    id: 3,
    type: "progress",
    title: "Construction Update",
    message: "Foundation work completed for your unit in Sunset Residences",
    timestamp: "2024-01-23 2:15 PM",
    read: true,
    priority: "medium",
    project: "Sunset Residences",
  },
  {
    id: 4,
    type: "message",
    title: "New Message",
    message: "John Smith sent you a message about your upcoming site visit",
    timestamp: "2024-01-23 11:45 AM",
    read: true,
    priority: "medium",
    project: "Sunset Residences",
  },
  {
    id: 5,
    type: "general",
    title: "Document Ready",
    message: "Your booking agreement is ready for download",
    timestamp: "2024-01-22 4:30 PM",
    read: true,
    priority: "low",
    project: "Marina Heights",
  },
]

const notificationSettings = [
  {
    category: "Appointments",
    description: "Site visits, meetings, and consultations",
    email: true,
    push: true,
    sms: false,
  },
  {
    category: "Payments",
    description: "Payment reminders and confirmations",
    email: true,
    push: true,
    sms: true,
  },
  {
    category: "Construction Progress",
    description: "Updates on your property construction",
    email: true,
    push: false,
    sms: false,
  },
  {
    category: "Messages",
    description: "New messages from builders",
    email: false,
    push: true,
    sms: false,
  },
  {
    category: "General Updates",
    description: "Project announcements and news",
    email: true,
    push: false,
    sms: false,
  },
]

export default function CustomerNotificationsPage() {
  const [activeTab, setActiveTab] = useState("all")

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "appointment":
        return <Calendar className="h-5 w-5 text-blue-500" />
      case "payment":
        return <CreditCard className="h-5 w-5 text-red-500" />
      case "progress":
        return <Home className="h-5 w-5 text-green-500" />
      case "message":
        return <MessageSquare className="h-5 w-5 text-purple-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
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

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
          <p className="text-muted-foreground">Stay updated with your property journey</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Mark All Read</Button>
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
          <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {notifications.map((notification) => (
            <Card key={notification.id} className={`${!notification.read ? "border-primary/50 bg-primary/5" : ""}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground">{notification.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(notification.priority)}>{notification.priority}</Badge>
                        {!notification.read && <div className="h-2 w-2 bg-primary rounded-full"></div>}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {notification.timestamp}
                        </span>
                        <span>{notification.project}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                        {!notification.read && (
                          <Button variant="ghost" size="sm">
                            Mark Read
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="unread" className="space-y-4">
          {notifications
            .filter((n) => !n.read)
            .map((notification) => (
              <Card key={notification.id} className="border-primary/50 bg-primary/5">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-foreground">{notification.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getPriorityColor(notification.priority)}>{notification.priority}</Badge>
                          <div className="h-2 w-2 bg-primary rounded-full"></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {notification.timestamp}
                          </span>
                          <span>{notification.project}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                          <Button variant="ghost" size="sm">
                            Mark Read
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose how you want to receive notifications for different types of updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {notificationSettings.map((setting, index) => (
                <div key={index} className="space-y-3">
                  <div>
                    <h4 className="font-medium text-foreground">{setting.category}</h4>
                    <p className="text-sm text-muted-foreground">{setting.description}</p>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2">
                      <Switch checked={setting.email} />
                      <span className="text-sm">Email</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch checked={setting.push} />
                      <span className="text-sm">Push</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch checked={setting.sms} />
                      <span className="text-sm">SMS</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
