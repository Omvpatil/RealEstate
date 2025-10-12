"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/lib/services";
import { Building2, Loader2, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [builderEmail, setBuilderEmail] = useState("");
    const [builderPassword, setBuilderPassword] = useState("");
    const [customerEmail, setCustomerEmail] = useState("");
    const [customerPassword, setCustomerPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleBuilderLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await authService.login({
                email: builderEmail,
                password: builderPassword,
                user_type: "builder",
            });

            if (response.error) {
                // Handle validation errors (array of error objects)
                let errorMessage = "Login failed";

                if (Array.isArray(response.error.detail)) {
                    // FastAPI validation errors
                    errorMessage = response.error.detail.map((err: any) => err.msg || JSON.stringify(err)).join(", ");
                } else if (typeof response.error.detail === "string") {
                    errorMessage = response.error.detail;
                } else if (response.error.message) {
                    errorMessage = response.error.message;
                }

                toast({
                    title: "Login Failed",
                    description: errorMessage,
                    variant: "destructive",
                });
                return;
            }

            if (response.data?.user.user_type !== "builder") {
                toast({
                    title: "Access Denied",
                    description: "Please use the customer login",
                    variant: "destructive",
                });
                authService.logout();
                return;
            }

            toast({
                title: "Login Successful",
                description: `Welcome back, ${response.data.user.full_name}!`,
            });

            router.push("/builder/dashboard");
        } catch (error) {
            toast({
                title: "Error",
                description: "An unexpected error occurred",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCustomerLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await authService.login({
                email: customerEmail,
                password: customerPassword,
                user_type: "customer",
            });

            if (response.error) {
                // Handle validation errors (array of error objects)
                let errorMessage = "Login failed";

                if (Array.isArray(response.error.detail)) {
                    // FastAPI validation errors
                    errorMessage = response.error.detail.map((err: any) => err.msg || JSON.stringify(err)).join(", ");
                } else if (typeof response.error.detail === "string") {
                    errorMessage = response.error.detail;
                } else if (response.error.message) {
                    errorMessage = response.error.message;
                }

                toast({
                    title: "Login Failed",
                    description: errorMessage,
                    variant: "destructive",
                });
                return;
            }

            if (response.data?.user.user_type !== "customer") {
                toast({
                    title: "Access Denied",
                    description: "Please use the builder login",
                    variant: "destructive",
                });
                authService.logout();
                return;
            }

            toast({
                title: "Login Successful",
                description: `Welcome back, ${response.data.user.full_name}!`,
            });

            router.push("/customer/dashboard");
        } catch (error) {
            toast({
                title: "Error",
                description: "An unexpected error occurred",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 mb-4">
                        <Building2 className="h-8 w-8 text-accent" />
                        <span className="text-2xl font-bold text-foreground">BuildCraft</span>
                    </Link>
                    <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
                    <p className="text-muted-foreground">Sign in to your account</p>
                </div>

                <Tabs defaultValue="builder" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="builder" className="flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            Builder
                        </TabsTrigger>
                        <TabsTrigger value="customer" className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Customer
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="builder">
                        <Card>
                            <CardHeader>
                                <CardTitle>Builder Login</CardTitle>
                                <CardDescription>Access your construction projects and manage bookings</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleBuilderLogin} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="builder-email">Email</Label>
                                        <Input
                                            id="builder-email"
                                            type="email"
                                            placeholder="builder@company.com"
                                            value={builderEmail}
                                            onChange={e => setBuilderEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="builder-password">Password</Label>
                                        <Input
                                            id="builder-password"
                                            type="password"
                                            value={builderPassword}
                                            onChange={e => setBuilderPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <Button type="submit" className="w-full" disabled={isLoading}>
                                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Sign In as Builder
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="customer">
                        <Card>
                            <CardHeader>
                                <CardTitle>Customer Login</CardTitle>
                                <CardDescription>Browse projects and track your construction progress</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleCustomerLogin} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="customer-email">Email</Label>
                                        <Input
                                            id="customer-email"
                                            type="email"
                                            placeholder="customer@email.com"
                                            value={customerEmail}
                                            onChange={e => setCustomerEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="customer-password">Password</Label>
                                        <Input
                                            id="customer-password"
                                            type="password"
                                            value={customerPassword}
                                            onChange={e => setCustomerPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <Button type="submit" className="w-full" disabled={isLoading}>
                                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Sign In as Customer
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                <div className="mt-6 text-center">
                    <p className="text-muted-foreground">
                        Don't have an account?{" "}
                        <Link href="/register" className="text-accent hover:underline">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
