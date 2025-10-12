#!/usr/bin/env python3
"""Test password hashing with bcrypt directly."""

import bcrypt

# Test password hashing
password = "1234"
print(f"Original password: {password}")

# Hash the password
password_bytes = password.encode('utf-8')
salt = bcrypt.gensalt()
hashed = bcrypt.hashpw(password_bytes, salt)
hashed_str = hashed.decode('utf-8')

print(f"Hashed password: {hashed_str}")

# Verify the password
is_valid = bcrypt.checkpw(password_bytes, hashed)
print(f"Password verification: {is_valid}")

# Test with wrong password
wrong_password = "wrong"
wrong_bytes = wrong_password.encode('utf-8')
is_wrong = bcrypt.checkpw(wrong_bytes, hashed)
print(f"Wrong password verification: {is_wrong}")

print("\n✅ Bcrypt is working correctly!")
