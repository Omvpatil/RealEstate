"use client";

import type React from "react";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, User } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const defaultTab =
    searchParams.get("type") === "customer" ? "customer" : "builder";

  const [builderData, setBuilderData] = useState({
    companyName: "",
    email: "",
    password: "",
    confirmPassword: "",
    licenseNumber: "",
    phone: "",
    address: "",
  });

  const [customerData, setCustomerData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  const handleBuilderRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement builder registration
    console.log("Builder registration:", builderData);
  };

  const handleCustomerRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement customer registration
    console.log("Customer registration:", customerData);
  };
  //
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <Building2 className="h-8 w-8 text-accent" />
            <span className="text-2xl font-bold text-foreground">
              BuildCraft
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">
            Create your account
          </h1>
          <p className="text-muted-foreground">
            Join the future of construction
          </p>
        </div>

        <Tabs defaultValue={defaultTab} className="w-full">
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
                <CardTitle>Builder Registration</CardTitle>
                <CardDescription>
                  Create your builder account to manage construction projects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBuilderRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Company Name</Label>
                    <Input
                      id="company-name"
                      placeholder="Your Construction Company"
                      value={builderData.companyName}
                      onChange={(e) =>
                        setBuilderData({
                          ...builderData,
                          companyName: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="license-number">License Number</Label>
                    <Input
                      id="license-number"
                      placeholder="Construction License #"
                      value={builderData.licenseNumber}
                      onChange={(e) =>
                        setBuilderData({
                          ...builderData,
                          licenseNumber: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="builder-email">Email</Label>
                    <Input
                      id="builder-email"
                      type="email"
                      placeholder="builder@company.com"
                      value={builderData.email}
                      onChange={(e) =>
                        setBuilderData({
                          ...builderData,
                          email: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="builder-phone">Phone</Label>
                    <Input
                      id="builder-phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={builderData.phone}
                      onChange={(e) =>
                        setBuilderData({
                          ...builderData,
                          phone: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="builder-password">Password</Label>
                    <Input
                      id="builder-password"
                      type="password"
                      value={builderData.password}
                      onChange={(e) =>
                        setBuilderData({
                          ...builderData,
                          password: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="builder-confirm-password">
                      Confirm Password
                    </Label>
                    <Input
                      id="builder-confirm-password"
                      type="password"
                      value={builderData.confirmPassword}
                      onChange={(e) =>
                        setBuilderData({
                          ...builderData,
                          confirmPassword: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Create Builder Account
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customer">
            <Card>
              <CardHeader>
                <CardTitle>Customer Registration</CardTitle>
                <CardDescription>
                  Create your account to browse and book construction projects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCustomerRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First Name</Label>
                      <Input
                        id="first-name"
                        placeholder="John"
                        value={customerData.firstName}
                        onChange={(e) =>
                          setCustomerData({
                            ...customerData,
                            firstName: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input
                        id="last-name"
                        placeholder="Doe"
                        value={customerData.lastName}
                        onChange={(e) =>
                          setCustomerData({
                            ...customerData,
                            lastName: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer-email">Email</Label>
                    <Input
                      id="customer-email"
                      type="email"
                      placeholder="customer@email.com"
                      value={customerData.email}
                      onChange={(e) =>
                        setCustomerData({
                          ...customerData,
                          email: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer-phone">Phone</Label>
                    <Input
                      id="customer-phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={customerData.phone}
                      onChange={(e) =>
                        setCustomerData({
                          ...customerData,
                          phone: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer-password">Password</Label>
                    <Input
                      id="customer-password"
                      type="password"
                      value={customerData.password}
                      onChange={(e) =>
                        setCustomerData({
                          ...customerData,
                          password: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer-confirm-password">
                      Confirm Password
                    </Label>
                    <Input
                      id="customer-confirm-password"
                      type="password"
                      value={customerData.confirmPassword}
                      onChange={(e) =>
                        setCustomerData({
                          ...customerData,
                          confirmPassword: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Create Customer Account
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 text-center">
          <p className="text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-accent hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
