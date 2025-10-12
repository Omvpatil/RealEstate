# Auth Utils Bug Fix - Session Key Mismatch

## Issue

The progress tracking page was redirecting customers to login even when they were recently logged in.

## Root Cause

Two critical issues were identified:

### 1. Incorrect localStorage Key

**Problem**: The `checkUserSession()` function was looking for `"user"` in localStorage, but the actual key used by the application is `"buildcraft_user"` (defined in TOKEN_KEYS).

**Impact**: The function always returned null because it couldn't find the user data, causing immediate redirect to login.

### 2. Server-Side Rendering Issue

**Problem**: The auth utility functions were trying to access `localStorage` without checking if they were running in the browser environment.

**Impact**: During Next.js server-side rendering, `localStorage` is undefined, causing errors and incorrect behavior.

## Solution

### Fixed localStorage Keys

Updated all auth utility functions to use the correct token keys from `api-config.ts`:

```typescript
import { TOKEN_KEYS } from "./api-config";

// Correct keys:
// TOKEN_KEYS.USER = "buildcraft_user"
// TOKEN_KEYS.ACCESS_TOKEN = "buildcraft_access_token"
// TOKEN_KEYS.REFRESH_TOKEN = "buildcraft_refresh_token"
```

### Added Browser Environment Checks

Added `typeof window === "undefined"` checks to all functions that access localStorage:

**checkUserSession()**:

```typescript
export const checkUserSession = (router: any, showToast?: ...) => {
    // Check if we're in the browser
    if (typeof window === "undefined") {
        return null;
    }

    const userStr = localStorage.getItem(TOKEN_KEYS.USER);
    // ... rest of logic
}
```

**handleApiError()**:

```typescript
// Clear session data
if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEYS.USER);
    localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);
}
```

**logout()**:

```typescript
export const logout = (router: any) => {
    if (typeof window === "undefined") return;

    localStorage.removeItem(TOKEN_KEYS.USER);
    localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);
    router.push("/login");
};
```

## Changes Made

### File: `/nextjs/src/lib/auth-utils.ts`

1. **Added import**:

    ```typescript
    import { TOKEN_KEYS } from "./api-config";
    ```

2. **Updated checkUserSession()**:

    - Added browser check: `if (typeof window === "undefined") return null;`
    - Changed: `localStorage.getItem("user")` → `localStorage.getItem(TOKEN_KEYS.USER)`

3. **Updated handleApiError()**:

    - Wrapped localStorage calls in browser check
    - Changed: `localStorage.removeItem("user")` → `localStorage.removeItem(TOKEN_KEYS.USER)`
    - Changed: `localStorage.removeItem("token")` → Removed both ACCESS_TOKEN and REFRESH_TOKEN
    - Added: `localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN)`
    - Added: `localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN)`

4. **Updated logout()**:
    - Added browser check: `if (typeof window === "undefined") return;`
    - Changed: `localStorage.removeItem("user")` → `localStorage.removeItem(TOKEN_KEYS.USER)`
    - Changed: `localStorage.removeItem("token")` → Removed both tokens correctly
    - Added: `localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN)`
    - Added: `localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN)`

## Testing

After the fix, the following behavior is expected:

1. ✅ User logs in → session stored with correct keys
2. ✅ User navigates to progress page → session found and validated
3. ✅ User stays on progress page → no unwanted redirects
4. ✅ Session expires (401 from API) → proper cleanup and redirect
5. ✅ User logs out → all tokens removed correctly
6. ✅ SSR phase → no localStorage access errors

## Verification Commands

To verify the fix is working:

```bash
# 1. Check the stored keys after login
# Open browser console after logging in:
Object.keys(localStorage).filter(k => k.includes('buildcraft'))
# Should show: ["buildcraft_access_token", "buildcraft_refresh_token", "buildcraft_user"]

# 2. Check user data
localStorage.getItem('buildcraft_user')
# Should show user JSON data

# 3. Navigate to progress page
# Should NOT redirect to login if session is valid
```

## Lessons Learned

1. **Always use constants for localStorage keys** - Prevents typos and ensures consistency
2. **Check for browser environment** - Next.js runs code on both server and client
3. **Follow existing patterns** - The tokenManager already had the correct implementation
4. **Test authentication flows thoroughly** - Session management is critical for UX

## Impact

-   ✅ Fixed: Progress tracking page now works correctly for logged-in users
-   ✅ Fixed: No more unwanted redirects to login page
-   ✅ Fixed: Proper session cleanup on logout
-   ✅ Fixed: No SSR errors related to localStorage

## Related Files

-   `/nextjs/src/lib/auth-utils.ts` - Fixed auth utilities
-   `/nextjs/src/lib/api-config.ts` - Token key constants
-   `/nextjs/src/lib/api-client.ts` - Reference implementation (tokenManager)
-   `/nextjs/src/app/customer/progress/page.tsx` - Consumer of auth utilities

---

**Date**: October 11, 2025  
**Status**: ✅ Fixed  
**Version**: 1.1
