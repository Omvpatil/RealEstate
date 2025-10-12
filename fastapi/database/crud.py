from sqlalchemy.orm import Session, joinedload
from sqlalchemy import and_, or_, desc, asc
from typing import List, Optional, Dict, Any
from datetime import datetime, date
from decimal import Decimal
import math
import bcrypt

from database import models, schemas

# ============= UTILITY FUNCTIONS =============

def get_password_hash(password: str) -> str:
    """Hash a password for storing."""
    # Convert password to bytes and hash with bcrypt
    password_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a stored password against one provided by user."""
    # Convert both to bytes and verify
    password_bytes = plain_password.encode('utf-8')
    hashed_bytes = hashed_password.encode('utf-8')
    return bcrypt.checkpw(password_bytes, hashed_bytes)

def create_pagination_metadata(page: int, limit: int, total_items: int) -> Dict[str, Any]:
    """Create pagination metadata."""
    total_pages = math.ceil(total_items / limit) if total_items > 0 else 0
    return {
        "currentPage": page,
        "totalPages": total_pages,
        "totalItems": total_items,
        "hasNext": page < total_pages,
        "hasPrev": page > 1
    }


# ============= USER CRUD =============

def get_user_by_email(db: Session, email: str) -> Optional[models.User]:
    """Get user by email."""
    return db.query(models.User).filter(models.User.email == email).first()

def get_user_by_id(db: Session, user_id: int) -> Optional[models.User]:
    """Get user by ID."""
    return db.query(models.User).filter(models.User.id == user_id).first()

def create_user(db: Session, user: schemas.UserCreate) -> models.User:
    """Create a new user with builder or customer profile."""
    # Hash password
    hashed_password = get_password_hash(user.password)
    
    # Create user
    db_user = models.User(
        email=user.email,
        password_hash=hashed_password,
        user_type=user.user_type
    )
    db.add(db_user)
    db.flush()  # Get the user ID without committing
    
    # Create builder or customer profile
    if user.user_type == models.UserType.BUILDER and user.builder_data:
        db_builder = models.Builder(
            user_id=db_user.id,
            **user.builder_data.dict()
        )
        db.add(db_builder)
    elif user.user_type == models.UserType.CUSTOMER and user.customer_data:
        db_customer = models.Customer(
            user_id=db_user.id,
            **user.customer_data.dict()
        )
        db.add(db_customer)
    
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user_last_login(db: Session, user_id: int) -> None:
    """Update user's last login timestamp."""
    db.query(models.User).filter(models.User.id == user_id).update({
        "last_login": datetime.utcnow()
    })
    db.commit()


# ============= BUILDER CRUD =============

def get_builder_by_id(db: Session, builder_id: int) -> Optional[models.Builder]:
    """Get builder by ID."""
    return db.query(models.Builder).filter(models.Builder.id == builder_id).first()

def get_builder_by_user_id(db: Session, user_id: int) -> Optional[models.Builder]:
    """Get builder by user ID."""
    return db.query(models.Builder).filter(models.Builder.user_id == user_id).first()

def update_builder(db: Session, builder_id: int, builder_update: schemas.BuilderUpdate) -> models.Builder:
    """Update builder profile."""
    db.query(models.Builder).filter(models.Builder.id == builder_id).update(
        builder_update.dict(exclude_unset=True)
    )
    db.commit()
    return get_builder_by_id(db, builder_id)


# ============= CUSTOMER CRUD =============

def get_customer_by_id(db: Session, customer_id: int) -> Optional[models.Customer]:
    """Get customer by ID."""
    return db.query(models.Customer).filter(models.Customer.id == customer_id).first()

def get_customer_by_user_id(db: Session, user_id: int) -> Optional[models.Customer]:
    """Get customer by user ID."""
    return db.query(models.Customer).filter(models.Customer.user_id == user_id).first()

def update_customer(db: Session, customer_id: int, customer_update: schemas.CustomerUpdate) -> models.Customer:
    """Update customer profile."""
    db.query(models.Customer).filter(models.Customer.id == customer_id).update(
        customer_update.dict(exclude_unset=True)
    )
    db.commit()
    return get_customer_by_id(db, customer_id)


# ============= PROJECT CRUD =============

def create_project(db: Session, project: schemas.ProjectCreate) -> models.Project:
    """Create a new project."""
    db_project = models.Project(**project.dict())
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

def get_project_by_id(db: Session, project_id: int) -> Optional[models.Project]:
    """Get project by ID with builder information."""
    return db.query(models.Project).options(
        joinedload(models.Project.builder)
    ).filter(models.Project.id == project_id).first()

