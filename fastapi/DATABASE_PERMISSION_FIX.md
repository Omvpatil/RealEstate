"""
Database Permission Fix Guide for RealEstate Project
====================================================

PROBLEM: PostgreSQL user 'users' doesn't have permission to create types in public schema

ERROR: permission denied for schema public
SQL: CREATE TYPE usertype AS ENUM ('BUILDER', 'CUSTOMER')

This happens because PostgreSQL 15+ changed default permissions on the public schema.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SOLUTION 1: Grant Permissions (Recommended)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Run these commands in your terminal:

```bash
# Connect to PostgreSQL as superuser
sudo -u postgres psql

# Or if you have postgres user password
psql -U postgres
```

Then run these SQL commands:

```sql
-- Connect to the realestate database
\c realestate

-- Grant all permissions on public schema to 'users'
GRANT ALL ON SCHEMA public TO users;

-- Grant permissions on existing objects
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO users;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO users;

-- Grant permissions on future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO users;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO users;

-- Verify
\dn+ public
```

Or run the provided SQL file:

```bash
sudo -u postgres psql -d realestate -f fix_permissions.sql
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SOLUTION 2: Use Superuser Account
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Update database/database.py to use postgres superuser:

```python
# Change from:
DATABASE_URL = "postgresql://users:password@localhost:5432/realestate"

# To:
DATABASE_URL = "postgresql://postgres:your_postgres_password@localhost:5432/realestate"
```

⚠️ NOTE: Not recommended for production!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SOLUTION 3: Make User Owner of Schema
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

As PostgreSQL superuser:

```sql
\c realestate
ALTER SCHEMA public OWNER TO users;
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SOLUTION 4: Create User with Proper Permissions from Start
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

If starting fresh:

```sql
-- As postgres superuser
CREATE DATABASE realestate;
CREATE USER users WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE realestate TO users;

\c realestate
GRANT ALL ON SCHEMA public TO users;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO users;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO users;
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

QUICK FIX (One-liner)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

```bash
sudo -u postgres psql -d realestate -c "GRANT ALL ON SCHEMA public TO users;"
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

VERIFICATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

After applying the fix, verify it works:

```bash
# Test the database initialization
cd /home/om_patil/Desktop/Codes/projects/RealEstate/fastapi
python init_database.py
```

You should see:
✅ Creating database tables...
✅ Database initialized successfully!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

UNDERSTANDING THE ERROR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. SQLAlchemy tries to create ENUM types:
   CREATE TYPE usertype AS ENUM ('BUILDER', 'CUSTOMER')

2. This requires CREATE permission on the public schema

3. PostgreSQL 15+ doesn't grant this automatically

4. You need to explicitly grant permissions to your user

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

RECOMMENDED APPROACH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

For Development: Use Solution 1 (Grant Permissions)
For Production: Use a dedicated user with proper permissions
For Quick Test: Use Solution 2 (Superuser) temporarily

Choose Solution 1 - it's the most secure and proper way!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"""
