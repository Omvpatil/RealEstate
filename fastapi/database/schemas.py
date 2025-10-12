from typing import List, Optional, Dict, Any
from pydantic import BaseModel, EmailStr, Field, validator
from datetime import datetime, date
from decimal import Decimal
from database.models import (
    UserType, ProjectType, ProjectStatus, UnitType, UnitStatus, 
    FacingDirection, BookingStatus, PaymentPlan, PaymentType, 
    PaymentMethod, PaymentStatus, AppointmentType, AppointmentStatus,
    MeetingLocation, ProgressStatus, UpdateType, Priority, MessageType,
    ChangeRequestType, ChangeRequestStatus, ModelType, FileFormat,
    AccessLevel, NotificationType, PreferredContactMethod
)


# ============= USER SCHEMAS =============

class UserBase(BaseModel):
    email: EmailStr
    user_type: UserType

class UserCreate(UserBase):
    password: str
    builder_data: Optional['BuilderCreate'] = None
    customer_data: Optional['CustomerCreate'] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str
    user_type: UserType

class UserResponse(UserBase):
    id: int
    is_active: bool
    is_verified: bool
    created_at: datetime
    last_login: Optional[datetime] = None
    builder_id: Optional[int] = None  # Include builder_id if user is a builder
    customer_id: Optional[int] = None  # Include customer_id if user is a customer
    
    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int
    user: UserResponse


# ============= BUILDER SCHEMAS =============

class BuilderBase(BaseModel):
    company_name: str
    license_number: str
    phone: str
    address: str
    website: Optional[str] = None
    description: Optional[str] = None
    logo_url: Optional[str] = None

class BuilderCreate(BuilderBase):
    pass

class BuilderUpdate(BaseModel):
    company_name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    website: Optional[str] = None
    description: Optional[str] = None
    logo_url: Optional[str] = None

class BuilderResponse(BuilderBase):
    id: int
    user_id: int
    rating: Decimal
    total_projects: int
    verified: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


# ============= CUSTOMER SCHEMAS =============

class CustomerBase(BaseModel):
    first_name: str
    last_name: str
    phone: str
    address: Optional[str] = None
    date_of_birth: Optional[date] = None
    preferred_contact_method: PreferredContactMethod = PreferredContactMethod.EMAIL

class CustomerCreate(CustomerBase):
    pass

class CustomerUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    date_of_birth: Optional[date] = None
    preferred_contact_method: Optional[PreferredContactMethod] = None

class CustomerResponse(CustomerBase):
    id: int
    user_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


# ============= PROJECT SCHEMAS =============

class ProjectBase(BaseModel):
    project_name: str
    description: Optional[str] = None
    project_type: ProjectType
    status: ProjectStatus = ProjectStatus.PLANNING
    location_address: str
    location_city: str
    location_state: str
    location_zipcode: str
    latitude: Optional[Decimal] = None
    longitude: Optional[Decimal] = None
    total_units: int
    available_units: int
    price_range_min: Optional[Decimal] = None
    price_range_max: Optional[Decimal] = None
    project_area: Optional[Decimal] = None
    amenities: Optional[List[str]] = None
    start_date: Optional[date] = None
    expected_completion_date: Optional[date] = None
    images: Optional[List[str]] = None
    floor_plans: Optional[List[str]] = None
    brochure_url: Optional[str] = None
    is_featured: bool = False

class ProjectCreate(ProjectBase):
    builder_id: int

class ProjectUpdate(BaseModel):
    project_name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[ProjectStatus] = None
    available_units: Optional[int] = None
    price_range_min: Optional[Decimal] = None
    price_range_max: Optional[Decimal] = None
    amenities: Optional[List[str]] = None
    expected_completion_date: Optional[date] = None
    actual_completion_date: Optional[date] = None
    images: Optional[List[str]] = None
    floor_plans: Optional[List[str]] = None
    is_featured: Optional[bool] = None

class ProjectResponse(ProjectBase):
    id: int
    builder_id: int
    actual_completion_date: Optional[date] = None
    created_at: datetime
    builder: Optional[BuilderResponse] = None
    
    class Config:
        from_attributes = True

class ProjectListResponse(BaseModel):
    projects: List[ProjectResponse]
    pagination: Dict[str, Any]


# ============= UNIT SCHEMAS =============

class UnitBase(BaseModel):
    unit_number: str
    unit_type: UnitType
    floor_number: int
    area_sqft: Decimal
    price: Decimal
    status: UnitStatus = UnitStatus.AVAILABLE
    facing: Optional[FacingDirection] = None
    balconies: int = 0
    bathrooms: int
    parking_spaces: int = 0
    floor_plan_url: Optional[str] = None
    features: Optional[List[str]] = None

class UnitCreate(UnitBase):
    project_id: int

