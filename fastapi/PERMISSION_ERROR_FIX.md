# 🚨 Database Permission Error - Quick Fix Guide

## ❗ The Problem

```
sqlalchemy.exc.ProgrammingError: (psycopg2.errors.InsufficientPrivilege)
permission denied for schema public

[SQL: CREATE TYPE usertype AS ENUM ('BUILDER', 'CUSTOMER')]
```

## 🔍 Root Cause

**PostgreSQL 15+ Security Change**: Regular users no longer have automatic CREATE permissions on the `public` schema. Your database user `users` cannot create ENUM types needed by SQLAlchemy.

## ⚡ Quick Fix (Choose ONE)

### **Option 1: Run the Fix Script** ⭐ Recommended

```bash
cd /home/om_patil/Desktop/Codes/projects/RealEstate/fastapi
./fix_db_permissions.sh
```

This will automatically grant the necessary permissions.

---

### **Option 2: Manual SQL Command**

```bash
# One-liner fix
sudo -u postgres psql -d realestate -c "GRANT ALL ON SCHEMA public TO users;"

# Or run the full script
sudo -u postgres psql -d realestate -f fix_permissions.sql
```

---

### **Option 3: Use PostgreSQL Interactive Shell**

```bash
# Connect as postgres superuser
sudo -u postgres psql

# Then run:
\c realestate
GRANT ALL ON SCHEMA public TO users;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO users;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO users;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO users;
\q
```

---

### **Option 4: Change Database User (Quick but not recommended for production)**

Edit `database/database.py`:

```python
# Change line 6 from:
DATABASE_URL = "postgresql://users:password@localhost:5432/realestate"

# To (using postgres superuser):
DATABASE_URL = "postgresql://postgres:your_postgres_password@localhost:5432/realestate"
```

⚠️ **Warning**: Only use this for quick testing, not production!

---

## ✅ After Fixing

Run the initialization again:

```bash
python init_database.py
```

You should see:

```
✅ Creating database tables...
✅ Database initialized successfully!
```

Then start the API:

```bash
python start.py
# or
uvicorn main:app --reload
```

---

## 📚 Files Created to Help You

1. **`DATABASE_PERMISSION_FIX.md`** - Detailed explanation and all solutions
2. **`fix_permissions.sql`** - SQL script to fix permissions
3. **`fix_db_permissions.sh`** - Automated bash script to fix permissions

---

## 🎯 Recommended Solution

**For Development**: Run `./fix_db_permissions.sh` ✅

This grants your `users` database user the proper permissions to create tables, types, and sequences in the public schema.

---

## 🔒 What Permissions Are Needed?

Your database user needs:

-   ✅ CREATE privilege on schema public
-   ✅ ALL privileges on tables in public
-   ✅ ALL privileges on sequences in public
-   ✅ Default privileges for future objects

The fix scripts grant all of these automatically.

---

## 🐛 Still Having Issues?

1. **Check if PostgreSQL is running:**

    ```bash
    sudo systemctl status postgresql
    ```

2. **Verify database exists:**

    ```bash
    sudo -u postgres psql -l | grep realestate
    ```

3. **Check user exists:**

    ```bash
    sudo -u postgres psql -c "\du" | grep users
    ```

4. **See full documentation:**
    ```bash
    cat DATABASE_PERMISSION_FIX.md
    ```

---

## 💡 Understanding the Fix

**Before Fix:**

-   User `users` → No CREATE permission → ❌ Can't create ENUM types → Error

**After Fix:**

-   User `users` → Has CREATE permission → ✅ Can create ENUM types → Success!

---

**Need more help?** Check `DATABASE_PERMISSION_FIX.md` for detailed explanations and alternative solutions.
