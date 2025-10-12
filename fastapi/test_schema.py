#!/usr/bin/env python3
"""Test script to validate Pydantic schemas."""

from database.schemas import UserCreate, BuilderCreate, CustomerCreate
import json

# Test builder data
builder_payload = {
    "email": "test@builder.com",
    "password": "test123",
    "user_type": "builder",
    "builder_data": {
        "company_name": "Test Company",
        "license_number": "LIC123",
        "phone": "1234567890",
        "address": "Test Address"
    }
}

print("=" * 60)
print("Testing Builder Registration Payload")
print("=" * 60)
print(f"Input: {json.dumps(builder_payload, indent=2)}")
print()

try:
    user = UserCreate(**builder_payload)
    print("✓ Builder validation passed")
    print(f"Output: {json.dumps(user.model_dump(), indent=2, default=str)}")
except Exception as e:
    print(f"✗ Builder validation failed:")
    print(f"  Error: {e}")

print()
print("=" * 60)
print("Testing Customer Registration Payload")
print("=" * 60)

# Test customer data
customer_payload = {
    "email": "test@customer.com",
    "password": "test123",
    "user_type": "customer",
    "customer_data": {
        "first_name": "John",
        "last_name": "Doe",
        "phone": "1234567890",
        "address": "Test Address"
    }
}

print(f"Input: {json.dumps(customer_payload, indent=2)}")
print()

try:
    user = UserCreate(**customer_payload)
    print("✓ Customer validation passed")
    print(f"Output: {json.dumps(user.model_dump(), indent=2, default=str)}")
except Exception as e:
    print(f"✗ Customer validation failed:")
    print(f"  Error: {e}")

print()
print("=" * 60)
