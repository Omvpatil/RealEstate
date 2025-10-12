# 🔐 Authentication Quick Reference

## TL;DR - Copy & Paste This Pattern

```typescript
"use client";

import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { checkUserSession, handleApiError } from "@/lib/auth-utils";
import { useState, useEffect } from "react";

export default function YourPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const user = checkUserSession(router, toast);
            if (!user) return;

            const response = await yourService.getData(user.id);
            setData(response.data || []);
        } catch (error: any) {
            if (handleApiError(error, router, toast)) return;

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
        // Your JSX here
    );
}
```

## 📋 Checklist for New Pages

When adding auth to a page:

-   [ ] Import `useRouter` from "next/navigation"
-   [ ] Import `useToast` from "@/hooks/use-toast"
-   [ ] Import `checkUserSession, handleApiError` from "@/lib/auth-utils"
-   [ ] Add `const router = useRouter()`
-   [ ] Add `const { toast } = useToast()`
-   [ ] Call `checkUserSession(router, toast)` before API calls
-   [ ] Check if user is null, return early if so
-   [ ] Wrap API calls in try-catch
-   [ ] Call `handleApiError(error, router, toast)` in catch block
-   [ ] Return early if handleApiError returns true
-   [ ] Handle other errors with toast

## 🎯 Common Patterns

### Pattern 1: Basic Auth Check

```typescript
const user = checkUserSession(router, toast);
if (!user) return; // Already redirected to login

// Use user.id for API calls
const data = await api.getData(user.id);
```

### Pattern 2: Handle API Errors

```typescript
try {
    const response = await api.call();
} catch (error: any) {
    if (handleApiError(error, router, toast)) return; // 401 handled

    toast({ title: "Error", description: "Something went wrong" });
}
```

### Pattern 3: Builder-Only Page

```typescript
import { checkUserType } from "@/lib/auth-utils";

useEffect(() => {
    if (!checkUserType("builder", router, toast)) return;
    fetchData();
}, []);
```

### Pattern 4: Logout Button

```typescript
import { logout } from "@/lib/auth-utils";

<Button onClick={() => logout(router)}>Logout</Button>;
```

## 🔧 Available Functions

| Function                                | Purpose                  | Returns                          |
| --------------------------------------- | ------------------------ | -------------------------------- |
| `checkUserSession(router, toast?)`      | Validate session exists  | User object or null              |
| `handleApiError(error, router, toast?)` | Handle 401 errors        | true if 401, false otherwise     |
| `logout(router)`                        | Clear session & redirect | void                             |
| `checkUserType(type, router, toast?)`   | Validate user type       | true if correct, false otherwise |

## 🚨 Common Mistakes to Avoid

❌ **Don't do this:**

```typescript
const userStr = localStorage.getItem("user");
const user = JSON.parse(userStr); // Could be null!
```

✅ **Do this instead:**

```typescript
const user = checkUserSession(router, toast);
if (!user) return;
```

---

❌ **Don't do this:**

```typescript
catch (error) {
    if (error.response?.status === 401) {
        // manually handle...
    }
}
```

✅ **Do this instead:**

```typescript
catch (error: any) {
    if (handleApiError(error, router, toast)) return;
}
```

---

❌ **Don't do this:**

```typescript
localStorage.removeItem("user");
router.push("/login");
```

✅ **Do this instead:**

```typescript
logout(router);
```

## 📊 Status by Page

### Customer Pages

| Page          | Status             | Notes           |
| ------------- | ------------------ | --------------- |
| Dashboard     | ⚠️ Needs utility   | Has basic auth  |
| Projects      | ⚠️ Needs utility   | Has basic auth  |
| Bookings      | ⚠️ Needs utility   | Has basic auth  |
| Appointments  | ⚠️ Needs utility   | Has basic auth  |
| Progress      | ✅ Complete        | Using utilities |
| Messages      | ❌ Not implemented | API exists      |
| Notifications | ❌ Not implemented | API exists      |
| Changes       | ❌ Not implemented | Need API        |
| Models        | ❌ Not implemented | Need API        |

### Builder Pages

| Page         | Status             | Notes          |
| ------------ | ------------------ | -------------- |
| Dashboard    | ⚠️ Needs utility   | Has basic auth |
| Projects     | ❌ Not implemented | -              |
| Progress     | ❌ Not implemented | -              |
| Models       | ❌ Not implemented | -              |
| Changes      | ❌ Not implemented | -              |
| Appointments | ❌ Not implemented | -              |

## 🎓 Understanding the Flow

```
User visits page
       ↓
checkUserSession()
       ↓
   Session exists?
       ↙        ↘
     YES        NO
      ↓          ↓
  Continue   Redirect to /login
      ↓
  API Call
      ↓
  Response?
   ↙      ↘
 200      401
  ↓        ↓
Show    handleApiError()
Data         ↓
        Clear session
             ↓
        Redirect to /login
```

## 💡 Pro Tips

1. **Always use `toast` parameter** - Provides better UX with notifications

2. **Check return value** - Both `checkUserSession` and `checkUserType` return values you should check

3. **Use early returns** - If auth fails, return early to avoid unnecessary code execution

4. **Handle loading states** - Set loading to false in finally block

5. **Type your errors** - Use `error: any` to access `error.response`

## 🔗 Related Files

-   Implementation: `/nextjs/src/lib/auth-utils.ts`
-   Full Docs: `/AUTH_IMPLEMENTATION.md`
-   Summary: `/SESSION_MANAGEMENT_SUMMARY.md`
-   This File: `/AUTH_QUICK_REFERENCE.md`

---

**Last Updated**: Session Management Implementation
**Version**: 1.0
