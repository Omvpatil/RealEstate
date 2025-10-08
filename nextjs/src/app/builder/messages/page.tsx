"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Archive, MessageSquare, MoreVertical, Paperclip, Plus, Search, Send, Trash2 } from "lucide-react";
import { useState } from "react";

export default function MessagesPage() {
    const [selectedConversation, setSelectedConversation] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [messageText, setMessageText] = useState("");

    // Mock data - replace with real API calls
    const conversations = [
        {
            id: 1,
            customer: "John Smith",
            customerId: 101,
            project: "Sunset Residences",
            projectId: 1,
            avatar: "/placeholder-user.jpg",
            lastMessage: "When can I schedule the site visit?",
            timestamp: "10 min ago",
            unread: 2,
            status: "active",
        },
        {
            id: 2,
            customer: "Sarah Johnson",
            customerId: 102,
            project: "Green Valley Homes",
            projectId: 2,
            avatar: "/placeholder-user.jpg",
            lastMessage: "Thanks for the update on the construction progress!",
            timestamp: "1 hour ago",
            unread: 0,
            status: "active",
        },
        {
            id: 3,
            customer: "Mike Davis",
            customerId: 103,
            project: "Urban Towers",
            projectId: 3,
            avatar: "/placeholder-user.jpg",
            lastMessage: "I have some questions about the payment schedule",
            timestamp: "3 hours ago",
            unread: 1,
            status: "active",
        },
        {
            id: 4,
            customer: "Emily Brown",
            customerId: 104,
            project: "Sunset Residences",
            projectId: 1,
            avatar: "/placeholder-user.jpg",
            lastMessage: "The 3D model looks great!",
            timestamp: "1 day ago",
            unread: 0,
            status: "active",
        },
        {
            id: 5,
            customer: "Robert Wilson",
            customerId: 105,
            project: "Green Valley Homes",
            projectId: 2,
            avatar: "/placeholder-user.jpg",
            lastMessage: "Can we discuss the interior customization options?",
            timestamp: "2 days ago",
            unread: 0,
            status: "archived",
        },
    ];

    const messages = {
        1: [
            {
                id: 1,
                sender: "customer",
                text: "Hi, I'm interested in booking a unit at Sunset Residences",
                timestamp: "2:30 PM",
                date: "Today",
            },
            {
                id: 2,
                sender: "builder",
                text: "Hello John! Great to hear from you. We have several units available. Would you like to schedule a site visit?",
                timestamp: "2:35 PM",
                date: "Today",
            },
            {
                id: 3,
                sender: "customer",
                text: "Yes, that would be great! When are you available?",
                timestamp: "2:40 PM",
                date: "Today",
            },
            {
                id: 4,
                sender: "builder",
                text: "I can arrange a visit for this weekend. Saturday or Sunday would work?",
                timestamp: "2:42 PM",
                date: "Today",
            },
            {
                id: 5,
                sender: "customer",
                text: "When can I schedule the site visit?",
                timestamp: "Just now",
                date: "Today",
            },
        ],
        2: [
            {
                id: 1,
                sender: "customer",
                text: "Hi, I wanted to check on the construction progress",
                timestamp: "11:00 AM",
                date: "Today",
            },
            {
                id: 2,
                sender: "builder",
                text: "Hello Sarah! The foundation work is complete and we're starting on the structural framework next week.",
                timestamp: "11:15 AM",
                date: "Today",
            },
            {
                id: 3,
                sender: "customer",
                text: "Thanks for the update on the construction progress!",
                timestamp: "11:20 AM",
                date: "Today",
            },
        ],
    };

    const activeConversation = conversations.find(c => c.id === selectedConversation);
    const conversationMessages = messages[selectedConversation as keyof typeof messages] || [];

    const filteredConversations = conversations.filter(
        conv =>
            conv.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            conv.project.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map(n => n[0])
            .join("")
            .toUpperCase();
    };

    const handleSendMessage = () => {
        if (messageText.trim()) {
            // TODO: Send message via API
            console.log("Sending message:", messageText);
            setMessageText("");
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Messages</h1>
                    <p className="text-muted-foreground">Communicate with your customers and team</p>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            New Message
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>New Message</DialogTitle>
                            <DialogDescription>Start a new conversation with a customer</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label>Customer</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select customer" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="101">John Smith</SelectItem>
                                        <SelectItem value="102">Sarah Johnson</SelectItem>
                                        <SelectItem value="103">Mike Davis</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Project (Optional)</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select project" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Sunset Residences</SelectItem>
                                        <SelectItem value="2">Green Valley Homes</SelectItem>
                                        <SelectItem value="3">Urban Towers</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Message</Label>
                                <Textarea placeholder="Type your message..." rows={4} />
                            </div>
                            <Button className="w-full">
                                <Send className="h-4 w-4 mr-2" />
                                Send Message
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Messages Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Conversations List */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="text-lg">Conversations</CardTitle>
                        <CardDescription>
                            <div className="relative mt-2">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search conversations..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <ScrollArea className="h-[500px]">
                            {filteredConversations.map((conversation, index) => (
                                <div key={conversation.id}>
                                    <div
                                        onClick={() => setSelectedConversation(conversation.id)}
                                        className={`flex items-start gap-3 p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                                            selectedConversation === conversation.id ? "bg-muted" : ""
                                        }`}
                                    >
                                        <Avatar>
                                            <AvatarImage src={conversation.avatar} alt={conversation.customer} />
                                            <AvatarFallback>{getInitials(conversation.customer)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2">
                                                <p className="font-semibold text-sm truncate">
                                                    {conversation.customer}
                                                </p>
                                                {conversation.unread > 0 && (
                                                    <Badge
                                                        variant="default"
                                                        className="h-5 w-5 p-0 flex items-center justify-center"
                                                    >
                                                        {conversation.unread}
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-xs text-muted-foreground mb-1">{conversation.project}</p>
                                            <p className="text-sm text-muted-foreground truncate">
                                                {conversation.lastMessage}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {conversation.timestamp}
                                            </p>
                                        </div>
                                    </div>
                                    {index < filteredConversations.length - 1 && <Separator />}
                                </div>
                            ))}
                        </ScrollArea>
                    </CardContent>
                </Card>

                {/* Message Thread */}
                <Card className="lg:col-span-2">
                    {activeConversation ? (
                        <>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage
                                                src={activeConversation.avatar}
                                                alt={activeConversation.customer}
                                            />
                                            <AvatarFallback>{getInitials(activeConversation.customer)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <CardTitle className="text-lg">{activeConversation.customer}</CardTitle>
                                            <CardDescription>{activeConversation.project}</CardDescription>
                                        </div>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>
                                                <Archive className="h-4 w-4 mr-2" />
                                                Archive
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="text-destructive">
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </CardHeader>
                            <Separator />
                            <CardContent className="p-0">
                                <ScrollArea className="h-[400px] p-4">
                                    <div className="space-y-4">
                                        {conversationMessages.map(message => (
                                            <div
                                                key={message.id}
                                                className={`flex ${
                                                    message.sender === "builder" ? "justify-end" : "justify-start"
                                                }`}
                                            >
                                                <div
                                                    className={`max-w-[70%] rounded-lg p-3 ${
                                                        message.sender === "builder"
                                                            ? "bg-primary text-primary-foreground"
                                                            : "bg-muted text-foreground"
                                                    }`}
                                                >
                                                    <p className="text-sm">{message.text}</p>
                                                    <p
                                                        className={`text-xs mt-1 ${
                                                            message.sender === "builder"
                                                                ? "text-primary-foreground/70"
                                                                : "text-muted-foreground"
                                                        }`}
                                                    >
                                                        {message.timestamp}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                                <Separator />
                                <div className="p-4">
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="icon">
                                            <Paperclip className="h-4 w-4" />
                                        </Button>
                                        <Input
                                            placeholder="Type a message..."
                                            value={messageText}
                                            onChange={e => setMessageText(e.target.value)}
                                            onKeyPress={e => {
                                                if (e.key === "Enter" && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleSendMessage();
                                                }
                                            }}
                                        />
                                        <Button onClick={handleSendMessage}>
                                            <Send className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-[500px]">
                            <div className="text-center text-muted-foreground">
                                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>Select a conversation to view messages</p>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}
