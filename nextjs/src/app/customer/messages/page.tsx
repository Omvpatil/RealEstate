"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Send, Paperclip, Phone, Video, MoreVertical } from "lucide-react"

const conversations = [
  {
    id: 1,
    builder: "Premium Builders Ltd",
    contact: "John Smith",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "The site visit is confirmed for tomorrow at 10 AM",
    timestamp: "2024-01-24 3:30 PM",
    unread: 2,
    project: "Sunset Residences",
  },
  {
    id: 2,
    builder: "EcoConstruct Inc",
    contact: "Sarah Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "I've sent you the updated floor plans for review",
    timestamp: "2024-01-24 1:15 PM",
    unread: 0,
    project: "Green Valley Homes",
  },
  {
    id: 3,
    builder: "Coastal Developers",
    contact: "Mike Wilson",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Thank you for your interest in Marina Heights",
    timestamp: "2024-01-23 4:45 PM",
    unread: 1,
    project: "Marina Heights",
  },
]

const messages = [
  {
    id: 1,
    sender: "John Smith",
    content: "Hi! Thank you for your interest in Sunset Residences. I'd be happy to schedule a site visit for you.",
    timestamp: "2024-01-24 2:00 PM",
    isBuilder: true,
  },
  {
    id: 2,
    sender: "You",
    content: "That sounds great! I'm available tomorrow morning. What time works best?",
    timestamp: "2024-01-24 2:15 PM",
    isBuilder: false,
  },
  {
    id: 3,
    sender: "John Smith",
    content: "Perfect! How about 10:00 AM? I'll meet you at the site entrance. Please bring a valid ID.",
    timestamp: "2024-01-24 2:30 PM",
    isBuilder: true,
  },
  {
    id: 4,
    sender: "John Smith",
    content: "The site visit is confirmed for tomorrow at 10 AM. Looking forward to meeting you!",
    timestamp: "2024-01-24 3:30 PM",
    isBuilder: true,
  },
]

export default function CustomerMessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0])
  const [newMessage, setNewMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Handle sending message
      setNewMessage("")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Messages</h1>
          <p className="text-muted-foreground">Communicate with builders and project managers</p>
        </div>
        <Button>New Message</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-4 cursor-pointer hover:bg-muted/50 border-b ${
                    selectedConversation.id === conversation.id ? "bg-muted" : ""
                  }`}
                  onClick={() => setSelectedConversation(conversation)}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={conversation.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {conversation.contact
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm truncate">{conversation.contact}</p>
                        {conversation.unread > 0 && (
                          <Badge variant="destructive" className="h-5 w-5 p-0 text-xs flex items-center justify-center">
                            {conversation.unread}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">{conversation.builder}</p>
                      <p className="text-xs text-muted-foreground mb-1">{conversation.project}</p>
                      <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                      <p className="text-xs text-muted-foreground mt-1">{conversation.timestamp}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-2 flex flex-col">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedConversation.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {selectedConversation.contact
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{selectedConversation.contact}</CardTitle>
                  <CardDescription>
                    {selectedConversation.builder} • {selectedConversation.project}
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Video className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.isBuilder ? "justify-start" : "justify-end"}`}>
                  <div
                    className={`max-w-[70%] ${
                      message.isBuilder ? "bg-muted text-foreground" : "bg-primary text-primary-foreground"
                    } rounded-lg p-3`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.isBuilder ? "text-muted-foreground" : "text-primary-foreground/70"
                      }`}
                    >
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>

          <div className="border-t p-4">
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Textarea
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="min-h-[60px] resize-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Button variant="outline" size="sm">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button onClick={handleSendMessage} size="sm">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
