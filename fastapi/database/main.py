from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from typing import Optional, List
from datetime import datetime, timedelta
from jose import JWTError, jwt

from database import crud, schemas, models
from database.database import get_db, engine, Base

# Create all tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="BuildCraft RealEstate API",
    description="Comprehensive Real Estate Platform API for Builders and Customers",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],  # Next.js frontend
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# JWT Configuration
SECRET_KEY = "your-secret-key-change-this-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
REFRESH_TOKEN_EXPIRE_DAYS = 7

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


# ============= AUTHENTICATION UTILITIES =============

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire, "type": "access"})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def create_refresh_token(data: dict):
    """Create JWT refresh token."""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "type": "refresh"})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> models.User:
    """Get current authenticated user."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = crud.get_user_by_id(db, user_id=int(user_id))
    if user is None:
        raise credentials_exception
    return user


def require_builder(current_user: models.User = Depends(get_current_user)) -> models.User:
    """Require builder user type."""
    if current_user.user_type != models.UserType.BUILDER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Builder access required"
        )
    return current_user


def require_customer(current_user: models.User = Depends(get_current_user)) -> models.User:
    """Require customer user type."""
    if current_user.user_type != models.UserType.CUSTOMER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Customer access required"
        )
    return current_user


# ============= AUTHENTICATION ROUTES =============

@app.post("/api/auth/register", response_model=schemas.TokenResponse, status_code=status.HTTP_201_CREATED)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """Register a new user (builder or customer)."""
    # Check if user already exists
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create user with error handling for database constraints
    try:
        db_user = crud.create_user(db=db, user=user)
    except Exception as e:
        # Handle database constraint violations
        error_msg = str(e)
        if "duplicate key" in error_msg.lower():
            if "license_number" in error_msg.lower():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="License number already registered"
                )
            elif "phone" in error_msg.lower():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Phone number already registered"
                )
            else:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="This information is already registered"
                )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Registration failed. Please try again."
        )
    
    # Generate tokens
    access_token = create_access_token(data={"sub": str(db_user.id)})
    refresh_token = create_refresh_token(data={"sub": str(db_user.id)})
    
    # Get builder_id or customer_id
    builder_id = None
    customer_id = None
    if db_user.user_type == models.UserType.BUILDER:
        builder = crud.get_builder_by_user_id(db, db_user.id)
        if builder:
            builder_id = builder.id
    elif db_user.user_type == models.UserType.CUSTOMER:
        customer = crud.get_customer_by_user_id(db, db_user.id)
        if customer:
            customer_id = customer.id
    
    # Create user response with builder_id/customer_id
    user_response = schemas.UserResponse(
        id=db_user.id,
        email=db_user.email,
        user_type=db_user.user_type,
        is_active=db_user.is_active,
        is_verified=db_user.is_verified,
        created_at=db_user.created_at,
        last_login=db_user.last_login,
        builder_id=builder_id,
        customer_id=customer_id
    )
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "expires_in": ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        "user": user_response
    }


@app.post("/api/auth/login", response_model=schemas.TokenResponse)
def login(
    user_credentials: schemas.UserLogin,
    db: Session = Depends(get_db)
):
    """Login user and return JWT tokens."""
    # Get user by email
    user = crud.get_user_by_email(db, email=user_credentials.email)
    
    if not user or not crud.verify_password(user_credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Update last login
    crud.update_user_last_login(db, user.id)
    
    # Generate tokens
    access_token = create_access_token(data={"sub": str(user.id)})
    refresh_token = create_refresh_token(data={"sub": str(user.id)})
    
    # Get builder_id or customer_id
    builder_id = None
    customer_id = None
    if user.user_type == models.UserType.BUILDER:
        builder = crud.get_builder_by_user_id(db, user.id)
        if builder:
            builder_id = builder.id
    elif user.user_type == models.UserType.CUSTOMER:
        customer = crud.get_customer_by_user_id(db, user.id)
        if customer:
            customer_id = customer.id
    
    # Create user response with builder_id/customer_id
    user_response = schemas.UserResponse(
        id=user.id,
        email=user.email,
        user_type=user.user_type,
        is_active=user.is_active,
        is_verified=user.is_verified,
        created_at=user.created_at,
        last_login=user.last_login,
        builder_id=builder_id,
        customer_id=customer_id
    )
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "expires_in": ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        "user": user_response
    }


@app.get("/api/auth/me", response_model=schemas.UserResponse)
def get_current_user_info(current_user: models.User = Depends(get_current_user)):
    """Get current user information."""
    return current_user


# ============= PROJECT ROUTES =============

@app.get("/api/projects", response_model=schemas.ProjectListResponse)
def get_projects(
    page: int = 1,
    limit: int = 10,
    status: Optional[models.ProjectStatus] = None,
    city: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    unit_type: Optional[models.UnitType] = None,
    builder_id: Optional[int] = None,
    project_type: Optional[models.ProjectType] = None,
    db: Session = Depends(get_db)
):
    """Get all projects with filtering and pagination."""
    filters = schemas.ProjectFilter(
        page=page,
        limit=limit,
        status=status,
        city=city,
        min_price=min_price,
        max_price=max_price,
        unit_type=unit_type,
        builder_id=builder_id,
        project_type=project_type
    )
    return crud.get_projects(db, filters)


@app.get("/api/projects/{project_id}", response_model=schemas.ProjectResponse)
def get_project(project_id: int, db: Session = Depends(get_db)):
    """Get project by ID."""
    project = crud.get_project(db, project_id=project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@app.post("/api/projects", response_model=schemas.ProjectResponse, status_code=status.HTTP_201_CREATED)
def create_project(
    project: schemas.ProjectCreate,
    current_user: models.User = Depends(require_builder),
    db: Session = Depends(get_db)
):
    """Create a new project (builder only)."""
    return crud.create_project(db=db, project=project)


@app.patch("/api/projects/{project_id}", response_model=schemas.ProjectResponse)
def update_project(
    project_id: int,
    project_update: schemas.ProjectUpdate,
    current_user: models.User = Depends(require_builder),
    db: Session = Depends(get_db)
):
    """Update project (builder only)."""
    project = crud.get_project(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Get builder_id from user
    builder = crud.get_builder_by_user_id(db, current_user.id)
    if not builder:
        raise HTTPException(status_code=403, detail="Builder not found")
    
    # Check if builder owns this project
    if project.builder_id != builder.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    return crud.update_project(db, project_id, project_update)


@app.delete("/api/projects/{project_id}", status_code=status.HTTP_200_OK)
def delete_project(
    project_id: int,
    current_user: models.User = Depends(require_builder),
    db: Session = Depends(get_db)
):
    """Delete project (builder only)."""
    project = crud.get_project(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Get builder_id from user
    builder = crud.get_builder_by_user_id(db, current_user.id)
    if not builder:
        raise HTTPException(status_code=403, detail=f"Builder not found for user_id: {current_user.id}")
    
    # Check if builder owns this project
    if project.builder_id != builder.id:
        raise HTTPException(
            status_code=403, 
            detail=f"Not authorized: project.builder_id={project.builder_id}, builder.id={builder.id}"
        )
    
    success = crud.delete_project(db, project_id)
    if not success:
        raise HTTPException(status_code=404, detail="Project not found")
    
    return {"message": "Project deleted successfully"}


# ============= UNIT ROUTES =============

@app.get("/api/projects/{project_id}/units", response_model=List[schemas.UnitResponse])
def get_units_by_project(project_id: int, db: Session = Depends(get_db)):
    """Get all units for a specific project."""
    return crud.get_units_by_project(db, project_id)


@app.post("/api/units", response_model=schemas.UnitResponse, status_code=status.HTTP_201_CREATED)
def create_unit(
    unit: schemas.UnitCreate,
    current_user: models.User = Depends(require_builder),
    db: Session = Depends(get_db)
):
    """Create a new unit (builder only)."""
    return crud.create_unit(db=db, unit=unit)


# ============= BOOKING ROUTES =============

@app.post("/api/bookings", response_model=schemas.BookingResponse, status_code=status.HTTP_201_CREATED)
def create_booking(
    booking: schemas.BookingCreate,
    current_user: models.User = Depends(require_customer),
    db: Session = Depends(get_db)
):
    """Create a new booking (customer only)."""
    # Verify customer
    customer = crud.get_customer_by_user_id(db, current_user.id)
    if booking.customer_id != customer.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Check unit availability
    unit = crud.get_unit_by_id(db, booking.unit_id)
    if not unit:
        raise HTTPException(status_code=404, detail="Unit not found")
    if unit.status != models.UnitStatus.AVAILABLE:
        raise HTTPException(status_code=400, detail="Unit not available")
    
    return crud.create_booking(db=db, booking=booking)


@app.get("/api/bookings/customer/{customer_id}", response_model=List[schemas.BookingResponse])
def get_customer_bookings(
    customer_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all bookings for a customer."""
    return crud.get_bookings_by_customer(db, customer_id)