class UnitUpdate(BaseModel):
    price: Optional[Decimal] = None
    status: Optional[UnitStatus] = None
    floor_plan_url: Optional[str] = None
    features: Optional[List[str]] = None

class UnitResponse(UnitBase):
    id: int
    project_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


# ============= BOOKING SCHEMAS =============

class BookingBase(BaseModel):
    unit_id: int
    token_amount: Optional[Decimal] = None
    total_amount: Decimal
    expected_registration_date: Optional[date] = None
    payment_plan: PaymentPlan = PaymentPlan.INSTALLMENTS
    loan_amount: Optional[Decimal] = None
    special_requests: Optional[str] = None

class BookingCreate(BookingBase):
    customer_id: int

class BookingUpdate(BaseModel):
    booking_status: Optional[BookingStatus] = None
    expected_registration_date: Optional[date] = None
    actual_registration_date: Optional[date] = None
    loan_approved: Optional[bool] = None
    loan_amount: Optional[Decimal] = None

class BookingResponse(BookingBase):
    id: int
    customer_id: int
    booking_status: BookingStatus
    booking_date: datetime
    actual_registration_date: Optional[date] = None
    loan_approved: bool
    agent_id: Optional[int] = None
    created_at: datetime
    unit: Optional[UnitResponse] = None
    
    class Config:
        from_attributes = True


# ============= PAYMENT SCHEMAS =============

class PaymentBase(BaseModel):
    payment_type: PaymentType
    amount: Decimal
    payment_method: PaymentMethod
    due_date: Optional[date] = None
    notes: Optional[str] = None

class PaymentCreate(PaymentBase):
    booking_id: int

class PaymentUpdate(BaseModel):
    payment_status: Optional[PaymentStatus] = None
    transaction_id: Optional[str] = None
    paid_date: Optional[datetime] = None
    receipt_url: Optional[str] = None

class PaymentResponse(PaymentBase):
    id: int
    booking_id: int
    payment_status: PaymentStatus
    transaction_id: Optional[str] = None
    paid_date: Optional[datetime] = None
    receipt_url: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


# ============= APPOINTMENT SCHEMAS =============

class AppointmentBase(BaseModel):
    project_id: int
    appointment_type: AppointmentType
    appointment_date: datetime
    duration_minutes: int = 60
    meeting_location: MeetingLocation = MeetingLocation.SITE
    agenda: Optional[str] = None

class AppointmentCreate(AppointmentBase):
    customer_id: int
    created_by: UserType

class AppointmentUpdate(BaseModel):
    appointment_date: Optional[datetime] = None
    status: Optional[AppointmentStatus] = None
    notes: Optional[str] = None
    reschedule_reason: Optional[str] = None

class AppointmentResponse(AppointmentBase):
    id: int
    customer_id: int
    status: AppointmentStatus
    attendees: Optional[List[str]] = None
    notes: Optional[str] = None
    reschedule_reason: Optional[str] = None
    created_by: UserType
    created_at: datetime
    
    class Config:
        from_attributes = True


# ============= PROGRESS SCHEMAS =============

class ProjectProgressBase(BaseModel):
    phase_name: str
    phase_description: Optional[str] = None
    start_date: Optional[date] = None
    expected_end_date: Optional[date] = None
    progress_percentage: Decimal = Decimal('0.00')
    status: ProgressStatus = ProgressStatus.NOT_STARTED
    milestone_images: Optional[List[str]] = None
    contractor_notes: Optional[str] = None
    customer_visible: bool = True

class ProjectProgressCreate(ProjectProgressBase):
    project_id: int

class ProjectProgressUpdate(BaseModel):
    progress_percentage: Optional[Decimal] = None
    status: Optional[ProgressStatus] = None
    actual_end_date: Optional[date] = None
    milestone_images: Optional[List[str]] = None
    contractor_notes: Optional[str] = None
    customer_visible: Optional[bool] = None

class ProjectProgressResponse(ProjectProgressBase):
    id: int
    project_id: int
    actual_end_date: Optional[date] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


# ============= CONSTRUCTION UPDATE SCHEMAS =============

class ConstructionUpdateBase(BaseModel):
    update_title: str
    update_content: str
    update_type: UpdateType
    priority: Priority = Priority.MEDIUM
    images: Optional[List[str]] = None
    videos: Optional[List[str]] = None
    weather_impact: bool = False
    estimated_delay_days: Optional[int] = None
    is_published: bool = True
    tags: Optional[List[str]] = None

class ConstructionUpdateCreate(ConstructionUpdateBase):
    project_id: int
    posted_by: int

class ConstructionUpdateResponse(ConstructionUpdateBase):
    id: int
    project_id: int
    posted_by: int
    created_at: datetime
    
    class Config:
        from_attributes = True


# ============= MESSAGE SCHEMAS =============

