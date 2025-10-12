"use client";

import { authService } from "@/lib/services";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LogoutPage() {
    const router = useRouter();

    useEffect(() => {
        // Perform logout
        authService.logout();

        // Redirect to login page after a brief moment
        const timer = setTimeout(() => {
            router.push("/login");
        }, 500);

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <div className="text-center">
                <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
                <p className="mt-4 text-lg text-muted-foreground">Logging out...</p>
            </div>
        </div>
    );
}
