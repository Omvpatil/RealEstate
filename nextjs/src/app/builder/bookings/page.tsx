"use client";

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
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    Building2,
    CheckCircle,
    Clock,
    DollarSign,
    Download,
    Eye,
    FileText,
    Home,
    MoreHorizontal,
    Plus,
    Search,
    User,
    XCircle,
} from "lucide-react";
import { useState } from "react";

export default function BookingsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [projectFilter, setProjectFilter] = useState("all");

    // Mock data - replace with real API calls
    const bookings = [
        {
            id: 1,
            bookingNumber: "BK-001",
            customer: "John Smith",
            customerId: 101,
            customerEmail: "john@example.com",
            customerPhone: "+1-234-567-8901",
            project: "Sunset Residences",
            projectId: 1,
            unit: "A-204",
            unitId: 204,
            unitType: "2 BHK",
            totalAmount: 7500000,
            tokenAmount: 500000,
            paidAmount: 2000000,
            pendingAmount: 5500000,
            paymentPlan: "Installments",
            bookingDate: "2024-09-15",
            status: "Active",
            paymentProgress: 26.67,
        },
        {
            id: 2,
            bookingNumber: "BK-002",
            customer: "Sarah Johnson",
            customerId: 102,
            customerEmail: "sarah@example.com",
            customerPhone: "+1-234-567-8902",
            project: "Green Valley Homes",
            projectId: 2,
            unit: "B-105",
            unitId: 105,
            unitType: "3 BHK",
            totalAmount: 9500000,
            tokenAmount: 750000,
            paidAmount: 750000,
            pendingAmount: 8750000,
            paymentPlan: "Construction Linked",
            bookingDate: "2024-09-20",
            status: "Active",
            paymentProgress: 7.89,
        },
        {
            id: 3,
            bookingNumber: "BK-003",
            customer: "Mike Davis",
            customerId: 103,
            customerEmail: "mike@example.com",
            customerPhone: "+1-234-567-8903",
            project: "Urban Towers",
            projectId: 3,
            unit: "C-301",
            unitId: 301,
            unitType: "2 BHK",
            totalAmount: 8200000,
            tokenAmount: 500000,
            paidAmount: 8200000,
            pendingAmount: 0,
            paymentPlan: "One-Time",
            bookingDate: "2024-08-10",
            status: "Completed",
            paymentProgress: 100,
        },
        {
            id: 4,
            bookingNumber: "BK-004",
            customer: "Emily Brown",
            customerId: 104,
            customerEmail: "emily@example.com",
            customerPhone: "+1-234-567-8904",
            project: "Sunset Residences",
            projectId: 1,
            unit: "A-507",
            unitId: 507,
            unitType: "3 BHK",
            totalAmount: 10500000,
            tokenAmount: 800000,
            paidAmount: 3500000,
            pendingAmount: 7000000,
            paymentPlan: "Installments",
            bookingDate: "2024-09-25",
            status: "Active",
            paymentProgress: 33.33,
        },
        {
            id: 5,
            bookingNumber: "BK-005",
            customer: "Robert Wilson",
            customerId: 105,
            customerEmail: "robert@example.com",
            customerPhone: "+1-234-567-8905",
            project: "Green Valley Homes",
            projectId: 2,
            unit: "B-208",
            unitId: 208,
            unitType: "2 BHK",
            totalAmount: 7800000,
            tokenAmount: 500000,
            paidAmount: 500000,
            pendingAmount: 0,
            paymentPlan: "Installments",
            bookingDate: "2024-09-05",
            status: "Cancelled",
            paymentProgress: 6.41,
        },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Active":
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
            case "Active":
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case "Pending":
                return <Clock className="h-4 w-4 text-yellow-500" />;
            case "Completed":
                return <CheckCircle className="h-4 w-4 text-blue-500" />;
            case "Cancelled":
                return <XCircle className="h-4 w-4 text-red-500" />;
            default:
                return null;
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const filteredBookings = bookings.filter(booking => {
        const matchesSearch =
            booking.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.bookingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.unit.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || booking.status.toLowerCase() === statusFilter;
        const matchesProject = projectFilter === "all" || booking.projectId.toString() === projectFilter;
        return matchesSearch && matchesStatus && matchesProject;
    });

    // Calculate stats
    const stats = {
        total: bookings.length,
        active: bookings.filter(b => b.status === "Active").length,
        completed: bookings.filter(b => b.status === "Completed").length,
        totalRevenue: bookings.reduce((sum, b) => sum + b.paidAmount, 0),
        pendingRevenue: bookings.reduce((sum, b) => sum + b.pendingAmount, 0),
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Bookings</h1>
                    <p className="text-muted-foreground">Manage property bookings and payment tracking</p>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            New Booking
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Create New Booking</DialogTitle>
                            <DialogDescription>Register a new property booking</DialogDescription>
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
                            <div>
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
                                <Label>Unit</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select unit" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="204">A-204 (2 BHK)</SelectItem>
                                        <SelectItem value="205">A-205 (3 BHK)</SelectItem>
                                        <SelectItem value="301">B-301 (2 BHK)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Total Amount</Label>
                                <Input type="number" placeholder="Enter total amount" />
                            </div>
                            <div>
                                <Label>Token Amount</Label>
                                <Input type="number" placeholder="Enter token amount" />
                            </div>
                            <div className="col-span-2">
                                <Label>Payment Plan</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select payment plan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="one-time">One-Time Payment</SelectItem>
                                        <SelectItem value="installments">Installments</SelectItem>
                                        <SelectItem value="construction-linked">Construction Linked</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="col-span-2">
                                <Button className="w-full">
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Create Booking
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
                        <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                        <p className="text-xs text-muted-foreground">{stats.active} active bookings</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.active}</div>
                        <p className="text-xs text-muted-foreground">{stats.completed} completed</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
                        <p className="text-xs text-muted-foreground">Amount received</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(stats.pendingRevenue)}</div>
                        <p className="text-xs text-muted-foreground">Yet to be collected</p>
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
                                placeholder="Search bookings..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={projectFilter} onValueChange={setProjectFilter}>
                            <SelectTrigger className="w-full sm:w-48">
                                <SelectValue placeholder="Filter by project" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Projects</SelectItem>
                                <SelectItem value="1">Sunset Residences</SelectItem>
                                <SelectItem value="2">Green Valley Homes</SelectItem>
                                <SelectItem value="3">Urban Towers</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full sm:w-48">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Bookings Table */}
            <Card>
                <CardHeader>
                    <CardTitle>All Bookings</CardTitle>
                    <CardDescription>
                        {filteredBookings.length} booking{filteredBookings.length !== 1 ? "s" : ""} found
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Booking #</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Project & Unit</TableHead>
                                <TableHead>Amount Details</TableHead>
                                <TableHead>Payment Plan</TableHead>
                                <TableHead>Payment Progress</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredBookings.map(booking => (
                                <TableRow key={booking.id}>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium">{booking.bookingNumber}</p>
                                            <p className="text-sm text-muted-foreground">{booking.bookingDate}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <p className="font-medium">{booking.customer}</p>
                                                <p className="text-sm text-muted-foreground">{booking.customerPhone}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-start gap-2">
                                            <Building2 className="h-4 w-4 text-muted-foreground mt-0.5" />
                                            <div>
                                                <p className="font-medium">{booking.project}</p>
                                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                    <Home className="h-3 w-3" />
                                                    <span>
                                                        {booking.unit} ({booking.unitType})
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium">
                                                Total: {formatCurrency(booking.totalAmount)}
                                            </p>
                                            <p className="text-sm text-green-600">
                                                Paid: {formatCurrency(booking.paidAmount)}
                                            </p>
                                            <p className="text-sm text-orange-600">
                                                Pending: {formatCurrency(booking.pendingAmount)}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{booking.paymentPlan}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-2">
                                            <Progress value={booking.paymentProgress} className="w-24" />
                                            <p className="text-sm text-muted-foreground">
                                                {booking.paymentProgress.toFixed(1)}%
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(booking.status)}
                                            <Badge variant={getStatusColor(booking.status)}>{booking.status}</Badge>
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
                                                <DropdownMenuItem>
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <DollarSign className="h-4 w-4 mr-2" />
                                                    Record Payment
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Download className="h-4 w-4 mr-2" />
                                                    Download Agreement
                                                </DropdownMenuItem>
                                                {booking.status === "Active" && (
                                                    <>
                                                        <Separator className="my-1" />
                                                        <DropdownMenuItem className="text-destructive">
                                                            <XCircle className="h-4 w-4 mr-2" />
                                                            Cancel Booking
                                                        </DropdownMenuItem>
                                                    </>
                                                )}
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