class MessageBase(BaseModel):
    recipient_id: int
    subject: Optional[str] = None
    message_content: str
    message_type: MessageType = MessageType.GENERAL
    priority: Priority = Priority.MEDIUM
    attachments: Optional[List[str]] = None

class MessageCreate(MessageBase):
    sender_id: int
    project_id: Optional[int] = None
    booking_id: Optional[int] = None
    parent_message_id: Optional[int] = None

class MessageResponse(MessageBase):
    id: int
    sender_id: int
    project_id: Optional[int] = None
    booking_id: Optional[int] = None
    is_read: bool
    parent_message_id: Optional[int] = None
    created_at: datetime
    read_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


# ============= CHANGE REQUEST SCHEMAS =============

class ChangeRequestBase(BaseModel):
    request_type: ChangeRequestType
    request_title: str
    request_description: str
    current_specification: Optional[str] = None
    requested_specification: Optional[str] = None
    attachments: Optional[List[str]] = None

class ChangeRequestCreate(ChangeRequestBase):
    booking_id: int

class ChangeRequestUpdate(BaseModel):
    status: Optional[ChangeRequestStatus] = None
    estimated_cost: Optional[Decimal] = None
    estimated_timeline_days: Optional[int] = None
    builder_response: Optional[str] = None
    rejection_reason: Optional[str] = None
    approval_date: Optional[datetime] = None
    completion_date: Optional[datetime] = None
    final_cost: Optional[Decimal] = None

class ChangeRequestResponse(ChangeRequestBase):
    id: int
    booking_id: int
    estimated_cost: Optional[Decimal] = None
    estimated_timeline_days: Optional[int] = None
    status: ChangeRequestStatus
    builder_response: Optional[str] = None
    rejection_reason: Optional[str] = None
    approval_date: Optional[datetime] = None
    completion_date: Optional[datetime] = None
    final_cost: Optional[Decimal] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


# ============= 3D MODEL SCHEMAS =============

class Model3DBase(BaseModel):
    model_name: str
    model_description: Optional[str] = None
    model_type: ModelType
    file_url: str
    file_size: Optional[int] = None
    file_format: FileFormat
    thumbnail_url: Optional[str] = None
    is_interactive: bool = False
    viewer_config: Optional[Dict[str, Any]] = None
    access_level: AccessLevel = AccessLevel.PUBLIC
    version: str = "1.0"

class Model3DCreate(Model3DBase):
    project_id: Optional[int] = None
    unit_id: Optional[int] = None

class Model3DResponse(Model3DBase):
    id: int
    project_id: Optional[int] = None
    unit_id: Optional[int] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


# ============= NOTIFICATION SCHEMAS =============

class NotificationBase(BaseModel):
    notification_type: NotificationType
    title: str
    message: str
    related_entity_type: Optional[str] = None
    related_entity_id: Optional[int] = None
    priority: Priority = Priority.MEDIUM
    send_via: Optional[List[str]] = None
    action_url: Optional[str] = None

class NotificationCreate(NotificationBase):
    user_id: int
    scheduled_send_time: Optional[datetime] = None

class NotificationResponse(NotificationBase):
    id: int
    user_id: int
    is_read: bool
    is_sent: bool
    scheduled_send_time: Optional[datetime] = None
    sent_at: Optional[datetime] = None
    read_at: Optional[datetime] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


# ============= SYSTEM SETTINGS SCHEMAS =============

class SystemSettingBase(BaseModel):
    setting_key: str
    setting_value: Dict[str, Any]
    setting_type: str
    description: Optional[str] = None
    category: Optional[str] = None
    is_public: bool = False

class SystemSettingCreate(SystemSettingBase):
    pass

class SystemSettingResponse(SystemSettingBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# ============= PAGINATION & FILTER SCHEMAS =============

class PaginationParams(BaseModel):
    page: int = Field(default=1, ge=1)
    limit: int = Field(default=10, ge=1, le=100)

class ProjectFilter(PaginationParams):
    status: Optional[ProjectStatus] = None
    city: Optional[str] = None
    min_price: Optional[Decimal] = None
    max_price: Optional[Decimal] = None
    unit_type: Optional[UnitType] = None
    builder_id: Optional[int] = None
    project_type: Optional[ProjectType] = None

class BookingFilter(PaginationParams):
    customer_id: Optional[int] = None
    booking_status: Optional[BookingStatus] = None
    unit_id: Optional[int] = None

class NotificationFilter(PaginationParams):
    is_read: Optional[bool] = None
    notification_type: Optional[NotificationType] = None


# ============= API RESPONSE SCHEMAS =============

class ApiResponse(BaseModel):
    success: bool
    message: Optional[str] = None
    data: Optional[Any] = None

class ErrorDetail(BaseModel):
    field: str
    message: str

class ErrorResponse(BaseModel):
    success: bool = False
    error: Dict[str, Any]
    timestamp: datetime
    path: str
