"""
BuildCraft RealEstate API - Main Application Entry Point

This is the main FastAPI application that orchestrates all the routes and middleware.
The application is organized in a modular structure:

- database/: Database models, schemas, CRUD operations
- routes/: API route modules organized by domain
- database/auth.py: Authentication utilities and dependencies

All routes are automatically included from the routes module.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database.database import engine, Base
from routes import (
    auth_router,
    projects_router,
    units_router,
    bookings_router,
    appointments_router,
    messages_router,
    payments_router,
    notifications_router,
)

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI application
app = FastAPI(
    title="BuildCraft RealEstate API",
    description="""
    ## Comprehensive Real Estate Platform API for Builders and Customers
    
    This API provides complete functionality for:
    - **Authentication**: User registration, login, and profile management
    - **Projects**: Browse and manage real estate projects
    - **Units**: Manage property units within projects
    - **Bookings**: Create and track property bookings
    - **Appointments**: Schedule and manage site visits
    - **Messages**: Communication between builders and customers
    - **Payments**: Track and record payment transactions
    - **Notifications**: User notification system
    
    ### Authentication
    Most endpoints require authentication using JWT bearer tokens.
    Use the `/api/auth/login` endpoint to obtain a token.
    
    ### User Roles
    - **Builder**: Can create projects, manage units, view bookings, etc.
    - **Customer**: Can browse projects, book units, schedule appointments
    
    ### API Documentation
    - Interactive API docs: `/api/docs` (Swagger UI)
    - Alternative docs: `/api/redoc` (ReDoc)
    """,
    version="2.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    contact={
        "name": "BuildCraft RealEstate",
        "url": "https://buildcraft.example.com",
        "email": "support@buildcraft.example.com",
    },
    license_info={
        "name": "MIT License",
        "url": "https://opensource.org/licenses/MIT",
    },
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Next.js development server
        "http://localhost:3001",  # Alternative Next.js port
        # Add production origins here
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all routers
app.include_router(auth_router)
app.include_router(projects_router)
app.include_router(units_router)
app.include_router(bookings_router)
app.include_router(appointments_router)
app.include_router(messages_router)
app.include_router(payments_router)
app.include_router(notifications_router)


# Health check and root endpoints
@app.get("/health", tags=["Health"])
def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "BuildCraft RealEstate API",
        "version": "2.0.0"
    }


@app.get("/", tags=["Root"])
def root():
    """Root endpoint with API information."""
    return {
        "message": "Welcome to BuildCraft RealEstate API",
        "version": "2.0.0",
        "docs": "/api/docs",
        "redoc": "/api/redoc",
        "health": "/health"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
