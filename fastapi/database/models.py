from sqlalchemy import (
    Column, Integer, String, Boolean, DateTime, Date, 
    ForeignKey, Text, Numeric, Enum, BigInteger, JSON
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database.database import Base
import enum


# ============= ENUMS =============

class UserType(str, enum.Enum):
    BUILDER = "builder"
    CUSTOMER = "customer"

class ProjectType(str, enum.Enum):
    RESIDENTIAL = "residential"
    COMMERCIAL = "commercial"
    MIXED = "mixed"

class ProjectStatus(str, enum.Enum):
    PLANNING = "planning"
    CONSTRUCTION = "construction"
    COMPLETED = "completed"
    DELIVERED = "delivered"

class UnitType(str, enum.Enum):
    ONE_BHK = "1BHK"
    TWO_BHK = "2BHK"
    THREE_BHK = "3BHK"
    FOUR_BHK_PLUS = "4BHK+"
    STUDIO = "studio"
    PENTHOUSE = "penthouse"

class UnitStatus(str, enum.Enum):
    AVAILABLE = "available"
    BOOKED = "booked"
    SOLD = "sold"
    RESERVED = "reserved"

class FacingDirection(str, enum.Enum):
    NORTH = "north"
    SOUTH = "south"
    EAST = "east"
    WEST = "west"
    NORTHEAST = "northeast"
    NORTHWEST = "northwest"
    SOUTHEAST = "southeast"
    SOUTHWEST = "southwest"

class BookingStatus(str, enum.Enum):
    INQUIRY = "inquiry"
    SITE_VISIT_SCHEDULED = "site_visit_scheduled"
    TOKEN_PAID = "token_paid"
    BOOKING_CONFIRMED = "booking_confirmed"
    CANCELLED = "cancelled"

class PaymentPlan(str, enum.Enum):
    FULL_PAYMENT = "full_payment"
    INSTALLMENTS = "installments"
    LOAN = "loan"

class PaymentType(str, enum.Enum):
    TOKEN = "token"
    INSTALLMENT = "installment"
    FINAL = "final"
    MAINTENANCE = "maintenance"
    PENALTY = "penalty"

class PaymentMethod(str, enum.Enum):
    CASH = "cash"
    CHEQUE = "cheque"
    BANK_TRANSFER = "bank_transfer"
    ONLINE = "online"
    LOAN = "loan"

class PaymentStatus(str, enum.Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
    REFUNDED = "refunded"

class AppointmentType(str, enum.Enum):
    SITE_VISIT = "site_visit"
    CONSULTATION = "consultation"
    DOCUMENTATION = "documentation"
    HANDOVER = "handover"

class AppointmentStatus(str, enum.Enum):
    SCHEDULED = "scheduled"
    CONFIRMED = "confirmed"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    RESCHEDULED = "rescheduled"

class MeetingLocation(str, enum.Enum):
    SITE = "site"
    OFFICE = "office"
    ONLINE = "online"

class ProgressStatus(str, enum.Enum):
    NOT_STARTED = "not_started"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    DELAYED = "delayed"

class UpdateType(str, enum.Enum):
    MILESTONE = "milestone"
    DELAY = "delay"
    GENERAL = "general"
    SAFETY = "safety"
    QUALITY = "quality"

class Priority(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class MessageType(str, enum.Enum):
    INQUIRY = "inquiry"
    COMPLAINT = "complaint"
    UPDATE = "update"
    GENERAL = "general"

class ChangeRequestType(str, enum.Enum):
    LAYOUT = "layout"
    FIXTURES = "fixtures"
    FINISHES = "finishes"
    ELECTRICAL = "electrical"
    PLUMBING = "plumbing"
    OTHER = "other"

class ChangeRequestStatus(str, enum.Enum):
    SUBMITTED = "submitted"
    UNDER_REVIEW = "under_review"
    APPROVED = "approved"
    REJECTED = "rejected"
    COMPLETED = "completed"

class ModelType(str, enum.Enum):
    PROJECT_OVERVIEW = "project_overview"
    UNIT_INTERIOR = "unit_interior"
    FLOOR_PLAN = "floor_plan"
    AMENITIES = "amenities"

class FileFormat(str, enum.Enum):
    OBJ = "obj"
    FBX = "fbx"
    GLTF = "gltf"
    GLB = "glb"
    BLEND = "blend"

class AccessLevel(str, enum.Enum):
    PUBLIC = "public"
    CUSTOMERS_ONLY = "customers_only"
    BOOKED_CUSTOMERS = "booked_customers"

class NotificationType(str, enum.Enum):
    BOOKING_UPDATE = "booking_update"
    PAYMENT_DUE = "payment_due"
    APPOINTMENT_REMINDER = "appointment_reminder"
    PROGRESS_UPDATE = "progress_update"
    MESSAGE_RECEIVED = "message_received"
    CHANGE_REQUEST_UPDATE = "change_request_update"

class PreferredContactMethod(str, enum.Enum):
    EMAIL = "email"
    PHONE = "phone"
    BOTH = "both"


# ============= MODELS =============

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    user_type = Column(Enum(UserType), nullable=False, index=True)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    last_login = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    builder = relationship("Builder", back_populates="user", uselist=False, cascade="all, delete-orphan")
    customer = relationship("Customer", back_populates="user", uselist=False, cascade="all, delete-orphan")
    sent_messages = relationship("Message", foreign_keys="Message.sender_id", back_populates="sender")
    received_messages = relationship("Message", foreign_keys="Message.recipient_id", back_populates="recipient")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")


class Builder(Base):
    __tablename__ = "builders"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    company_name = Column(String(255), nullable=False)
    license_number = Column(String(100), unique=True, nullable=False, index=True)
    phone = Column(String(20), nullable=False)
    address = Column(Text, nullable=False)
    website = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
    logo_url = Column(String(500), nullable=True)
    rating = Column(Numeric(3, 2), default=0.00, index=True)
    total_projects = Column(Integer, default=0)
    verified = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="builder")
    projects = relationship("Project", back_populates="builder", cascade="all, delete-orphan")


class Customer(Base):
    __tablename__ = "customers"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    first_name = Column(String(100), nullable=False, index=True)
    last_name = Column(String(100), nullable=False, index=True)
    phone = Column(String(20), nullable=False)
    address = Column(Text, nullable=True)
    date_of_birth = Column(Date, nullable=True)
    preferred_contact_method = Column(Enum(PreferredContactMethod), default=PreferredContactMethod.EMAIL)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="customer")
    bookings = relationship("Booking", back_populates="customer", cascade="all, delete-orphan")
    appointments = relationship("Appointment", back_populates="customer", cascade="all, delete-orphan")


class Project(Base):
    __tablename__ = "projects"
    
    id = Column(Integer, primary_key=True, index=True)
    builder_id = Column(Integer, ForeignKey("builders.id", ondelete="CASCADE"), nullable=False, index=True)
    project_name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    project_type = Column(Enum(ProjectType), nullable=False)
    status = Column(Enum(ProjectStatus), default=ProjectStatus.PLANNING, index=True)
    location_address = Column(Text, nullable=False)
    location_city = Column(String(100), nullable=False, index=True)
    location_state = Column(String(100), nullable=False, index=True)
    location_zipcode = Column(String(20), nullable=False)
    latitude = Column(Numeric(10, 8), nullable=True)
    longitude = Column(Numeric(11, 8), nullable=True)
    total_units = Column(Integer, nullable=False)
    available_units = Column(Integer, nullable=False)
    price_range_min = Column(Numeric(15, 2), nullable=True, index=True)
    price_range_max = Column(Numeric(15, 2), nullable=True, index=True)
    project_area = Column(Numeric(10, 2), nullable=True)
    amenities = Column(JSON, nullable=True)
    start_date = Column(Date, nullable=True)
    expected_completion_date = Column(Date, nullable=True)
    actual_completion_date = Column(Date, nullable=True)
    images = Column(JSON, nullable=True)
    floor_plans = Column(JSON, nullable=True)
    brochure_url = Column(String(500), nullable=True)
    is_featured = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    builder = relationship("Builder", back_populates="projects")
    units = relationship("Unit", back_populates="project", cascade="all, delete-orphan")
    appointments = relationship("Appointment", back_populates="project", cascade="all, delete-orphan")
    progress = relationship("ProjectProgress", back_populates="project", cascade="all, delete-orphan")
    updates = relationship("ConstructionUpdate", back_populates="project", cascade="all, delete-orphan")
    messages = relationship("Message", back_populates="project")
    models_3d = relationship("Model3D", back_populates="project", cascade="all, delete-orphan")


class Unit(Base):
    __tablename__ = "units"
    
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    unit_number = Column(String(50), nullable=False)
    unit_type = Column(Enum(UnitType), nullable=False, index=True)
    floor_number = Column(Integer, nullable=False)
    area_sqft = Column(Numeric(8, 2), nullable=False)
    price = Column(Numeric(15, 2), nullable=False, index=True)
    status = Column(Enum(UnitStatus), default=UnitStatus.AVAILABLE, index=True)
    facing = Column(Enum(FacingDirection), nullable=True)
    balconies = Column(Integer, default=0)
    bathrooms = Column(Integer, nullable=False)
    parking_spaces = Column(Integer, default=0)
    floor_plan_url = Column(String(500), nullable=True)
    features = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    project = relationship("Project", back_populates="units")
    bookings = relationship("Booking", back_populates="unit", cascade="all, delete-orphan")
    models_3d = relationship("Model3D", back_populates="unit", cascade="all, delete-orphan")


class Booking(Base):
    __tablename__ = "bookings"
    
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id", ondelete="CASCADE"), nullable=False, index=True)
    unit_id = Column(Integer, ForeignKey("units.id", ondelete="CASCADE"), nullable=False, index=True)
    booking_status = Column(Enum(BookingStatus), default=BookingStatus.INQUIRY, index=True)
    token_amount = Column(Numeric(15, 2), nullable=True)
    total_amount = Column(Numeric(15, 2), nullable=False)
    booking_date = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    expected_registration_date = Column(Date, nullable=True)
    actual_registration_date = Column(Date, nullable=True)
    payment_plan = Column(Enum(PaymentPlan), default=PaymentPlan.INSTALLMENTS)
    loan_approved = Column(Boolean, default=False)
    loan_amount = Column(Numeric(15, 2), nullable=True)
    special_requests = Column(Text, nullable=True)
    agent_id = Column(Integer, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    customer = relationship("Customer", back_populates="bookings")
    unit = relationship("Unit", back_populates="bookings")
    payments = relationship("Payment", back_populates="booking", cascade="all, delete-orphan")
    change_requests = relationship("ChangeRequest", back_populates="booking", cascade="all, delete-orphan")
    messages = relationship("Message", back_populates="booking")


class Payment(Base):
    __tablename__ = "payments"
    
    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id", ondelete="CASCADE"), nullable=False, index=True)
    payment_type = Column(Enum(PaymentType), nullable=False, index=True)
    amount = Column(Numeric(15, 2), nullable=False)
    payment_method = Column(Enum(PaymentMethod), nullable=False)
    payment_status = Column(Enum(PaymentStatus), default=PaymentStatus.PENDING, index=True)
    transaction_id = Column(String(255), nullable=True)
    due_date = Column(Date, nullable=True, index=True)
    paid_date = Column(DateTime(timezone=True), nullable=True)
    receipt_url = Column(String(500), nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    booking = relationship("Booking", back_populates="payments")


class Appointment(Base):
    __tablename__ = "appointments"
    
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id", ondelete="CASCADE"), nullable=False, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    appointment_type = Column(Enum(AppointmentType), nullable=False)
    appointment_date = Column(DateTime(timezone=True), nullable=False, index=True)
    duration_minutes = Column(Integer, default=60)
    status = Column(Enum(AppointmentStatus), default=AppointmentStatus.SCHEDULED, index=True)
    meeting_location = Column(Enum(MeetingLocation), default=MeetingLocation.SITE)
    attendees = Column(JSON, nullable=True)
    agenda = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    reschedule_reason = Column(Text, nullable=True)
    created_by = Column(Enum(UserType), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    customer = relationship("Customer", back_populates="appointments")
    project = relationship("Project", back_populates="appointments")


class ProjectProgress(Base):
    __tablename__ = "project_progress"
    
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    phase_name = Column(String(255), nullable=False, index=True)
    phase_description = Column(Text, nullable=True)
    start_date = Column(Date, nullable=True)
    expected_end_date = Column(Date, nullable=True)
    actual_end_date = Column(Date, nullable=True)
    progress_percentage = Column(Numeric(5, 2), default=0.00)
    status = Column(Enum(ProgressStatus), default=ProgressStatus.NOT_STARTED, index=True)
    milestone_images = Column(JSON, nullable=True)
    contractor_notes = Column(Text, nullable=True)
    customer_visible = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    project = relationship("Project", back_populates="progress")


class ConstructionUpdate(Base):
    __tablename__ = "construction_updates"
    
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    update_title = Column(String(255), nullable=False)
    update_content = Column(Text, nullable=False)
    update_type = Column(Enum(UpdateType), nullable=False, index=True)
    priority = Column(Enum(Priority), default=Priority.MEDIUM, index=True)
    images = Column(JSON, nullable=True)
    videos = Column(JSON, nullable=True)
    weather_impact = Column(Boolean, default=False)
    estimated_delay_days = Column(Integer, nullable=True)
    posted_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    is_published = Column(Boolean, default=True)
    tags = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    
    # Relationships
    project = relationship("Project", back_populates="updates")
    poster = relationship("User")


class Message(Base):
    __tablename__ = "messages"
    
    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    recipient_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="SET NULL"), nullable=True, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id", ondelete="SET NULL"), nullable=True)
    subject = Column(String(255), nullable=True)
    message_content = Column(Text, nullable=False)
    message_type = Column(Enum(MessageType), default=MessageType.GENERAL)
    priority = Column(Enum(Priority), default=Priority.MEDIUM)
    is_read = Column(Boolean, default=False, index=True)
    attachments = Column(JSON, nullable=True)
    parent_message_id = Column(Integer, ForeignKey("messages.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    read_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    sender = relationship("User", foreign_keys=[sender_id], back_populates="sent_messages")
    recipient = relationship("User", foreign_keys=[recipient_id], back_populates="received_messages")
    project = relationship("Project", back_populates="messages")
    booking = relationship("Booking", back_populates="messages")
    parent_message = relationship("Message", remote_side=[id])


class ChangeRequest(Base):
    __tablename__ = "change_requests"
    
    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id", ondelete="CASCADE"), nullable=False, index=True)
    request_type = Column(Enum(ChangeRequestType), nullable=False, index=True)
    request_title = Column(String(255), nullable=False)
    request_description = Column(Text, nullable=False)
    current_specification = Column(Text, nullable=True)
    requested_specification = Column(Text, nullable=True)
    estimated_cost = Column(Numeric(15, 2), nullable=True)
    estimated_timeline_days = Column(Integer, nullable=True)
    status = Column(Enum(ChangeRequestStatus), default=ChangeRequestStatus.SUBMITTED, index=True)
    builder_response = Column(Text, nullable=True)
    rejection_reason = Column(Text, nullable=True)
    approval_date = Column(DateTime(timezone=True), nullable=True)
    completion_date = Column(DateTime(timezone=True), nullable=True)
    final_cost = Column(Numeric(15, 2), nullable=True)
    attachments = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    booking = relationship("Booking", back_populates="change_requests")


class Model3D(Base):
    __tablename__ = "models_3d"
    
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=True, index=True)
    unit_id = Column(Integer, ForeignKey("units.id", ondelete="CASCADE"), nullable=True, index=True)
    model_name = Column(String(255), nullable=False)
    model_description = Column(Text, nullable=True)
    model_type = Column(Enum(ModelType), nullable=False, index=True)
    file_url = Column(String(500), nullable=False)
    file_size = Column(BigInteger, nullable=True)
    file_format = Column(Enum(FileFormat), nullable=False)
    thumbnail_url = Column(String(500), nullable=True)
    is_interactive = Column(Boolean, default=False)
    viewer_config = Column(JSON, nullable=True)
    access_level = Column(Enum(AccessLevel), default=AccessLevel.PUBLIC)
    version = Column(String(50), default="1.0")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    project = relationship("Project", back_populates="models_3d")
    unit = relationship("Unit", back_populates="models_3d")


class Notification(Base):
    __tablename__ = "notifications"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    notification_type = Column(Enum(NotificationType), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    related_entity_type = Column(String(50), nullable=True)
    related_entity_id = Column(Integer, nullable=True)
    priority = Column(Enum(Priority), default=Priority.MEDIUM)
    is_read = Column(Boolean, default=False, index=True)
    is_sent = Column(Boolean, default=False)
    send_via = Column(JSON, nullable=True)
    scheduled_send_time = Column(DateTime(timezone=True), nullable=True)
    sent_at = Column(DateTime(timezone=True), nullable=True)
    read_at = Column(DateTime(timezone=True), nullable=True)
    action_url = Column(String(500), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    
    # Relationships
    user = relationship("User", back_populates="notifications")


class SystemSetting(Base):
    __tablename__ = "system_settings"
    
    id = Column(Integer, primary_key=True, index=True)
    setting_key = Column(String(255), unique=True, nullable=False)
    setting_value = Column(JSON, nullable=False)
    setting_type = Column(String(50), nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String(100), nullable=True, index=True)
    is_public = Column(Boolean, default=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
