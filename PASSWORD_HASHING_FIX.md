# Password Hashing Fix

## Problem

The application was experiencing a `ValueError: password cannot be longer than 72 bytes` error during user registration. This was caused by an incompatibility between `passlib` and newer versions of the `bcrypt` library.

## Root Cause

-   `passlib` version 1.7.4 has a bug when trying to detect bcrypt features
-   During initialization, passlib tests bcrypt with a 73-byte password to detect a "wrap bug"
-   Newer versions of bcrypt (4.0+) strictly enforce the 72-byte limit
-   This causes an error during passlib's initialization, not during actual password hashing

## Error Details

```
File ".../passlib/handlers/bcrypt.py", line 620, in _load_backend_mixin
    version = _bcrypt.__about__.__version__
AttributeError: module 'bcrypt' has no attribute '__about__'

File ".../passlib/handlers/bcrypt.py", line 380, in detect_wrap_bug
    if verify(secret, bug_hash):
ValueError: password cannot be longer than 72 bytes, truncate manually if necessary (e.g. my_password[:72])
```

## Solution

Replaced `passlib.context.CryptContext` with direct `bcrypt` usage.

### Before (using passlib):

```python
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)
```

### After (using bcrypt directly):

```python
import bcrypt

def get_password_hash(password: str) -> str:
    """Hash a password for storing."""
    password_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a stored password against one provided by user."""
    password_bytes = plain_password.encode('utf-8')
    hashed_bytes = hashed_password.encode('utf-8')
    return bcrypt.checkpw(password_bytes, hashed_bytes)
```

## Benefits of Direct bcrypt Usage

1. **No compatibility issues** - Works with all bcrypt versions
2. **Simpler** - No extra dependency layer (passlib)
3. **Secure** - bcrypt is industry-standard for password hashing
4. **Future-proof** - Direct control over hashing parameters

## Testing

A test script is provided: `/fastapi/test_bcrypt.py`

Run it with:

```bash
cd fastapi
python test_bcrypt.py
```

Expected output:

```
Original password: 1234
Hashed password: $2b$12$...
Password verification: True
Wrong password verification: False

✅ Bcrypt is working correctly!
```

## Files Modified

-   `/fastapi/database/crud.py` - Replaced passlib with direct bcrypt usage

## Alternative Solutions (Not Recommended)

1. **Downgrade bcrypt**: `pip install bcrypt==3.2.2` - This works but uses an older, potentially less secure version
2. **Upgrade passlib**: Not available yet - passlib 1.8.0 is in development but not released

## References

-   [Bcrypt documentation](https://pypi.org/project/bcrypt/)
-   [Passlib issue #148](https://foss.heptapod.net/python-libs/passlib/-/issues/148)
-   [Stack Overflow discussion](https://stackoverflow.com/questions/71768345/passlib-bcrypt-valueerror-password-cannot-be-longer-than-72-bytes)