def get_projects(
    db: Session,
    filters: schemas.ProjectFilter
) -> Dict[str, Any]:
    """Get projects with filtering and pagination."""
    query = db.query(models.Project).options(joinedload(models.Project.builder))
    
    # Apply filters
    if filters.status:
        query = query.filter(models.Project.status == filters.status)
    if filters.city:
        query = query.filter(models.Project.location_city.ilike(f"%{filters.city}%"))
    if filters.min_price:
        query = query.filter(models.Project.price_range_min >= filters.min_price)
    if filters.max_price:
        query = query.filter(models.Project.price_range_max <= filters.max_price)
    if filters.builder_id:
        query = query.filter(models.Project.builder_id == filters.builder_id)
    if filters.project_type:
        query = query.filter(models.Project.project_type == filters.project_type)
    
    # Get total count
    total_items = query.count()
    
    # Apply pagination
    offset = (filters.page - 1) * filters.limit
    projects = query.offset(offset).limit(filters.limit).all()
    
    return {
        "projects": projects,
        "pagination": create_pagination_metadata(filters.page, filters.limit, total_items)
    }

def get_project(db: Session, project_id: int) -> Optional[models.Project]:
    """Get a single project by ID."""
    return db.query(models.Project).options(joinedload(models.Project.builder)).filter(models.Project.id == project_id).first()

def update_project(db: Session, project_id: int, project_update: schemas.ProjectUpdate) -> models.Project:
    """Update project."""
    db.query(models.Project).filter(models.Project.id == project_id).update(
        project_update.dict(exclude_unset=True)
    )
    db.commit()
    return get_project(db, project_id)

def delete_project(db: Session, project_id: int) -> bool:
    """Delete a project."""
    project = get_project(db, project_id)
    if not project:
        return False
    db.delete(project)
    db.commit()
    return True

def get_projects_by_builder(db: Session, builder_id: int) -> List[models.Project]:
    """Get all projects by a specific builder."""
    return db.query(models.Project).filter(
        models.Project.builder_id == builder_id
    ).all()


# ============= UNIT CRUD =============

def create_unit(db: Session, unit: schemas.UnitCreate) -> models.Unit:
    """Create a new unit."""
    db_unit = models.Unit(**unit.dict())
    db.add(db_unit)
    db.commit()
    db.refresh(db_unit)
    return db_unit

def get_unit_by_id(db: Session, unit_id: int) -> Optional[models.Unit]:
    """Get unit by ID."""
    return db.query(models.Unit).filter(models.Unit.id == unit_id).first()

def get_units_by_project(db: Session, project_id: int) -> List[models.Unit]:
    """Get all units for a project."""
    return db.query(models.Unit).filter(
        models.Unit.project_id == project_id
    ).all()

def get_available_units_by_project(db: Session, project_id: int) -> List[models.Unit]:
    """Get available units for a project."""
    return db.query(models.Unit).filter(
        and_(
            models.Unit.project_id == project_id,
            models.Unit.status == models.UnitStatus.AVAILABLE
        )
    ).all()

def update_unit(db: Session, unit_id: int, unit_update: schemas.UnitUpdate) -> models.Unit:
    """Update unit."""
    db.query(models.Unit).filter(models.Unit.id == unit_id).update(
        unit_update.dict(exclude_unset=True)
    )
    db.commit()
    return get_unit_by_id(db, unit_id)

def update_unit_status(db: Session, unit_id: int, status: models.UnitStatus) -> models.Unit:
    """Update unit status."""
    db.query(models.Unit).filter(models.Unit.id == unit_id).update({"status": status})
    db.commit()
    return get_unit_by_id(db, unit_id)


# ============= BOOKING CRUD =============

def create_booking(db: Session, booking: schemas.BookingCreate) -> models.Booking:
    """Create a new booking."""
    db_booking = models.Booking(**booking.dict())
    db.add(db_booking)
    
    # Update unit status to booked
    db.query(models.Unit).filter(models.Unit.id == booking.unit_id).update({
        "status": models.UnitStatus.BOOKED
    })
    
    # Update project available units count
    unit = get_unit_by_id(db, booking.unit_id)
    if unit:
        db.query(models.Project).filter(models.Project.id == unit.project_id).update({
            "available_units": models.Project.available_units - 1
        })
    
    db.commit()
    db.refresh(db_booking)
    return db_booking

