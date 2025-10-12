# Authentication Implementation Guide

## Overview

This document describes the authentication and session management implementation across the RealEstate application.

## Authentication Utilities

Location: `/nextjs/src/lib/auth-utils.ts`

### Available Functions

#### 1. `checkUserSession(router, showToast?)`

Validates user session exists and is valid. Automatically redirects to login if invalid.

**Parameters:**

-   `router`: Next.js router instance from `useRouter()`
-   `showToast`: Optional toast function for displaying messages

**Returns:**

-   `User` object if session is valid
-   `null` if session is invalid (and redirects to login)

**Usage:**

```typescript
import { useRouter } from "next/navigation";
import { checkUserSession } from "@/lib/auth-utils";
import { useToast } from "@/hooks/use-toast";

const router = useRouter();
const { toast } = useToast();

// In your fetch function
const user = checkUserSession(router, toast);
if (!user) return; // Will have already redirected to login

// Continue with authenticated requests
const response = await someService.getData(user.id);
```

#### 2. `handleApiError(error, router, showToast?)`

Handles API errors, especially authentication errors. Automatically handles 401 Unauthorized by clearing session and redirecting.

**Parameters:**

-   `error`: The caught error object
-   `router`: Next.js router instance
-   `showToast`: Optional toast function

**Returns:**

-   `true` if error was a 401 authentication error (handled automatically)
-   `false` if error was something else (caller should handle)

**Usage:**

```typescript
try {
    const response = await api.fetchData();
} catch (error: any) {
    // Check if it's an auth error (401)
    if (handleApiError(error, router, toast)) {
        return; // Auth error handled, redirected to login
    }

    // Handle other errors
    toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
    });
}
```

#### 3. `logout(router)`

Clears user session and redirects to login page.

**Usage:**

```typescript
import { logout } from "@/lib/auth-utils";

// In a logout button handler
const handleLogout = () => {
    logout(router);
};
```

#### 4. `checkUserType(requiredType, router, showToast?)`

Validates user has the correct user type and redirects if not.

**Parameters:**

-   `requiredType`: "builder" | "customer"
-   `router`: Next.js router instance
-   `showToast`: Optional toast function

**Returns:**

-   `true` if user has correct type
-   `false` if user has wrong type (and redirects to appropriate dashboard)

**Usage:**

```typescript
// In a builder-only page
useEffect(() => {
    if (!checkUserType("builder", router, toast)) {
        return; // Will redirect to customer dashboard if user is a customer
    }
    // Continue with builder-specific logic
}, []);
```

## Standard Implementation Pattern

### For Customer Pages

```typescript
"use client";

import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { checkUserSession, handleApiError } from "@/lib/auth-utils";
import { useState, useEffect } from "react";

export default function CustomerPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [data, setData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            // Validate session
            const user = checkUserSession(router, toast);
            if (!user) return;

            // Fetch data
            const response = await someService.getData(user.id);
            setData(response.data || []);
        } catch (error: any) {
            console.error("Error fetching data:", error);

            // Handle auth errors
            if (handleApiError(error, router, toast)) {
                return;
            }

            // Handle other errors
            toast({
                title: "Error",
                description: "Failed to load data",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        // Your component JSX
    );
}
```

### For Builder Pages

Same pattern as customer pages, but optionally add user type check:

```typescript
useEffect(() => {
    // Optional: Enforce builder-only access
    if (!checkUserType("builder", router, toast)) {
        return;
    }
    fetchData();
}, []);
```

## Session Storage Structure

### User Object

Stored in `localStorage` under key `"user"`:

```typescript
{
    id: number;
    email: string;
    full_name: string;
    user_type: "builder" | "customer";
}
```

### Token

Stored in `localStorage` under key `"token"`:

```
"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## Error Handling Flow

### 401 Unauthorized (Session Expired)

1. Error caught in try-catch block
2. `handleApiError()` detects 401 status code
3. Shows "Session Expired" toast notification
4. Clears `localStorage` (user + token)
5. Redirects to `/login`
6. Returns `true` to indicate error was handled

### Other Errors

1. Error caught in try-catch block
2. `handleApiError()` returns `false`
3. Caller handles error with appropriate toast/UI

## Pages with Authentication Implemented

### Customer Pages

-   ✅ `/customer/dashboard` - Basic auth (needs utility integration)
-   ✅ `/customer/projects` - Basic auth (needs utility integration)
-   ✅ `/customer/bookings` - Basic auth (needs utility integration)
-   ✅ `/customer/appointments` - Basic auth (needs utility integration)
-   ✅ `/customer/progress` - **Full auth with utilities**
-   ❌ `/customer/models` - Not implemented
-   ❌ `/customer/changes` - Not implemented
-   ❌ `/customer/messages` - Not implemented
-   ❌ `/customer/notifications` - Not implemented

### Builder Pages

-   ✅ `/builder/dashboard` - Basic auth (needs utility integration)
-   ❌ `/builder/projects` - Not implemented
-   ❌ `/builder/progress` - Not implemented
-   ❌ `/builder/models` - Not implemented
-   ❌ `/builder/changes` - Not implemented
-   ❌ `/builder/appointments` - Not implemented

## Next Steps

### Phase 1: Update Existing Pages (Priority)

Apply auth utilities to pages with basic auth:

1. `/customer/dashboard`
2. `/customer/projects`
3. `/customer/bookings`
4. `/customer/appointments`
5. `/builder/dashboard`

### Phase 2: Implement Remaining Customer Pages

1. Messages (API exists)
2. Notifications (API exists)
3. Change Requests (may need API)
4. 3D Models (may need API)

### Phase 3: Implement Builder Pages

1. Projects
2. Progress
3. Models
4. Changes
5. Appointments

## Security Considerations

1. **Token Storage**: Currently using localStorage. Consider:

    - httpOnly cookies for production
    - Secure token refresh mechanism
    - Token expiration handling

2. **Client-Side Validation**: Current implementation validates on client only. Backend must also validate:

    - JWT token validity
    - User permissions
    - Resource ownership

3. **XSS Protection**:

    - Sanitize user input
    - Use Content Security Policy headers
    - Validate data before rendering

4. **CSRF Protection**:
    - Implement CSRF tokens for state-changing operations
    - Use SameSite cookie attributes

## Testing Checklist

For each page with authentication:

-   [ ] Page loads without session → redirects to login
-   [ ] Page loads with invalid session → redirects to login
-   [ ] Page loads with valid session → shows data
-   [ ] API returns 401 → clears session and redirects to login
-   [ ] Wrong user type → redirects to appropriate dashboard
-   [ ] Logout button → clears session and redirects to login
-   [ ] Session expired during usage → handles gracefully

## API Integration Checklist

When integrating a new page:

1. [ ] Import auth utilities
2. [ ] Add useRouter and useToast hooks
3. [ ] Validate session in fetch function with `checkUserSession()`
4. [ ] Handle 401 errors with `handleApiError()`
5. [ ] Add loading states
6. [ ] Add empty states
7. [ ] Add error handling
8. [ ] Test all error scenarios
9. [ ] Update this documentation
