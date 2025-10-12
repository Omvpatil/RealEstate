# BuildCraft Real Estate Platform - Database Schema & API Documentation

## Overview

This document outlines the complete database schema and API format specifications for the BuildCraft real estate platform, supporting both builder and customer portals with comprehensive project management, booking, and communication features.

---

## Database Schema

### 1. Users & Authentication

#### 1.1 Users Table

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_type ENUM('builder', 'customer') NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_user_type (user_type)
);
```

#### 1.2 Builders Table

```sql
CREATE TABLE builders (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    license_number VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    website VARCHAR(255),
    description TEXT,
    logo_url VARCHAR(500),
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_projects INT DEFAULT 0,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_license (license_number),
    INDEX idx_rating (rating)
);
```

#### 1.3 Customers Table

```sql
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT,
    date_of_birth DATE,
    preferred_contact_method ENUM('email', 'phone', 'both') DEFAULT 'email',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_name (first_name, last_name)
);
```

### 2. Projects & Properties

#### 2.1 Projects Table

```sql
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    builder_id INT NOT NULL,
    project_name VARCHAR(255) NOT NULL,
    description TEXT,
    project_type ENUM('residential', 'commercial', 'mixed') NOT NULL,
    status ENUM('planning', 'construction', 'completed', 'delivered') DEFAULT 'planning',
    location_address TEXT NOT NULL,
    location_city VARCHAR(100) NOT NULL,
    location_state VARCHAR(100) NOT NULL,
    location_zipcode VARCHAR(20) NOT NULL,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    total_units INT NOT NULL,
    available_units INT NOT NULL,
    price_range_min DECIMAL(15,2),
    price_range_max DECIMAL(15,2),
    project_area DECIMAL(10,2), -- in sq ft
    amenities JSON, -- ["gym", "pool", "parking", "security"]
    start_date DATE,
    expected_completion_date DATE,
    actual_completion_date DATE,
    images JSON, -- array of image URLs
    floor_plans JSON, -- array of floor plan URLs
    brochure_url VARCHAR(500),
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (builder_id) REFERENCES builders(id) ON DELETE CASCADE,
    INDEX idx_builder (builder_id),
    INDEX idx_status (status),
    INDEX idx_location (location_city, location_state),
    INDEX idx_price_range (price_range_min, price_range_max)
);
```

#### 2.2 Units Table

```sql
CREATE TABLE units (
    id SERIAL PRIMARY KEY,
    project_id INT NOT NULL,
    unit_number VARCHAR(50) NOT NULL,
    unit_type ENUM('1BHK', '2BHK', '3BHK', '4BHK+', 'studio', 'penthouse') NOT NULL,
    floor_number INT NOT NULL,
    area_sqft DECIMAL(8,2) NOT NULL,
    price DECIMAL(15,2) NOT NULL,
    status ENUM('available', 'booked', 'sold', 'reserved') DEFAULT 'available',
    facing ENUM('north', 'south', 'east', 'west', 'northeast', 'northwest', 'southeast', 'southwest'),
    balconies INT DEFAULT 0,
    bathrooms INT NOT NULL,
    parking_spaces INT DEFAULT 0,
    floor_plan_url VARCHAR(500),
    features JSON, -- ["modular_kitchen", "false_ceiling", "premium_flooring"]
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    UNIQUE KEY unique_unit_per_project (project_id, unit_number),
    INDEX idx_project_status (project_id, status),
    INDEX idx_unit_type (unit_type),
    INDEX idx_price (price)
);
```

### 3. Bookings & Transactions

#### 3.1 Bookings Table

```sql
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    customer_id INT NOT NULL,
    unit_id INT NOT NULL,
    booking_status ENUM('inquiry', 'site_visit_scheduled', 'token_paid', 'booking_confirmed', 'cancelled') DEFAULT 'inquiry',
    token_amount DECIMAL(15,2),
    total_amount DECIMAL(15,2) NOT NULL,
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expected_registration_date DATE,
    actual_registration_date DATE,
    payment_plan ENUM('full_payment', 'installments', 'loan') DEFAULT 'installments',
    loan_approved BOOLEAN DEFAULT FALSE,
    loan_amount DECIMAL(15,2),
    special_requests TEXT,
    agent_id INT, -- if booking through agent
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE CASCADE,
    INDEX idx_customer (customer_id),
    INDEX idx_unit (unit_id),
    INDEX idx_status (booking_status),
    INDEX idx_booking_date (booking_date)
);
```

#### 3.2 Payments Table

```sql
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    booking_id INT NOT NULL,
    payment_type ENUM('token', 'installment', 'final', 'maintenance', 'penalty') NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    payment_method ENUM('cash', 'cheque', 'bank_transfer', 'online', 'loan') NOT NULL,
    payment_status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    transaction_id VARCHAR(255),
    due_date DATE,
    paid_date TIMESTAMP,
    receipt_url VARCHAR(500),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    INDEX idx_booking (booking_id),
    INDEX idx_payment_type (payment_type),
    INDEX idx_status (payment_status),
    INDEX idx_due_date (due_date)
);
```

### 4. Appointments & Site Visits

#### 4.1 Appointments Table

```sql
CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    customer_id INT NOT NULL,
    project_id INT NOT NULL,
    appointment_type ENUM('site_visit', 'consultation', 'documentation', 'handover') NOT NULL,
    appointment_date DATETIME NOT NULL,
    duration_minutes INT DEFAULT 60,
    status ENUM('scheduled', 'confirmed', 'completed', 'cancelled', 'rescheduled') DEFAULT 'scheduled',
    meeting_location ENUM('site', 'office', 'online') DEFAULT 'site',
    attendees JSON, -- ["customer", "builder_representative", "agent"]
    agenda TEXT,
    notes TEXT,
    reschedule_reason TEXT,
    created_by ENUM('customer', 'builder') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    INDEX idx_customer (customer_id),
    INDEX idx_project (project_id),
    INDEX idx_appointment_date (appointment_date),
    INDEX idx_status (status)
);
```

### 5. Construction Progress & Updates

#### 5.1 Project Progress Table

```sql
CREATE TABLE project_progress (
    id SERIAL PRIMARY KEY,
    project_id INT NOT NULL,
    phase_name VARCHAR(255) NOT NULL,
    phase_description TEXT,
    start_date DATE,
    expected_end_date DATE,
    actual_end_date DATE,
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    status ENUM('not_started', 'in_progress', 'completed', 'delayed') DEFAULT 'not_started',
    milestone_images JSON, -- array of progress image URLs
    contractor_notes TEXT,
    customer_visible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    INDEX idx_project (project_id),
    INDEX idx_phase (phase_name),
    INDEX idx_status (status)
);
```

#### 5.2 Construction Updates Table

```sql
CREATE TABLE construction_updates (
    id SERIAL PRIMARY KEY,
    project_id INT NOT NULL,
    update_title VARCHAR(255) NOT NULL,
    update_content TEXT NOT NULL,
    update_type ENUM('milestone', 'delay', 'general', 'safety', 'quality') NOT NULL,
    priority ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
    images JSON, -- array of update image URLs
    videos JSON, -- array of update video URLs
    weather_impact BOOLEAN DEFAULT FALSE,
    estimated_delay_days INT,
    posted_by INT NOT NULL, -- builder user ID
    is_published BOOLEAN DEFAULT TRUE,
    tags JSON, -- ["foundation", "plumbing", "electrical"]
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (posted_by) REFERENCES users(id),
    INDEX idx_project (project_id),
    INDEX idx_update_type (update_type),
    INDEX idx_priority (priority),
    INDEX idx_created_at (created_at)
);
```

### 6. Communication & Messages

#### 6.1 Messages Table

```sql
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    sender_id INT NOT NULL,
    recipient_id INT NOT NULL,
    project_id INT,
    booking_id INT,
    subject VARCHAR(255),
    message_content TEXT NOT NULL,
    message_type ENUM('inquiry', 'complaint', 'update', 'general') DEFAULT 'general',
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    is_read BOOLEAN DEFAULT FALSE,
    attachments JSON, -- array of file URLs
    parent_message_id INT, -- for replies
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL,
    FOREIGN KEY (parent_message_id) REFERENCES messages(id) ON DELETE SET NULL,
    INDEX idx_sender (sender_id),
    INDEX idx_recipient (recipient_id),
    INDEX idx_project (project_id),
    INDEX idx_created_at (created_at),
    INDEX idx_is_read (is_read)
);
```

### 7. Change Requests & Customizations

#### 7.1 Change Requests Table

```sql
CREATE TABLE change_requests (
    id SERIAL PRIMARY KEY,
    booking_id INT NOT NULL,
    request_type ENUM('layout', 'fixtures', 'finishes', 'electrical', 'plumbing', 'other') NOT NULL,
    request_title VARCHAR(255) NOT NULL,
    request_description TEXT NOT NULL,
    current_specification TEXT,
    requested_specification TEXT,
    estimated_cost DECIMAL(15,2),
    estimated_timeline_days INT,
    status ENUM('submitted', 'under_review', 'approved', 'rejected', 'completed') DEFAULT 'submitted',
    builder_response TEXT,
    rejection_reason TEXT,
    approval_date TIMESTAMP,
    completion_date TIMESTAMP,
    final_cost DECIMAL(15,2),
    attachments JSON, -- supporting documents/images
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    INDEX idx_booking (booking_id),
    INDEX idx_status (status),
    INDEX idx_request_type (request_type)
);
```

### 8. 3D Models & Media

#### 8.1 Models Table

```sql
CREATE TABLE models_3d (
    id SERIAL PRIMARY KEY,
    project_id INT,
    unit_id INT,
    model_name VARCHAR(255) NOT NULL,
    model_description TEXT,
    model_type ENUM('project_overview', 'unit_interior', 'floor_plan', 'amenities') NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_size BIGINT, -- in bytes
    file_format ENUM('obj', 'fbx', 'gltf', 'glb', 'blend') NOT NULL,
    thumbnail_url VARCHAR(500),
    is_interactive BOOLEAN DEFAULT FALSE,
    viewer_config JSON, -- camera positions, lighting settings
    access_level ENUM('public', 'customers_only', 'booked_customers') DEFAULT 'public',
    version VARCHAR(50) DEFAULT '1.0',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE CASCADE,
    INDEX idx_project (project_id),
    INDEX idx_unit (unit_id),
    INDEX idx_model_type (model_type)
);
```

### 9. Notifications & Alerts

#### 9.1 Notifications Table

```sql
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    notification_type ENUM('booking_update', 'payment_due', 'appointment_reminder', 'progress_update', 'message_received', 'change_request_update') NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    related_entity_type ENUM('booking', 'project', 'appointment', 'message', 'payment', 'change_request'),
    related_entity_id INT,
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    is_read BOOLEAN DEFAULT FALSE,
    is_sent BOOLEAN DEFAULT FALSE,
    send_via JSON, -- ["email", "sms", "push", "in_app"]
    scheduled_send_time TIMESTAMP,
    sent_at TIMESTAMP,
    read_at TIMESTAMP,
    action_url VARCHAR(500), -- deep link or page URL
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_type (notification_type),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at)
);
```

### 10. System Settings & Configuration

#### 10.1 System Settings Table

```sql
CREATE TABLE system_settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(255) UNIQUE NOT NULL,
    setting_value JSON NOT NULL,
    setting_type ENUM('string', 'number', 'boolean', 'json', 'array') NOT NULL,
    description TEXT,
    category VARCHAR(100), -- "payment", "notification", "general"
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_is_public (is_public)
);
```

---

## API Endpoints & JSON Formats

### Authentication APIs

#### POST /api/auth/register

**Description:** Register a new user (builder or customer)

**Request Body:**

```json
{
    "userType": "builder|customer",
    "email": "user@example.com",
    "password": "securePassword123",
    "builderData": {
        "companyName": "ABC Construction",
        "licenseNumber": "LIC123456",
        "phone": "+1234567890",
        "address": "123 Business St, City, State, ZIP"
    },
    "customerData": {
        "firstName": "John",
        "lastName": "Doe",
        "phone": "+1234567890"
    }
}
```

**Response (Success - 201):**

```json
{
    "success": true,
    "message": "User registered successfully",
    "data": {
        "userId": 123,
        "email": "user@example.com",
        "userType": "customer",
        "isVerified": false,
        "accessToken": "jwt_token_here",
        "refreshToken": "refresh_token_here"
    }
}
```

#### POST /api/auth/login

**Description:** User login

**Request Body:**

```json
{
    "email": "user@example.com",
    "password": "securePassword123",
    "userType": "builder|customer"
}
```

**Response (Success - 200):**

```json
{
    "success": true,
    "message": "Login successful",
    "data": {
        "user": {
            "id": 123,
            "email": "user@example.com",
            "userType": "customer",
            "profile": {
                "firstName": "John",
                "lastName": "Doe",
                "phone": "+1234567890"
            }
        },
        "accessToken": "jwt_token_here",
        "refreshToken": "refresh_token_here",
        "expiresIn": 3600
    }
}
```

### Project APIs

#### GET /api/projects

**Description:** Get all projects with filtering and pagination

**Query Parameters:**

-   `page` (int): Page number (default: 1)
-   `limit` (int): Items per page (default: 10)
-   `status` (string): Filter by project status
-   `city` (string): Filter by city
-   `minPrice` (number): Minimum price filter
-   `maxPrice` (number): Maximum price filter
-   `unitType` (string): Filter by unit type
-   `builderId` (int): Filter by builder

**Response (Success - 200):**

```json
{
    "success": true,
    "data": {
        "projects": [
            {
                "id": 1,
                "projectName": "Green Valley Residency",
                "description": "Luxury residential complex with modern amenities",
                "projectType": "residential",
                "status": "construction",
                "location": {
                    "address": "123 Green Valley Road",
                    "city": "Bangalore",
                    "state": "Karnataka",
                    "zipcode": "560001",
                    "coordinates": {
                        "latitude": 12.9716,
                        "longitude": 77.5946
                    }
                },
                "totalUnits": 150,
                "availableUnits": 45,
                "priceRange": {
                    "min": 5500000,
                    "max": 12000000
                },
                "projectArea": 5000.0,
                "amenities": ["gym", "swimming_pool", "parking", "24x7_security", "clubhouse"],
                "completionDate": "2026-03-15",
                "images": ["https://example.com/project1/image1.jpg", "https://example.com/project1/image2.jpg"],
                "floorPlans": ["https://example.com/project1/floorplan1.pdf"],
                "builder": {
                    "id": 1,
                    "companyName": "ABC Construction",
                    "rating": 4.5,
                    "totalProjects": 12
                },
                "isFeatured": true,
                "createdAt": "2024-01-15T10:30:00Z"
            }
        ],
        "pagination": {
            "currentPage": 1,
            "totalPages": 5,
            "totalItems": 45,
            "hasNext": true,
            "hasPrev": false
        }
    }
}
```

#### GET /api/projects/{projectId}/units

**Description:** Get all units for a specific project

**Response (Success - 200):**

```json
{
    "success": true,
    "data": {
        "units": [
            {
                "id": 101,
                "unitNumber": "A-101",
                "unitType": "2BHK",
                "floorNumber": 1,
                "areaSqft": 1200.0,
                "price": 7500000,
                "status": "available",
                "facing": "east",
                "balconies": 2,
                "bathrooms": 2,
                "parkingSpaces": 1,
                "floorPlanUrl": "https://example.com/unit101/floorplan.jpg",
                "features": ["modular_kitchen", "false_ceiling", "premium_flooring"],
                "availability": {
                    "isAvailable": true,
                    "reservedUntil": null
                }
            }
        ]
    }
}
```

### Booking APIs

#### POST /api/bookings

**Description:** Create a new booking

**Request Body:**

```json
{
    "unitId": 101,
    "tokenAmount": 500000,
    "paymentPlan": "installments",
    "specialRequests": "Ground floor preferred",
    "loanRequired": true,
    "expectedRegistrationDate": "2025-06-15"
}
```

**Response (Success - 201):**

```json
{
    "success": true,
    "message": "Booking created successfully",
    "data": {
        "bookingId": 1001,
        "bookingStatus": "token_paid",
        "unit": {
            "id": 101,
            "unitNumber": "A-101",
            "project": {
                "id": 1,
                "projectName": "Green Valley Residency"
            }
        },
        "totalAmount": 7500000,
        "tokenAmount": 500000,
        "remainingAmount": 7000000,
        "bookingDate": "2024-10-08T14:30:00Z",
        "paymentSchedule": [
            {
                "installmentNumber": 1,
                "amount": 1500000,
                "dueDate": "2024-11-08",
                "description": "20% of total amount"
            },
            {
                "installmentNumber": 2,
                "amount": 2000000,
                "dueDate": "2025-01-08",
                "description": "Construction milestone 1"
            }
        ]
    }
}
```

#### GET /api/bookings/customer/{customerId}

**Description:** Get all bookings for a customer

**Response (Success - 200):**

```json
{
    "success": true,
    "data": {
        "bookings": [
            {
                "id": 1001,
                "bookingStatus": "booking_confirmed",
                "unit": {
                    "id": 101,
                    "unitNumber": "A-101",
                    "unitType": "2BHK",
                    "areaSqft": 1200.0
                },
                "project": {
                    "id": 1,
                    "projectName": "Green Valley Residency",
                    "builder": {
                        "companyName": "ABC Construction"
                    }
                },
                "totalAmount": 7500000,
                "paidAmount": 2000000,
                "remainingAmount": 5500000,
                "bookingDate": "2024-10-08T14:30:00Z",
                "expectedRegistrationDate": "2025-06-15",
                "paymentPlan": "installments",
                "nextPaymentDue": {
                    "amount": 1500000,
                    "dueDate": "2024-11-08"
                }
            }
        ]
    }
}
```

### Appointment APIs

#### POST /api/appointments

**Description:** Schedule a new appointment

**Request Body:**

```json
{
    "projectId": 1,
    "appointmentType": "site_visit",
    "appointmentDate": "2024-10-15T10:00:00Z",
    "durationMinutes": 90,
    "meetingLocation": "site",
    "agenda": "Site visit to check construction progress and finalize layout changes"
}
```

**Response (Success - 201):**

```json
{
    "success": true,
    "message": "Appointment scheduled successfully",
    "data": {
        "appointmentId": 501,
        "appointmentType": "site_visit",
        "appointmentDate": "2024-10-15T10:00:00Z",
        "duration": 90,
        "status": "scheduled",
        "meetingLocation": "site",
        "project": {
            "id": 1,
            "projectName": "Green Valley Residency",
            "location": {
                "address": "123 Green Valley Road, Bangalore"
            }
        },
        "attendees": ["customer", "builder_representative"],
        "agenda": "Site visit to check construction progress and finalize layout changes",
        "confirmationCode": "APT501GV",
        "reminderSettings": {
            "email": true,
            "sms": true,
            "reminderTimes": ["24h", "2h"]
        }
    }
}
```

### Progress Tracking APIs

#### GET /api/projects/{projectId}/progress

**Description:** Get construction progress for a project

**Response (Success - 200):**

```json
{
    "success": true,
    "data": {
        "projectId": 1,
        "overallProgress": 65.5,
        "phases": [
            {
                "id": 1,
                "phaseName": "Foundation",
                "description": "Foundation and basement construction",
                "startDate": "2024-01-15",
                "expectedEndDate": "2024-03-15",
                "actualEndDate": "2024-03-12",
                "progressPercentage": 100.0,
                "status": "completed",
                "milestoneImages": [
                    "https://example.com/progress/foundation1.jpg",
                    "https://example.com/progress/foundation2.jpg"
                ]
            },
            {
                "id": 2,
                "phaseName": "Structure",
                "description": "RCC structure and framework",
                "startDate": "2024-03-16",
                "expectedEndDate": "2024-07-15",
                "actualEndDate": null,
                "progressPercentage": 78.0,
                "status": "in_progress",
                "milestoneImages": ["https://example.com/progress/structure1.jpg"]
            }
        ],
        "recentUpdates": [
            {
                "id": 1,
                "title": "5th Floor Slab Completed",
                "content": "Successfully completed the 5th floor slab work. Proceeding with 6th floor construction.",
                "updateType": "milestone",
                "priority": "medium",
                "images": ["https://example.com/updates/update1.jpg"],
                "postedAt": "2024-10-05T16:30:00Z",
                "tags": ["structure", "milestone"]
            }
        ]
    }
}
```

### Message APIs

#### POST /api/messages

**Description:** Send a new message

**Request Body:**

```json
{
    "recipientId": 123,
    "projectId": 1,
    "bookingId": 1001,
    "subject": "Query about payment schedule",
    "messageContent": "I would like to discuss the upcoming payment schedule and possible modifications.",
    "messageType": "inquiry",
    "priority": "medium",
    "attachments": ["https://example.com/documents/payment_query.pdf"]
}
```

**Response (Success - 201):**

```json
{
    "success": true,
    "message": "Message sent successfully",
    "data": {
        "messageId": 2001,
        "subject": "Query about payment schedule",
        "messageType": "inquiry",
        "priority": "medium",
        "recipient": {
            "id": 123,
            "name": "ABC Construction",
            "userType": "builder"
        },
        "project": {
            "id": 1,
            "projectName": "Green Valley Residency"
        },
        "sentAt": "2024-10-08T15:45:00Z",
        "deliveryStatus": "sent"
    }
}
```

#### GET /api/messages/conversations

**Description:** Get user's message conversations

**Response (Success - 200):**

```json
{
    "success": true,
    "data": {
        "conversations": [
            {
                "conversationId": "user_123_456",
                "participant": {
                    "id": 456,
                    "name": "ABC Construction",
                    "userType": "builder"
                },
                "lastMessage": {
                    "id": 2005,
                    "content": "Thank you for your inquiry. We'll review your payment schedule request and get back to you within 24 hours.",
                    "sentAt": "2024-10-08T18:20:00Z",
                    "isRead": false
                },
                "unreadCount": 2,
                "relatedProject": {
                    "id": 1,
                    "projectName": "Green Valley Residency"
                }
            }
        ]
    }
}
```

### Change Request APIs

#### POST /api/change-requests

**Description:** Submit a change request

**Request Body:**

```json
{
    "bookingId": 1001,
    "requestType": "fixtures",
    "requestTitle": "Upgrade bathroom fixtures",
    "requestDescription": "Would like to upgrade bathroom fixtures to premium brand as discussed during site visit",
    "currentSpecification": "Standard ceramic fixtures",
    "requestedSpecification": "Premium brand ceramic fixtures with modern design",
    "attachments": ["https://example.com/fixtures/premium_fixtures.jpg"]
}
```

**Response (Success - 201):**

```json
{
    "success": true,
    "message": "Change request submitted successfully",
    "data": {
        "requestId": 3001,
        "requestType": "fixtures",
        "requestTitle": "Upgrade bathroom fixtures",
        "status": "submitted",
        "booking": {
            "id": 1001,
            "unit": {
                "unitNumber": "A-101"
            },
            "project": {
                "projectName": "Green Valley Residency"
            }
        },
        "submittedAt": "2024-10-08T16:00:00Z",
        "estimatedResponseTime": "3-5 business days",
        "trackingNumber": "CR3001GV"
    }
}
```

### Notification APIs

#### GET /api/notifications

**Description:** Get user notifications

**Query Parameters:**

-   `page` (int): Page number
-   `limit` (int): Items per page
-   `isRead` (boolean): Filter by read status
-   `type` (string): Filter by notification type

**Response (Success - 200):**

```json
{
    "success": true,
    "data": {
        "notifications": [
            {
                "id": 4001,
                "notificationType": "payment_due",
                "title": "Payment Due Reminder",
                "message": "Your next installment of ₹15,00,000 is due on November 8, 2024",
                "priority": "high",
                "isRead": false,
                "relatedEntity": {
                    "type": "booking",
                    "id": 1001
                },
                "actionUrl": "/customer/bookings/1001/payments",
                "createdAt": "2024-10-06T09:00:00Z"
            },
            {
                "id": 4002,
                "notificationType": "progress_update",
                "title": "Construction Milestone Achieved",
                "message": "5th floor slab work completed in Green Valley Residency",
                "priority": "medium",
                "isRead": true,
                "relatedEntity": {
                    "type": "project",
                    "id": 1
                },
                "actionUrl": "/customer/progress/1",
                "createdAt": "2024-10-05T16:30:00Z",
                "readAt": "2024-10-06T08:15:00Z"
            }
        ],
        "unreadCount": 5,
        "pagination": {
            "currentPage": 1,
            "totalPages": 3,
            "totalItems": 28
        }
    }
}
```

### 3D Models APIs

#### GET /api/projects/{projectId}/models

**Description:** Get 3D models for a project

**Response (Success - 200):**

```json
{
    "success": true,
    "data": {
        "models": [
            {
                "id": 5001,
                "modelName": "Project Overview Model",
                "modelType": "project_overview",
                "description": "Complete 3D model showing the entire project layout",
                "fileUrl": "https://example.com/models/project_overview.glb",
                "thumbnailUrl": "https://example.com/models/thumbnails/project_overview.jpg",
                "fileSize": 15728640,
                "fileFormat": "glb",
                "isInteractive": true,
                "viewerConfig": {
                    "cameraPosition": [0, 10, 20],
                    "lightingPreset": "outdoor",
                    "initialZoom": 1.0
                },
                "accessLevel": "public"
            },
            {
                "id": 5002,
                "modelName": "2BHK Interior Model",
                "modelType": "unit_interior",
                "unitId": 101,
                "description": "Interior design model for 2BHK units",
                "fileUrl": "https://example.com/models/2bhk_interior.glb",
                "thumbnailUrl": "https://example.com/models/thumbnails/2bhk_interior.jpg",
                "fileSize": 8421376,
                "fileFormat": "glb",
                "isInteractive": true,
                "accessLevel": "customers_only"
            }
        ]
    }
}
```

---

## Error Response Format

All API endpoints follow a consistent error response format:

```json
{
    "success": false,
    "error": {
        "code": "VALIDATION_ERROR",
        "message": "Invalid input data",
        "details": [
            {
                "field": "email",
                "message": "Email is required"
            },
            {
                "field": "phone",
                "message": "Phone number format is invalid"
            }
        ]
    },
    "timestamp": "2024-10-08T15:30:00Z",
    "path": "/api/auth/register"
}
```

## Common Error Codes

-   `VALIDATION_ERROR` (400): Input validation failed
-   `UNAUTHORIZED` (401): Authentication required
-   `FORBIDDEN` (403): Insufficient permissions
-   `NOT_FOUND` (404): Resource not found
-   `CONFLICT` (409): Resource already exists
-   `RATE_LIMIT_EXCEEDED` (429): Too many requests
-   `INTERNAL_SERVER_ERROR` (500): Server error

---

## Authentication & Authorization

### JWT Token Structure

All authenticated endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

### Token Payload

```json
{
    "userId": 123,
    "email": "user@example.com",
    "userType": "customer",
    "permissions": ["read:projects", "write:bookings"],
    "iat": 1728400000,
    "exp": 1728403600
}
```

### Refresh Token Flow

When access token expires, use the refresh token endpoint:

```
POST /api/auth/refresh
{
  "refreshToken": "refresh_token_here"
}
```

This comprehensive schema and API documentation provides the foundation for building a robust real estate platform with all the features evident from your Next.js frontend structure.