def get_booking_by_id(db: Session, booking_id: int) -> Optional[models.Booking]:
    """Get booking by ID with related data."""
    return db.query(models.Booking).options(
        joinedload(models.Booking.unit),
        joinedload(models.Booking.customer)
    ).filter(models.Booking.id == booking_id).first()

def get_bookings_by_customer(db: Session, customer_id: int) -> List[models.Booking]:
    """Get all bookings for a customer."""
    return db.query(models.Booking).options(
        joinedload(models.Booking.unit).joinedload(models.Unit.project)
    ).filter(models.Booking.customer_id == customer_id).all()

def get_bookings_by_unit(db: Session, unit_id: int) -> List[models.Booking]:
    """Get all bookings for a unit."""
    return db.query(models.Booking).filter(
        models.Booking.unit_id == unit_id
    ).all()

def update_booking(db: Session, booking_id: int, booking_update: schemas.BookingUpdate) -> models.Booking:
    """Update booking."""
    db.query(models.Booking).filter(models.Booking.id == booking_id).update(
        booking_update.dict(exclude_unset=True)
    )
    db.commit()
    return get_booking_by_id(db, booking_id)

def update_booking_status(db: Session, booking_id: int, status: models.BookingStatus) -> models.Booking:
    """Update booking status."""
    db.query(models.Booking).filter(models.Booking.id == booking_id).update({
        "booking_status": status
    })
    db.commit()
    return get_booking_by_id(db, booking_id)


# ============= PAYMENT CRUD =============

def create_payment(db: Session, payment: schemas.PaymentCreate) -> models.Payment:
    """Create a new payment."""
    db_payment = models.Payment(**payment.dict())
    db.add(db_payment)
    db.commit()
    db.refresh(db_payment)
    return db_payment

def get_payment_by_id(db: Session, payment_id: int) -> Optional[models.Payment]:
    """Get payment by ID."""
    return db.query(models.Payment).filter(models.Payment.id == payment_id).first()

def get_payments_by_booking(db: Session, booking_id: int) -> List[models.Payment]:
    """Get all payments for a booking."""
    return db.query(models.Payment).filter(
        models.Payment.booking_id == booking_id
    ).order_by(models.Payment.due_date).all()

def get_pending_payments_by_customer(db: Session, customer_id: int) -> List[models.Payment]:
    """Get all pending payments for a customer."""
    return db.query(models.Payment).join(models.Booking).filter(
        and_(
            models.Booking.customer_id == customer_id,
            models.Payment.payment_status == models.PaymentStatus.PENDING
        )
    ).all()

def update_payment(db: Session, payment_id: int, payment_update: schemas.PaymentUpdate) -> models.Payment:
    """Update payment."""
    db.query(models.Payment).filter(models.Payment.id == payment_id).update(
        payment_update.dict(exclude_unset=True)
    )
    db.commit()
    return get_payment_by_id(db, payment_id)


# ============= APPOINTMENT CRUD =============

def create_appointment(db: Session, appointment: schemas.AppointmentCreate) -> models.Appointment:
    """Create a new appointment."""
    db_appointment = models.Appointment(**appointment.dict())
    db.add(db_appointment)
    db.commit()
    db.refresh(db_appointment)
    return db_appointment

def get_appointment_by_id(db: Session, appointment_id: int) -> Optional[models.Appointment]:
    """Get appointment by ID."""
    return db.query(models.Appointment).options(
        joinedload(models.Appointment.project),
        joinedload(models.Appointment.customer)
    ).filter(models.Appointment.id == appointment_id).first()

def get_appointments_by_customer(db: Session, customer_id: int) -> List[models.Appointment]:
    """Get all appointments for a customer."""
    return db.query(models.Appointment).options(
        joinedload(models.Appointment.project)
    ).filter(models.Appointment.customer_id == customer_id).order_by(
        desc(models.Appointment.appointment_date)
    ).all()

def get_appointments_by_project(db: Session, project_id: int) -> List[models.Appointment]:
    """Get all appointments for a project."""
    return db.query(models.Appointment).options(
        joinedload(models.Appointment.customer)
    ).filter(models.Appointment.project_id == project_id).order_by(
        desc(models.Appointment.appointment_date)
    ).all()

def update_appointment(db: Session, appointment_id: int, appointment_update: schemas.AppointmentUpdate) -> models.Appointment:
    """Update appointment."""
    db.query(models.Appointment).filter(models.Appointment.id == appointment_id).update(
        appointment_update.dict(exclude_unset=True)
    )
    db.commit()
    return get_appointment_by_id(db, appointment_id)


# ============= PROJECT PROGRESS CRUD =============

