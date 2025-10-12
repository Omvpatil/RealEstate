"""Appointment routes."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from database import crud, schemas, models
from database.database import get_db
from database.auth import get_current_user, require_builder

router = APIRouter(prefix="/api/appointments", tags=["Appointments"])


@router.post("", response_model=schemas.AppointmentResponse, status_code=status.HTTP_201_CREATED)
def create_appointment(
    appointment: schemas.AppointmentCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new appointment."""
    return crud.create_appointment(db=db, appointment=appointment, user_id=current_user.id)


@router.get("/customer/{customer_id}", response_model=List[schemas.AppointmentResponse])
def get_customer_appointments(
    customer_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all appointments for a customer."""
    if current_user.user_type == models.UserType.CUSTOMER and current_user.id != customer_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    return crud.get_appointments_by_customer(db, customer_id=customer_id)


@router.get("/project/{project_id}", response_model=List[schemas.AppointmentResponse])
def get_project_appointments(
    project_id: int,
    builder: models.User = Depends(require_builder),
    db: Session = Depends(get_db)
):
    """Get all appointments for a project (Builder only)."""
    return crud.get_appointments_by_project(db, project_id=project_id)


@router.get("", response_model=dict)
def get_appointments(
    page: int = 1,
    limit: int = 10,
    status: Optional[str] = None,
    type: Optional[str] = None,
    project_id: Optional[int] = None,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all appointments with filters - for both builders and customers."""
    skip = (page - 1) * limit
    
    # Base query depends on user type
    if current_user.user_type == models.UserType.BUILDER:
        # Builder sees appointments for their projects
        query = db.query(models.Appointment).join(models.Project).filter(
            models.Project.builder_id == current_user.id
        )
    else:
        # Customer sees their own appointments
        query = db.query(models.Appointment).filter(
            models.Appointment.customer_id == current_user.id
        )
    
    # Apply filters
    if status:
        query = query.filter(models.Appointment.status == status)
    if type:
        query = query.filter(models.Appointment.appointment_type == type)
    if project_id:
        query = query.filter(models.Appointment.project_id == project_id)
    
    total = query.count()
    appointments = query.offset(skip).limit(limit).all()
    
    # Calculate stats based on user type
    if current_user.user_type == models.UserType.BUILDER:
        all_appointments = db.query(models.Appointment).join(models.Project).filter(
            models.Project.builder_id == current_user.id
        ).all()
    else:
        all_appointments = db.query(models.Appointment).filter(
            models.Appointment.customer_id == current_user.id
        ).all()
    
    stats = {
        "total": len(all_appointments),
        "confirmed": len([a for a in all_appointments if a.status == "confirmed"]),
        "pending": len([a for a in all_appointments if a.status == "pending"]),
        "completed": len([a for a in all_appointments if a.status == "completed"]),
        "cancelled": len([a for a in all_appointments if a.status == "cancelled"])
    }
    
    return {
        "appointments": appointments,
        "total": total,
        "page": page,
        "limit": limit,
        "stats": stats
    }


@router.get("/{appointment_id}", response_model=schemas.AppointmentResponse)
def get_appointment(
    appointment_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get appointment by ID."""
    appointment = crud.get_appointment_by_id(db, appointment_id=appointment_id)
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    # Authorization
    if current_user.user_type == models.UserType.CUSTOMER and appointment.customer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    return appointment


@router.patch("/{appointment_id}/status", response_model=schemas.AppointmentResponse)
def update_appointment_status(
    appointment_id: int,
    status_update: dict,
    builder: models.User = Depends(require_builder),
    db: Session = Depends(get_db)
):
    """Update appointment status (Builder only)."""
    appointment = crud.get_appointment_by_id(db, appointment_id=appointment_id)
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    # Verify ownership
    if appointment.project.builder_id != builder.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    new_status = status_update.get("status")
    if new_status not in ["pending", "confirmed", "completed", "cancelled"]:
        raise HTTPException(status_code=400, detail="Invalid status")
    
    appointment.status = new_status
    db.commit()
    db.refresh(appointment)
    return appointment


@router.patch("/{appointment_id}/reschedule", response_model=schemas.AppointmentResponse)
def reschedule_appointment(
    appointment_id: int,
    reschedule_data: dict,
    builder: models.User = Depends(require_builder),
    db: Session = Depends(get_db)
):
    """Reschedule an appointment (Builder only)."""
    appointment = crud.get_appointment_by_id(db, appointment_id=appointment_id)
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    # Verify ownership
    if appointment.project.builder_id != builder.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Update appointment details
    if "appointment_date" in reschedule_data:
        appointment.appointment_date = reschedule_data["appointment_date"]
    if "meeting_location" in reschedule_data:
        appointment.meeting_location = reschedule_data["meeting_location"]
    
    db.commit()
    db.refresh(appointment)
    return appointment


@router.delete("/{appointment_id}", response_model=dict)
def cancel_appointment(
    appointment_id: int,
    builder: models.User = Depends(require_builder),
    db: Session = Depends(get_db)
):
    """Cancel an appointment (Builder only)."""
    appointment = crud.get_appointment_by_id(db, appointment_id=appointment_id)
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    # Verify ownership
    if appointment.project.builder_id != builder.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    appointment.status = "cancelled"
    db.commit()
    
    return {"message": "Appointment cancelled successfully"}
