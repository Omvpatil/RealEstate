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
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { checkUserSession, handleApiError } from "@/lib/auth-utils";
import { bookingsService } from "@/lib/services/bookings.service";
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
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function BookingsPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [projectFilter, setProjectFilter] = useState("all");
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        completed: 0,
        cancelled: 0,
        totalRevenue: 0,
        pendingRevenue: 0,
    });
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const user = checkUserSession(router);
        if (!user) return;
        if (user.user_type !== "builder") {
            router.push("/login");
            return;
        }

        fetchBookings();
    }, [page, statusFilter, projectFilter]);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const params: any = {
                page,
                limit: 10,
            };

            if (statusFilter && statusFilter !== "all") {
                params.status = statusFilter;
            }
            if (projectFilter && projectFilter !== "all") {
                params.project_id = Number(projectFilter);
            }

            const response = await bookingsService.getBuilderBookings(params);

            if (response.error) {
                handleApiError(response.error, router, toast);
                return;
            }

            if (response.data) {
                setBookings(response.data.bookings || []);
                setTotal(response.data.total || 0);
                if (response.data.stats) {
                    setStats({
                        total: response.data.stats.total_bookings || 0,
                        active: response.data.stats.active_bookings || 0,
                        completed: response.data.stats.completed_bookings || 0,
                        cancelled: 0,
                        totalRevenue: response.data.stats.total_revenue || 0,
                        pendingRevenue: response.data.stats.pending_revenue || 0,
                    });
                }
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load bookings",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

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

    if (loading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-32 w-full" />
                <div className="grid gap-6 md:grid-cols-4">
                    <Skeleton className="h-24" />
                    <Skeleton className="h-24" />
                    <Skeleton className="h-24" />
                    <Skeleton className="h-24" />
                </div>
                <Skeleton className="h-96 w-full" />
            </div>
        );
    }

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
                        {bookings.length} booking{bookings.length !== 1 ? "s" : ""} found
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
                            {bookings.map(booking => (
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
