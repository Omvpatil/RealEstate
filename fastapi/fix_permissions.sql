-- SQL commands to fix database permissions
-- Run these commands as PostgreSQL superuser

-- Connect to your database
\c realestate

-- Grant schema permissions to the user
GRANT ALL ON SCHEMA public TO users;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO users;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO users;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO users;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO users;

-- Make the user owner of the schema (alternative)
-- ALTER SCHEMA public OWNER TO users;

-- Verify permissions
\dn+ public
