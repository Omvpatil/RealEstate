"""Change Request routes."""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import crud, schemas, models
from database.database import get_db
from .auth import get_current_user

router = APIRouter(prefix="/api/change-requests", tags=["change-requests"])


@router.post("", response_model=schemas.ChangeRequestResponse, status_code=status.HTTP_201_CREATED)
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


@router.get("/{request_id}", response_model=schemas.ChangeRequestResponse)
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


@router.get("", response_model=List[schemas.ChangeRequestResponse])
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
        bookings = crud.get_customer_bookings(db, current_user.id)
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


@router.patch("/{request_id}", response_model=schemas.ChangeRequestResponse)
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