def create_project_progress(db: Session, progress: schemas.ProjectProgressCreate) -> models.ProjectProgress:
    """Create a new project progress phase."""
    db_progress = models.ProjectProgress(**progress.dict())
    db.add(db_progress)
    db.commit()
    db.refresh(db_progress)
    return db_progress

def get_project_progress_by_id(db: Session, progress_id: int) -> Optional[models.ProjectProgress]:
    """Get project progress by ID."""
    return db.query(models.ProjectProgress).filter(
        models.ProjectProgress.id == progress_id
    ).first()

def get_progress_by_project(db: Session, project_id: int) -> List[models.ProjectProgress]:
    """Get all progress phases for a project."""
    return db.query(models.ProjectProgress).filter(
        models.ProjectProgress.project_id == project_id
    ).order_by(models.ProjectProgress.start_date).all()

def update_project_progress(db: Session, progress_id: int, progress_update: schemas.ProjectProgressUpdate) -> models.ProjectProgress:
    """Update project progress."""
    db.query(models.ProjectProgress).filter(models.ProjectProgress.id == progress_id).update(
        progress_update.dict(exclude_unset=True)
    )
    db.commit()
    return get_project_progress_by_id(db, progress_id)


# ============= CONSTRUCTION UPDATE CRUD =============

def create_construction_update(db: Session, update: schemas.ConstructionUpdateCreate) -> models.ConstructionUpdate:
    """Create a new construction update."""
    db_update = models.ConstructionUpdate(**update.dict())
    db.add(db_update)
    db.commit()
    db.refresh(db_update)
    return db_update

def get_construction_update_by_id(db: Session, update_id: int) -> Optional[models.ConstructionUpdate]:
    """Get construction update by ID."""
    return db.query(models.ConstructionUpdate).filter(
        models.ConstructionUpdate.id == update_id
    ).first()

def get_updates_by_project(db: Session, project_id: int, limit: int = 10) -> List[models.ConstructionUpdate]:
    """Get recent construction updates for a project."""
    return db.query(models.ConstructionUpdate).filter(
        and_(
            models.ConstructionUpdate.project_id == project_id,
            models.ConstructionUpdate.is_published == True
        )
    ).order_by(desc(models.ConstructionUpdate.created_at)).limit(limit).all()


# ============= MESSAGE CRUD =============

def create_message(db: Session, message: schemas.MessageCreate) -> models.Message:
    """Create a new message."""
    db_message = models.Message(**message.dict())
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message

def get_message_by_id(db: Session, message_id: int) -> Optional[models.Message]:
    """Get message by ID."""
    return db.query(models.Message).filter(models.Message.id == message_id).first()

def get_messages_for_user(db: Session, user_id: int) -> List[models.Message]:
    """Get all messages for a user (sent or received)."""
    return db.query(models.Message).filter(
        or_(
            models.Message.sender_id == user_id,
            models.Message.recipient_id == user_id
        )
    ).order_by(desc(models.Message.created_at)).all()

def get_conversations(db: Session, user_id: int) -> List[Dict[str, Any]]:
    """Get all conversations for a user."""
    # This is a simplified version; you might want to group by conversation
    messages = db.query(models.Message).options(
        joinedload(models.Message.sender),
        joinedload(models.Message.recipient)
    ).filter(
        or_(
            models.Message.sender_id == user_id,
            models.Message.recipient_id == user_id
        )
    ).order_by(desc(models.Message.created_at)).all()
    
    return messages

def mark_message_as_read(db: Session, message_id: int) -> models.Message:
    """Mark a message as read."""
    db.query(models.Message).filter(models.Message.id == message_id).update({
        "is_read": True,
        "read_at": datetime.utcnow()
    })
    db.commit()
    return get_message_by_id(db, message_id)


# ============= CHANGE REQUEST CRUD =============

def create_change_request(db: Session, change_request: schemas.ChangeRequestCreate) -> models.ChangeRequest:
    """Create a new change request."""
    db_change_request = models.ChangeRequest(**change_request.dict())
    db.add(db_change_request)
    db.commit()
    db.refresh(db_change_request)
    return db_change_request

def get_change_request_by_id(db: Session, request_id: int) -> Optional[models.ChangeRequest]:
    """Get change request by ID."""
    return db.query(models.ChangeRequest).options(
        joinedload(models.ChangeRequest.booking)
    ).filter(models.ChangeRequest.id == request_id).first()

def get_change_requests_by_booking(db: Session, booking_id: int) -> List[models.ChangeRequest]:
    """Get all change requests for a booking."""
    return db.query(models.ChangeRequest).filter(
        models.ChangeRequest.booking_id == booking_id
    ).order_by(desc(models.ChangeRequest.created_at)).all()

