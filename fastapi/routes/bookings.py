"""Booking routes."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from database import crud, schemas, models
from database.database import get_db
from database.auth import get_current_user, require_builder, require_customer

router = APIRouter(prefix="/api/bookings", tags=["Bookings"])


@router.post("", response_model=schemas.BookingResponse, status_code=status.HTTP_201_CREATED)
def create_booking(
    booking: schemas.BookingCreate,
    current_user: models.User = Depends(require_customer),
    db: Session = Depends(get_db)
):
    """Create a new booking (Customer only)."""
    # Verify unit is available
    unit = crud.get_unit(db, unit_id=booking.unit_id)
    if not unit:
        raise HTTPException(status_code=404, detail="Unit not found")
    if unit.availability_status != models.UnitAvailability.AVAILABLE:
        raise HTTPException(status_code=400, detail="Unit is not available")
    
    return crud.create_booking(db=db, booking=booking, customer_id=current_user.id)


@router.get("/customer/{customer_id}", response_model=List[schemas.BookingResponse])
def get_customer_bookings(
    customer_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all bookings for a customer."""
    # Users can only see their own bookings unless they're a builder
    if current_user.user_type == models.UserType.CUSTOMER and current_user.id != customer_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    return crud.get_bookings_by_customer(db, customer_id=customer_id)


@router.get("/builder", response_model=dict)
def get_builder_bookings(
    page: int = 1,
    limit: int = 10,
    status: Optional[str] = None,
    project_id: Optional[int] = None,
    payment_status: Optional[str] = None,
    builder: models.User = Depends(require_builder),
    db: Session = Depends(get_db)
):
    """Get all bookings for builder's projects with filters and stats."""
    skip = (page - 1) * limit
    
    # Base query - bookings for builder's projects
    query = db.query(models.Booking).join(models.Unit).join(models.Project).filter(
        models.Project.builder_id == builder.id
    )
    
    # Apply filters
    if status:
        query = query.filter(models.Booking.status == status)
    if project_id:
        query = query.filter(models.Project.id == project_id)
    if payment_status:
        if payment_status == "pending":
            query = query.filter(models.Booking.paid_amount == 0)
        elif payment_status == "partial":
            query = query.filter(
                models.Booking.paid_amount > 0,
                models.Booking.paid_amount < models.Booking.total_amount
            )
        elif payment_status == "completed":
            query = query.filter(models.Booking.paid_amount >= models.Booking.total_amount)
    
    total = query.count()
    bookings = query.offset(skip).limit(limit).all()
    
    # Calculate stats
    all_bookings = db.query(models.Booking).join(models.Unit).join(models.Project).filter(
        models.Project.builder_id == builder.id
    ).all()
    
    stats = {
        "total_bookings": len(all_bookings),
        "active_bookings": len([b for b in all_bookings if b.status == "active"]),
        "completed_bookings": len([b for b in all_bookings if b.status == "completed"]),
        "total_revenue": sum([b.paid_amount for b in all_bookings]),
        "pending_revenue": sum([b.pending_amount for b in all_bookings])
    }
    
    # Format response
    booking_list = []
    for booking in bookings:
        payment_progress = (booking.paid_amount / booking.total_amount * 100) if booking.total_amount > 0 else 0
        booking_list.append({
            "id": booking.id,
            "booking_number": f"BK-{booking.id:03d}",
            "customer": booking.customer,
            "project": booking.project,
            "unit": booking.unit,
            "total_amount": booking.total_amount,
            "paid_amount": booking.paid_amount,
            "pending_amount": booking.pending_amount,
            "payment_plan": booking.payment_plan,
            "status": booking.status,
            "payment_progress": round(payment_progress, 2)
        })
    
    return {
        "bookings": booking_list,
        "total": total,
        "page": page,
        "limit": limit,
        "stats": stats
    }


@router.get("/{booking_id}", response_model=schemas.BookingResponse)
def get_booking(
    booking_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get booking details."""
    booking = crud.get_booking_by_id(db, booking_id=booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    # Authorization check
    if current_user.user_type == models.UserType.CUSTOMER and booking.customer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    return booking


@router.patch("/{booking_id}/status", response_model=schemas.BookingResponse)
def update_booking_status(
    booking_id: int,
    status_update: dict,
    builder: models.User = Depends(require_builder),
    db: Session = Depends(get_db)
):
    """Update booking status (Builder only)."""
    booking = crud.get_booking_by_id(db, booking_id=booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    # Verify ownership
    if booking.project.builder_id != builder.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    new_status = status_update.get("status")
    if new_status not in ["pending", "active", "completed", "cancelled"]:
        raise HTTPException(status_code=400, detail="Invalid status")
    
    booking.status = new_status
    db.commit()
    db.refresh(booking)
    return booking


@router.get("/{booking_id}/payments", response_model=dict)
def get_booking_payments(
    booking_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all payments for a booking."""
    booking = crud.get_booking_by_id(db, booking_id=booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    # Authorization
    if current_user.user_type == models.UserType.CUSTOMER and booking.customer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    payments = crud.get_payments_by_booking(db, booking_id=booking_id)
    
    return {
        "booking_id": booking_id,
        "payments": payments,
        "total_paid": booking.paid_amount,
        "total_pending": booking.pending_amount,
        "payment_schedule": []  # Can be enhanced later
    }


@router.post("/{booking_id}/generate-agreement", response_model=dict)
def generate_booking_agreement(
    booking_id: int,
    builder: models.User = Depends(require_builder),
    db: Session = Depends(get_db)
):
    """Generate booking agreement PDF (Builder only)."""
    booking = crud.get_booking_by_id(db, booking_id=booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    # Verify ownership
    if booking.project.builder_id != builder.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # TODO: Implement PDF generation
    agreement_url = f"/agreements/booking_{booking_id}.pdf"
    
    return {
        "message": "Agreement generated successfully",
        "agreement_url": agreement_url,
        "generated_at": "2024-10-08T10:00:00Z"
    }


@router.get("/{booking_id}/download-agreement")
def download_booking_agreement(
    booking_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Download booking agreement PDF."""
    booking = crud.get_booking_by_id(db, booking_id=booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    # Authorization
    is_customer = current_user.user_type == models.UserType.CUSTOMER and booking.customer_id == current_user.id
    is_builder = current_user.user_type == models.UserType.BUILDER and booking.project.builder_id == current_user.id
    
    if not (is_customer or is_builder):
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # TODO: Implement file download
    raise HTTPException(status_code=501, detail="Agreement download not implemented yet")