# ============= APPOINTMENT ROUTES =============

@app.post("/api/appointments", response_model=schemas.AppointmentResponse, status_code=status.HTTP_201_CREATED)
def create_appointment(
    appointment: schemas.AppointmentCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new appointment."""
    return crud.create_appointment(db=db, appointment=appointment)


@app.get("/api/appointments/customer/{customer_id}", response_model=List[schemas.AppointmentResponse])
def get_customer_appointments(
    customer_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all appointments for a customer."""
    return crud.get_appointments_by_customer(db, customer_id)


@app.get("/api/appointments/project/{project_id}", response_model=List[schemas.AppointmentResponse])
def get_project_appointments(
    project_id: int,
    current_user: models.User = Depends(require_builder),
    db: Session = Depends(get_db)
):
    """Get all appointments for a project (builder only)."""
    return crud.get_appointments_by_project(db, project_id)


@app.get("/api/appointments", response_model=dict)
def get_all_appointments(
    page: int = 1,
    limit: int = 10,
    status: Optional[str] = None,
    appointment_type: Optional[str] = None,
    project_id: Optional[int] = None,
    current_user: models.User = Depends(require_builder),
    db: Session = Depends(get_db)
):
    """Get all appointments for builder with filters and stats."""
    # Get builder
    builder = crud.get_builder_by_user_id(db, current_user.id)
    
    # Build query
    query = db.query(models.Appointment).join(models.Project).filter(
        models.Project.builder_id == builder.id
    )
    
    # Apply filters
    if status:
        query = query.filter(models.Appointment.status == status)
    if appointment_type:
        query = query.filter(models.Appointment.appointment_type == appointment_type)
    if project_id:
        query = query.filter(models.Appointment.project_id == project_id)
    
    # Calculate stats
    total = query.count()
    confirmed = query.filter(models.Appointment.status == models.AppointmentStatus.CONFIRMED).count()
    scheduled = query.filter(models.Appointment.status == models.AppointmentStatus.SCHEDULED).count()
    completed = query.filter(models.Appointment.status == models.AppointmentStatus.COMPLETED).count()
    cancelled = query.filter(models.Appointment.status == models.AppointmentStatus.CANCELLED).count()
    
    # Paginate
    appointments = query.offset((page - 1) * limit).limit(limit).all()
    
    return {
        "appointments": appointments,
        "total": total,
        "page": page,
        "limit": limit,
        "stats": {
            "total": total,
            "confirmed": confirmed,
            "scheduled": scheduled,
            "completed": completed,
            "cancelled": cancelled
        }
    }


@app.get("/api/appointments/{appointment_id}", response_model=schemas.AppointmentResponse)
def get_appointment_by_id(
    appointment_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get appointment by ID."""
    appointment = crud.get_appointment_by_id(db, appointment_id)
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return appointment


@app.patch("/api/appointments/{appointment_id}/status", response_model=schemas.AppointmentResponse)
def update_appointment_status(
    appointment_id: int,
    status_update: dict,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update appointment status."""
    appointment = crud.get_appointment_by_id(db, appointment_id)
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    new_status = status_update.get("status")
    if new_status not in ["pending", "confirmed", "completed", "cancelled"]:
        raise HTTPException(status_code=400, detail="Invalid status")
    
    appointment.status = new_status
    appointment.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(appointment)
    return appointment


@app.patch("/api/appointments/{appointment_id}/reschedule", response_model=schemas.AppointmentResponse)
def reschedule_appointment(
    appointment_id: int,
    reschedule_data: dict,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Reschedule appointment."""
    appointment = crud.get_appointment_by_id(db, appointment_id)
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    if "appointment_date" in reschedule_data:
        appointment.appointment_date = reschedule_data["appointment_date"]
    if "meeting_location" in reschedule_data:
        appointment.meeting_location = reschedule_data["meeting_location"]
    
    appointment.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(appointment)
    return appointment


@app.delete("/api/appointments/{appointment_id}", response_model=dict)
def cancel_appointment(
    appointment_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Cancel appointment."""
    appointment = crud.get_appointment_by_id(db, appointment_id)
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    appointment.status = models.AppointmentStatus.CANCELLED
    appointment.updated_at = datetime.utcnow()
    db.commit()
    
    return {"success": True, "message": "Appointment cancelled successfully"}


# ============= MESSAGE ROUTES =============

@app.get("/api/messages/conversations", response_model=dict)
def get_user_conversations(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all conversations for current user."""
    conversations = crud.get_conversations(db, current_user.id)
    return {"conversations": conversations, "total": len(conversations)}


@app.get("/api/messages/conversation/{customer_id}/{project_id}", response_model=dict)
def get_conversation_messages(
    customer_id: int,
    project_id: int,
    page: int = 1,
    limit: int = 50,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get messages in a specific conversation."""
    # Build query for messages between builder and customer for specific project
    query = db.query(models.Message).filter(
        models.Message.project_id == project_id,
        or_(
            and_(
                models.Message.sender_id == current_user.id,
                models.Message.recipient_id == customer_id
            ),
            and_(
                models.Message.sender_id == customer_id,
                models.Message.recipient_id == current_user.id
            )
        )
    ).order_by(models.Message.created_at.asc())
    
    total = query.count()
    messages = query.offset((page - 1) * limit).limit(limit).all()
    
    # Mark messages as read
    for msg in messages:
        if msg.recipient_id == current_user.id and not msg.is_read:
            msg.is_read = True
    db.commit()
    
    return {
        "messages": messages,
        "total": total,
        "page": page,
        "limit": limit
    }


@app.post("/api/messages", response_model=schemas.MessageResponse, status_code=status.HTTP_201_CREATED)
def send_message(
    message: schemas.MessageCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Send a new message."""
    # Set sender_id to current user
    message_data = message.dict()
    message_data["sender_id"] = current_user.id
    
    db_message = models.Message(**message_data)
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message


@app.patch("/api/messages/conversation/{conversation_id}/read", response_model=dict)
def mark_conversation_read(
    conversation_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Mark all messages in a conversation as read."""
    messages = db.query(models.Message).filter(
        models.Message.id >= conversation_id,
        models.Message.recipient_id == current_user.id,
        models.Message.is_read == False
    ).all()
    
    count = 0
    for msg in messages:
        msg.is_read = True
        count += 1
    
    db.commit()
    return {"success": True, "marked_read": count}


@app.get("/api/messages", response_model=dict)
def get_messages(
    page: int = 1,
    limit: int = 20,
    conversation_id: Optional[int] = None,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all messages for current user (paginated)."""
    query = db.query(models.Message).filter(
        or_(
            models.Message.sender_id == current_user.id,
            models.Message.recipient_id == current_user.id
        )
    )
    
    if conversation_id:
        query = query.filter(models.Message.id >= conversation_id)
    
    total = query.count()
    messages = query.order_by(models.Message.created_at.desc()).offset((page - 1) * limit).limit(limit).all()
    
    return {
        "messages": messages,
        "total": total,
        "page": page,
        "limit": limit
    }


# ============= BOOKING MANAGEMENT (BUILDER) ROUTES =============

@app.get("/api/builder/bookings", response_model=dict)
def get_builder_bookings(
    page: int = 1,
    limit: int = 10,
    status: Optional[str] = None,
    project_id: Optional[int] = None,
    payment_status: Optional[str] = None,
    current_user: models.User = Depends(require_builder),
    db: Session = Depends(get_db)
):
    """Get all bookings for builder with filters and stats."""
    # Get builder
    builder = crud.get_builder_by_user_id(db, current_user.id)
    
    # Build query
    query = db.query(models.Booking).join(models.Unit).join(models.Project).filter(
        models.Project.builder_id == builder.id
    )
    
    # Apply filters
    if status:
        query = query.filter(models.Booking.booking_status == status)
    if project_id:
        query = query.filter(models.Project.id == project_id)
    if payment_status:
        if payment_status == "completed":
            query = query.filter(models.Booking.pending_amount == 0)
        elif payment_status == "pending":
            query = query.filter(models.Booking.paid_amount == 0)
        elif payment_status == "partial":
            query = query.filter(
                models.Booking.paid_amount > 0,
                models.Booking.pending_amount > 0
            )
    
    # Calculate stats
    all_bookings = db.query(models.Booking).join(models.Unit).join(models.Project).filter(
        models.Project.builder_id == builder.id
    ).all()
    
    total_bookings = len(all_bookings)
    active_bookings = sum(1 for b in all_bookings if b.status == models.BookingStatus.ACTIVE)
    completed_bookings = sum(1 for b in all_bookings if b.status == models.BookingStatus.COMPLETED)
    total_revenue = sum(b.paid_amount for b in all_bookings)
    pending_revenue = sum(b.pending_amount for b in all_bookings)
    
    # Paginate
    total = query.count()
    bookings = query.offset((page - 1) * limit).limit(limit).all()
    
    # Calculate payment progress for each booking
    booking_list = []
    for booking in bookings:
        booking_dict = {
            "id": booking.id,
            "booking_number": f"BK-{booking.id:03d}",
            "customer": {
                "id": booking.customer.id,
                "name": f"{booking.customer.first_name} {booking.customer.last_name}",
                "email": booking.customer.user.email,
                "phone": booking.customer.phone
            },
            "project": {
                "id": booking.unit.project.id,
                "name": booking.unit.project.project_name
            },
            "unit": {
                "id": booking.unit.id,
                "number": booking.unit.unit_number,
                "type": booking.unit.unit_type,
                "floor": booking.unit.floor_number,
                "area_sqft": float(booking.unit.area_sqft)
            },
            "total_amount": float(booking.total_amount),
            "token_amount": float(booking.token_amount),
            "paid_amount": float(booking.paid_amount),
            "pending_amount": float(booking.pending_amount),
            "payment_plan": booking.payment_plan,
            "booking_date": booking.booking_date.isoformat() if booking.booking_date else None,
            "status": booking.status,
            "payment_progress": round((float(booking.paid_amount) / float(booking.total_amount)) * 100, 2) if booking.total_amount > 0 else 0
        }
        booking_list.append(booking_dict)
    
    return {
        "bookings": booking_list,
        "total": total,
        "page": page,
        "limit": limit,
        "stats": {
            "total_bookings": total_bookings,
            "active_bookings": active_bookings,
            "completed_bookings": completed_bookings,
            "total_revenue": float(total_revenue),
            "pending_revenue": float(pending_revenue)
        }
    }


@app.get("/api/bookings/{booking_id}", response_model=schemas.BookingResponse)
def get_booking_details(
    booking_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get booking details by ID."""
    booking = crud.get_booking_by_id(db, booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return booking


@app.patch("/api/bookings/{booking_id}/status", response_model=schemas.BookingResponse)
def update_booking_status(
    booking_id: int,
    status_update: dict,
    current_user: models.User = Depends(require_builder),
    db: Session = Depends(get_db)
):
    """Update booking status."""
    booking = crud.get_booking_by_id(db, booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    new_status = status_update.get("status")
    if new_status not in ["pending", "active", "completed", "cancelled"]:
        raise HTTPException(status_code=400, detail="Invalid status")
    
    booking.status = new_status
    booking.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(booking)
    return booking


@app.get("/api/bookings/{booking_id}/payments", response_model=dict)
def get_booking_payments(
    booking_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all payments for a booking."""
    booking = crud.get_booking_by_id(db, booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    payments = crud.get_payments_by_booking(db, booking_id)
    
    return {
        "booking_id": booking_id,
        "payments": payments,
        "total_paid": float(booking.paid_amount),
        "total_pending": float(booking.pending_amount),
        "payment_schedule": []  # Could be implemented based on payment plan
    }


@app.post("/api/payments", response_model=schemas.PaymentResponse, status_code=status.HTTP_201_CREATED)
def record_payment(
    payment: schemas.PaymentCreate,
    current_user: models.User = Depends(require_builder),
    db: Session = Depends(get_db)
):
    """Record a new payment."""
    # Get booking
    booking = crud.get_booking_by_id(db, payment.booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    # Create payment
    db_payment = crud.create_payment(db, payment)
    
    # Update booking amounts
    booking.paid_amount += payment.amount
    booking.pending_amount = booking.total_amount - booking.paid_amount
    booking.updated_at = datetime.utcnow()
    
    # Update booking status if fully paid
    if booking.pending_amount <= 0:
        booking.status = models.BookingStatus.COMPLETED
    elif booking.paid_amount > 0:
        booking.status = models.BookingStatus.ACTIVE
    
    db.commit()
    db.refresh(db_payment)
    return db_payment


@app.post("/api/bookings/{booking_id}/generate-agreement", response_model=dict)
def generate_booking_agreement(
    booking_id: int,
    current_user: models.User = Depends(require_builder),
    db: Session = Depends(get_db)
):
    """Generate booking agreement PDF."""
    booking = crud.get_booking_by_id(db, booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    # In a real implementation, generate PDF here
    # For now, return a mock URL
    agreement_url = f"https://cdn.example.com/agreements/BK-{booking.id:03d}.pdf"
    
    return {
        "booking_id": booking_id,
        "agreement_url": agreement_url,
        "generated_at": datetime.utcnow().isoformat()
    }


@app.get("/api/bookings/{booking_id}/download-agreement")
def download_booking_agreement(
    booking_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Download booking agreement PDF."""
    booking = crud.get_booking_by_id(db, booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    # In a real implementation, return the PDF file
    # For now, return a redirect or error
    raise HTTPException(
        status_code=501,
        detail="Agreement download not implemented. Use generate-agreement endpoint first."
    )


# ============= PROGRESS TRACKING ROUTES =============

@app.get("/api/projects/{project_id}/progress", response_model=List[schemas.ProjectProgressResponse])
def get_project_progress(project_id: int, db: Session = Depends(get_db)):
    """Get construction progress for a project."""
    return crud.get_progress_by_project(db, project_id)


@app.get("/api/projects/{project_id}/updates", response_model=List[schemas.ConstructionUpdateResponse])
def get_construction_updates(
    project_id: int,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    """Get recent construction updates for a project."""
    return crud.get_updates_by_project(db, project_id, limit)


# ============= CHANGE REQUEST ROUTES =============

@app.post("/api/change-requests", response_model=schemas.ChangeRequestResponse, status_code=status.HTTP_201_CREATED)
def create_change_request(
    change_request: schemas.ChangeRequestCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Create a new change request."""
    # Verify the booking belongs to the customer
    booking = crud.get_booking_by_id(db, change_request.booking_id)
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    if current_user.user_type == models.UserType.CUSTOMER:
        if booking.customer_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to create change request for this booking"
            )
    
    return crud.create_change_request(db, change_request)


@app.get("/api/change-requests/{request_id}", response_model=schemas.ChangeRequestResponse)
def get_change_request(
    request_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Get a specific change request."""
    change_request = crud.get_change_request_by_id(db, request_id)
    if not change_request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Change request not found"
        )
    
    # Verify access
    if current_user.user_type == models.UserType.CUSTOMER:
        if change_request.booking.customer_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to view this change request"
            )
    elif current_user.user_type == models.UserType.BUILDER:
        # Check if builder owns the project
        if change_request.booking.unit.project.builder_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to view this change request"
            )
    
    return change_request


@app.get("/api/change-requests", response_model=List[schemas.ChangeRequestResponse])
def get_change_requests(
    booking_id: int = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """
    Get change requests.
    - Customers: Get their own change requests
    - Builders: Get change requests for their projects
    """
    if current_user.user_type == models.UserType.CUSTOMER:
        # Get all change requests for customer's bookings
        bookings = crud.get_bookings_by_customer(db, current_user.id)
        all_requests = []
        for booking in bookings:
            requests = crud.get_change_requests_by_booking(db, booking.id)
            all_requests.extend(requests)
        
        # Filter by booking_id if provided
        if booking_id:
            all_requests = [r for r in all_requests if r.booking_id == booking_id]
        
        return all_requests
    
    elif current_user.user_type == models.UserType.BUILDER:
        # Get all change requests for builder's projects
        projects = crud.get_builder_projects(db, current_user.id)
        all_requests = []
        
        for project in projects:
            # Get all units in the project
            units = crud.get_units_by_project(db, project.id)
            for unit in units:
                # Get all bookings for the unit
                bookings = db.query(models.Booking).filter(
                    models.Booking.unit_id == unit.id
                ).all()
                for booking in bookings:
                    requests = crud.get_change_requests_by_booking(db, booking.id)
                    all_requests.extend(requests)
        
        # Filter by booking_id if provided
        if booking_id:
            all_requests = [r for r in all_requests if r.booking_id == booking_id]
        
        return all_requests
    
    return []


@app.patch("/api/change-requests/{request_id}", response_model=schemas.ChangeRequestResponse)
def update_change_request(
    request_id: int,
    request_update: schemas.ChangeRequestUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Update a change request (builder only for status updates)."""
    change_request = crud.get_change_request_by_id(db, request_id)
    if not change_request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Change request not found"
        )
    
    # Only builders can update change requests
    if current_user.user_type != models.UserType.BUILDER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only builders can update change requests"
        )
    
    # Verify builder owns the project
    if change_request.booking.unit.project.builder_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this change request"
        )
    
    return crud.update_change_request(db, request_id, request_update)


# ============= NOTIFICATION ROUTES =============

@app.get("/api/notifications")
def get_notifications(
    page: int = 1,
    limit: int = 10,
    is_read: Optional[bool] = None,
    notification_type: Optional[models.NotificationType] = None,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get notifications for current user."""
    filters = schemas.NotificationFilter(
        page=page,
        limit=limit,
        is_read=is_read,
        notification_type=notification_type
    )
    return crud.get_notifications_for_user(db, current_user.id, filters)


@app.patch("/api/notifications/{notification_id}/read", response_model=schemas.NotificationResponse)
def mark_notification_read(
    notification_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Mark notification as read."""
    notification = crud.get_notification_by_id(db, notification_id)
    if not notification or notification.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    return crud.mark_notification_as_read(db, notification_id)


# ============= HEALTH CHECK =============

@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "timestamp": datetime.utcnow()}


# ============= ROOT =============

@app.get("/")
def root():
    """Root endpoint."""
    return {
        "message": "BuildCraft RealEstate API",
        "version": "1.0.0",
        "docs": "/api/docs"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
