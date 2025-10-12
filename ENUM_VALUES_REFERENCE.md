# Enum Values Reference

## Important: All enum values in the backend are **lowercase**!

When sending data from the frontend to the backend, always use lowercase enum values.

## User Type

```typescript
// ✅ CORRECT
user_type: "builder"; // for builders
user_type: "customer"; // for customers

// ❌ WRONG
user_type: "BUILDER";
user_type: "CUSTOMER";
```

### Backend Definition (models.py)

```python
class UserType(str, enum.Enum):
    BUILDER = "builder"      # Key is uppercase, VALUE is lowercase
    CUSTOMER = "customer"    # Key is uppercase, VALUE is lowercase
```

## Registration Payload Examples

### Builder Registration

```json
{
    "email": "builder@example.com",
    "password": "securepass123",
    "user_type": "builder",
    "builder_data": {
        "company_name": "ABC Constructions",
        "license_number": "LIC12345",
        "phone": "1234567890",
        "address": "123 Builder St"
    }
}
```

### Customer Registration

```json
{
    "email": "customer@example.com",
    "password": "securepass123",
    "user_type": "customer",
    "customer_data": {
        "first_name": "John",
        "last_name": "Doe",
        "phone": "0987654321",
        "address": "456 Customer Ave"
    }
}
```

## Login Payload

```json
{
    "email": "user@example.com",
    "password": "securepass123",
    "user_type": "builder" // or "customer"
}
```

## Common Validation Errors

### Error: `Input should be 'builder' or 'customer'`

**Cause:** Sending uppercase values like `"BUILDER"` or `"CUSTOMER"`
**Fix:** Use lowercase: `"builder"` or `"customer"`

### Error: `422 Unprocessable Content`

**Possible Causes:**

1. Incorrect enum values (uppercase instead of lowercase)
2. Missing required nested objects (`builder_data` or `customer_data`)
3. Wrong data structure (flat instead of nested)

## All Backend Enums (for reference)

All these enums use lowercase values:

-   `UserType`: "builder", "customer"
-   `ProjectType`: "residential", "commercial", "mixed"
-   `ProjectStatus`: "planning", "approved", "in_progress", "completed", "on_hold", "cancelled"
-   `UnitType`: "1bhk", "2bhk", "3bhk", "4bhk", "penthouse", "studio", "duplex", "shop", "office"
-   `UnitStatus`: "available", "booked", "sold", "reserved"
-   `FacingDirection`: "north", "south", "east", "west", "north_east", "north_west", "south_east", "south_west"
-   `BookingStatus`: "pending", "confirmed", "cancelled", "completed"
-   `PaymentPlan`: "full_payment", "installments", "construction_linked", "possession_linked", "down_payment_emi"
-   `PaymentType`: "booking_amount", "down_payment", "installment", "final_payment", "maintenance", "registration", "other"
-   `PaymentMethod`: "cash", "cheque", "bank_transfer", "credit_card", "debit_card", "upi", "other"
-   `PaymentStatus`: "pending", "completed", "failed", "refunded", "cancelled"
-   `AppointmentType`: "site_visit", "meeting", "documentation", "payment", "handover", "other"
-   `AppointmentStatus`: "scheduled", "confirmed", "completed", "cancelled", "rescheduled", "no_show"
-   `MeetingLocation`: "on_site", "office", "online", "customer_location", "other"
-   `ProgressStatus`: "not_started", "in_progress", "completed", "delayed", "on_hold"
-   `UpdateType`: "milestone", "inspection", "issue", "completion", "delay", "general"
-   `Priority`: "low", "medium", "high", "urgent"
-   `MessageType`: "inquiry", "notification", "update", "reminder", "support", "other"
-   `ChangeRequestType`: "design", "material", "layout", "other"
-   `ChangeRequestStatus`: "pending", "approved", "rejected", "in_progress", "completed"
-   `ModelType`: "3d_model", "floor_plan", "elevation", "section", "rendering", "walkthrough", "other"
-   `FileFormat`: "pdf", "dwg", "skp", "obj", "fbx", "glb", "png", "jpg", "mp4", "other"
-   `AccessLevel`: "view", "download", "edit", "full"
-   `NotificationType`: "booking", "payment", "appointment", "progress_update", "message", "change_request", "system", "other"
-   `PreferredContactMethod`: "email", "phone", "sms", "whatsapp"

## Frontend TypeScript Type Definitions

```typescript
// Always use lowercase literal types
type UserType = "builder" | "customer";
type ProjectType = "residential" | "commercial" | "mixed";
type ProjectStatus = "planning" | "approved" | "in_progress" | "completed" | "on_hold" | "cancelled";
// ... etc
```
