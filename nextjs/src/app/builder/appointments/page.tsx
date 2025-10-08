"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
    Building2,
    Calendar as CalendarIcon,
    CheckCircle,
    Clock,
    Eye,
    MapPin,
    MoreHorizontal,
    Plus,
    Search,
    User,
    Video,
    XCircle,
} from "lucide-react";
import { useState } from "react";

export default function AppointmentsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [typeFilter, setTypeFilter] = useState("all");
    const [date, setDate] = useState<Date>();

    // Mock data - replace with real API calls
    const appointments = [
        {
            id: 1,
            customer: "John Smith",
            customerId: 101,
            project: "Sunset Residences",
            projectId: 1,
            type: "Site Visit",
            date: "2024-10-10",
            time: "10:00 AM",
            duration: "1 hour",
            status: "Confirmed",
            location: "Project Site, Downtown",
            notes: "First-time visit, interested in 2BHK units",
            contactNumber: "+1-234-567-8901",
        },
        {
            id: 2,
            customer: "Sarah Johnson",
            customerId: 102,
            project: "Green Valley Homes",
            projectId: 2,
            type: "Design Review",
            date: "2024-10-11",
            time: "2:00 PM",
            duration: "45 min",
            status: "Pending",
            location: "Office - Meeting Room A",
            notes: "Review customization options for Unit 204",
            contactNumber: "+1-234-567-8902",
        },
        {
            id: 3,
            customer: "Mike Davis",
            customerId: 103,
            project: "Urban Towers",
            projectId: 3,
            type: "Progress Update",
            date: "2024-10-12",
            time: "11:00 AM",
            duration: "30 min",
            status: "Confirmed",
            location: "Project Site",
            notes: "Show foundation progress",
            contactNumber: "+1-234-567-8903",
        },
        {
            id: 4,
            customer: "Emily Brown",
            customerId: 104,
            project: "Sunset Residences",
            projectId: 1,
            type: "Virtual Tour",
            date: "2024-10-13",
            time: "3:00 PM",
            duration: "45 min",
            status: "Confirmed",
            location: "Online - Zoom",
            notes: "3D model walkthrough",
            contactNumber: "+1-234-567-8904",
        },
        {
            id: 5,
            customer: "Robert Wilson",
            customerId: 105,
            project: "Green Valley Homes",
            projectId: 2,
            type: "Documentation",
            date: "2024-10-14",
            time: "4:00 PM",
            duration: "1 hour",
            status: "Cancelled",
            location: "Office",
            notes: "Contract signing",
            contactNumber: "+1-234-567-8905",
        },
        {
            id: 6,
            customer: "Lisa Anderson",
            customerId: 106,
            project: "Urban Towers",
            projectId: 3,
            type: "Site Visit",
            date: "2024-10-15",
            time: "9:00 AM",
            duration: "1.5 hours",
            status: "Completed",
            location: "Project Site",
            notes: "Interested in penthouse units",
            contactNumber: "+1-234-567-8906",
        },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Confirmed":
                return "default";
            case "Pending":
                return "secondary";
            case "Completed":
                return "outline";
            case "Cancelled":
                return "destructive";
            default:
                return "secondary";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "Confirmed":
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case "Pending":
                return <Clock className="h-4 w-4 text-yellow-500" />;
            case "Completed":
                return <CheckCircle className="h-4 w-4 text-gray-500" />;
            case "Cancelled":
                return <XCircle className="h-4 w-4 text-red-500" />;
            default:
                return null;
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "Site Visit":
                return <MapPin className="h-4 w-4" />;
            case "Virtual Tour":
                return <Video className="h-4 w-4" />;
            case "Design Review":
                return <Eye className="h-4 w-4" />;
            default:
                return <CalendarIcon className="h-4 w-4" />;
        }
    };

    const filteredAppointments = appointments.filter(appointment => {
        const matchesSearch =
            appointment.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            appointment.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
            appointment.type.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || appointment.status.toLowerCase() === statusFilter;
        const matchesType = typeFilter === "all" || appointment.type.toLowerCase().replace(" ", "-") === typeFilter;
        return matchesSearch && matchesStatus && matchesType;
    });

    // Group appointments by status for stats
    const stats = {
        total: appointments.length,
        confirmed: appointments.filter(a => a.status === "Confirmed").length,
        pending: appointments.filter(a => a.status === "Pending").length,
        completed: appointments.filter(a => a.status === "Completed").length,
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Appointments</h1>
                    <p className="text-muted-foreground">Manage customer meetings and site visits</p>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Schedule Appointment
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Schedule New Appointment</DialogTitle>
                            <DialogDescription>Create a new appointment with a customer</DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
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
                            <div className="col-span-2">
                                <Label>Project</Label>
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
                                <Label>Appointment Type</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="site-visit">Site Visit</SelectItem>
                                        <SelectItem value="virtual-tour">Virtual Tour</SelectItem>
                                        <SelectItem value="design-review">Design Review</SelectItem>
                                        <SelectItem value="progress-update">Progress Update</SelectItem>
                                        <SelectItem value="documentation">Documentation</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !date && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div>
                                <Label>Time</Label>
                                <Input type="time" />
                            </div>
                            <div>
                                <Label>Duration</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select duration" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="30">30 minutes</SelectItem>
                                        <SelectItem value="45">45 minutes</SelectItem>
                                        <SelectItem value="60">1 hour</SelectItem>
                                        <SelectItem value="90">1.5 hours</SelectItem>
                                        <SelectItem value="120">2 hours</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="col-span-2">
                                <Label>Location</Label>
                                <Input placeholder="Enter location or meeting link" />
                            </div>
                            <div className="col-span-2">
                                <Label>Notes</Label>
                                <Textarea placeholder="Add any notes or special requirements..." rows={3} />
                            </div>
                            <div className="col-span-2">
                                <Button className="w-full">
                                    <CalendarIcon className="h-4 w-4 mr-2" />
                                    Schedule Appointment
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.confirmed}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.pending}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completed</CardTitle>
                        <CheckCircle className="h-4 w-4 text-gray-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.completed}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search appointments..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                            <SelectTrigger className="w-full sm:w-48">
                                <SelectValue placeholder="Filter by type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="site-visit">Site Visit</SelectItem>
                                <SelectItem value="virtual-tour">Virtual Tour</SelectItem>
                                <SelectItem value="design-review">Design Review</SelectItem>
                                <SelectItem value="progress-update">Progress Update</SelectItem>
                                <SelectItem value="documentation">Documentation</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full sm:w-48">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Appointments Table */}
            <Card>
                <CardHeader>
                    <CardTitle>All Appointments</CardTitle>
                    <CardDescription>
                        {filteredAppointments.length} appointment{filteredAppointments.length !== 1 ? "s" : ""} found
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Customer</TableHead>
                                <TableHead>Project</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Date & Time</TableHead>
                                <TableHead>Duration</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredAppointments.map(appointment => (
                                <TableRow key={appointment.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <p className="font-medium">{appointment.customer}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {appointment.contactNumber}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Building2 className="h-4 w-4 text-muted-foreground" />
                                            {appointment.project}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {getTypeIcon(appointment.type)}
                                            {appointment.type}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium">{appointment.date}</p>
                                            <p className="text-sm text-muted-foreground">{appointment.time}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>{appointment.duration}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 max-w-[150px]">
                                            <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                                            <span className="text-sm truncate">{appointment.location}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(appointment.status)}
                                            <Badge variant={getStatusColor(appointment.status)}>
                                                {appointment.status}
                                            </Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                                <DropdownMenuItem>Reschedule</DropdownMenuItem>
                                                {appointment.status === "Pending" && (
                                                    <DropdownMenuItem>Confirm</DropdownMenuItem>
                                                )}
                                                {appointment.status !== "Completed" && (
                                                    <DropdownMenuItem>Mark as Completed</DropdownMenuItem>
                                                )}
                                                <DropdownMenuItem className="text-destructive">Cancel</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
