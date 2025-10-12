"""Payment routes."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import crud, schemas, models
from database.database import get_db
from database.auth import require_builder

router = APIRouter(prefix="/api/payments", tags=["Payments"])


@router.post("", response_model=schemas.PaymentResponse, status_code=status.HTTP_201_CREATED)
def create_payment(
    payment: schemas.PaymentCreate,
    builder: models.User = Depends(require_builder),
    db: Session = Depends(get_db)
):
    """Record a payment (Builder only)."""
    # Verify booking exists and belongs to builder
    booking = crud.get_booking_by_id(db, booking_id=payment.booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    if booking.project.builder_id != builder.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Create payment
    db_payment = crud.create_payment(db=db, payment=payment)
    
    # Update booking amounts
    booking.paid_amount += payment.amount
    booking.pending_amount = booking.total_amount - booking.paid_amount
    
    # Update booking status if fully paid
    if booking.paid_amount >= booking.total_amount:
        booking.status = "completed"
    elif booking.paid_amount > 0 and booking.status == "pending":
        booking.status = "active"
    
    db.commit()
    db.refresh(db_payment)
    
    return db_payment