def update_change_request(db: Session, request_id: int, request_update: schemas.ChangeRequestUpdate) -> models.ChangeRequest:
    """Update change request."""
    db.query(models.ChangeRequest).filter(models.ChangeRequest.id == request_id).update(
        request_update.dict(exclude_unset=True)
    )
    db.commit()
    return get_change_request_by_id(db, request_id)


# ============= 3D MODEL CRUD =============

def create_3d_model(db: Session, model: schemas.Model3DCreate) -> models.Model3D:
    """Create a new 3D model."""
    db_model = models.Model3D(**model.dict())
    db.add(db_model)
    db.commit()
    db.refresh(db_model)
    return db_model

def get_3d_model_by_id(db: Session, model_id: int) -> Optional[models.Model3D]:
    """Get 3D model by ID."""
    return db.query(models.Model3D).filter(models.Model3D.id == model_id).first()

def get_models_by_project(db: Session, project_id: int) -> List[models.Model3D]:
    """Get all 3D models for a project."""
    return db.query(models.Model3D).filter(
        models.Model3D.project_id == project_id
    ).all()

def get_models_by_unit(db: Session, unit_id: int) -> List[models.Model3D]:
    """Get all 3D models for a unit."""
    return db.query(models.Model3D).filter(
        models.Model3D.unit_id == unit_id
    ).all()


# ============= NOTIFICATION CRUD =============

def create_notification(db: Session, notification: schemas.NotificationCreate) -> models.Notification:
    """Create a new notification."""
    db_notification = models.Notification(**notification.dict())
    db.add(db_notification)
    db.commit()
    db.refresh(db_notification)
    return db_notification

def get_notification_by_id(db: Session, notification_id: int) -> Optional[models.Notification]:
    """Get notification by ID."""
    return db.query(models.Notification).filter(
        models.Notification.id == notification_id
    ).first()

def get_notifications_for_user(
    db: Session,
    user_id: int,
    filters: schemas.NotificationFilter
) -> Dict[str, Any]:
    """Get notifications for a user with filtering and pagination."""
    query = db.query(models.Notification).filter(models.Notification.user_id == user_id)
    
    # Apply filters
    if filters.is_read is not None:
        query = query.filter(models.Notification.is_read == filters.is_read)
    if filters.notification_type:
        query = query.filter(models.Notification.notification_type == filters.notification_type)
    
    # Get total count
    total_items = query.count()
    unread_count = db.query(models.Notification).filter(
        and_(
            models.Notification.user_id == user_id,
            models.Notification.is_read == False
        )
    ).count()
    
    # Apply pagination
    offset = (filters.page - 1) * filters.limit
    notifications = query.order_by(
        desc(models.Notification.created_at)
    ).offset(offset).limit(filters.limit).all()
    
    return {
        "notifications": notifications,
        "unreadCount": unread_count,
        "pagination": create_pagination_metadata(filters.page, filters.limit, total_items)
    }

def mark_notification_as_read(db: Session, notification_id: int) -> models.Notification:
    """Mark a notification as read."""
    db.query(models.Notification).filter(models.Notification.id == notification_id).update({
        "is_read": True,
        "read_at": datetime.utcnow()
    })
    db.commit()
    return get_notification_by_id(db, notification_id)

def mark_all_notifications_as_read(db: Session, user_id: int) -> None:
    """Mark all notifications for a user as read."""
    db.query(models.Notification).filter(
        and_(
            models.Notification.user_id == user_id,
            models.Notification.is_read == False
        )
    ).update({
        "is_read": True,
        "read_at": datetime.utcnow()
    })
    db.commit()


# ============= SYSTEM SETTINGS CRUD =============

def create_system_setting(db: Session, setting: schemas.SystemSettingCreate) -> models.SystemSetting:
    """Create a new system setting."""
    db_setting = models.SystemSetting(**setting.dict())
    db.add(db_setting)
    db.commit()
    db.refresh(db_setting)
    return db_setting

def get_system_setting_by_key(db: Session, setting_key: str) -> Optional[models.SystemSetting]:
    """Get system setting by key."""
    return db.query(models.SystemSetting).filter(
        models.SystemSetting.setting_key == setting_key
    ).first()

def get_public_settings(db: Session) -> List[models.SystemSetting]:
    """Get all public system settings."""
    return db.query(models.SystemSetting).filter(
        models.SystemSetting.is_public == True
    ).all()
