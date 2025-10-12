"""Project routes."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database import crud, schemas, models
from database.database import get_db
from database.auth import get_current_user, require_builder

router = APIRouter(prefix="/api/projects", tags=["Projects"])


@router.get("", response_model=schemas.ProjectListResponse)
def get_projects(
    page: int = 1,
    limit: int = 10,
    location: str = None,  # Alias for city
    city: str = None,
    project_type: str = None,
    status: str = None,
    min_price: float = None,
    max_price: float = None,
    builder_id: int = None,
    db: Session = Depends(get_db)
):
    """Get list of projects with filters."""
    # Use location as alias for city if city not provided
    filter_city = city or location
    
    # Create filter object
    filters = schemas.ProjectFilter(
        page=page,
        limit=limit,
        city=filter_city,
        project_type=project_type,
        status=status,
        min_price=min_price,
        max_price=max_price,
        builder_id=builder_id
    )
    
    # Get projects with filters
    result = crud.get_projects(db, filters)
    
    return {
        "projects": result["projects"],
        "pagination": result["pagination"]
    }


@router.get("/{project_id}", response_model=schemas.ProjectResponse)
def get_project(project_id: int, db: Session = Depends(get_db)):
    """Get project by ID."""
    project = crud.get_project(db, project_id=project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.post("", response_model=schemas.ProjectResponse, status_code=status.HTTP_201_CREATED)
def create_project(
    project: schemas.ProjectCreate,
    current_user: models.User = Depends(require_builder),
    db: Session = Depends(get_db)
):
    """Create a new project (Builder only)."""
    return crud.create_project(db=db, project=project, builder_id=current_user.id)


@router.patch("/{project_id}", response_model=schemas.ProjectResponse)
def update_project(
    project_id: int,
    project_update: schemas.ProjectUpdate,
    current_user: models.User = Depends(require_builder),
    db: Session = Depends(get_db)
):
    """Update project (Builder only)."""
    project = crud.get_project(db, project_id=project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Get builder record for current user
    builder = crud.get_builder_by_user_id(db, current_user.id)
    if not builder:
        raise HTTPException(status_code=403, detail="Builder not found")
    
    # Verify ownership
    if project.builder_id != builder.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this project")
    
    return crud.update_project(db=db, project_id=project_id, project_update=project_update)


@router.delete("/{project_id}", status_code=status.HTTP_200_OK)
def delete_project(
    project_id: int,
    current_user: models.User = Depends(require_builder),
    db: Session = Depends(get_db)
):
    """Delete project (Builder only)."""
    project = crud.get_project(db, project_id=project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Get builder record for current user
    builder = crud.get_builder_by_user_id(db, current_user.id)
    if not builder:
        raise HTTPException(status_code=403, detail="Builder not found")
    
    # Verify ownership
    if project.builder_id != builder.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this project")
    
    success = crud.delete_project(db=db, project_id=project_id)
    if not success:
        raise HTTPException(status_code=404, detail="Project not found")
    
    return {"message": "Project deleted successfully"}


@router.get("/{project_id}/units", response_model=List[schemas.UnitResponse])
def get_project_units(project_id: int, db: Session = Depends(get_db)):
    """Get all units for a project."""
    return crud.get_units_by_project(db, project_id=project_id)


@router.get("/{project_id}/progress", response_model=List[schemas.ProjectProgressResponse])
def get_project_progress(project_id: int, db: Session = Depends(get_db)):
    """Get construction progress for a project."""
    return crud.get_progress_by_project(db, project_id=project_id)


@router.get("/{project_id}/updates", response_model=List[schemas.ConstructionUpdateResponse])
def get_construction_updates(
    project_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get construction updates for a project."""
    # Check if user has access to this project
    if current_user.user_type == models.UserType.CUSTOMER:
        booking = db.query(models.Booking).filter(
            models.Booking.customer_id == current_user.id,
            models.Booking.project_id == project_id
        ).first()
        if not booking:
            raise HTTPException(status_code=403, detail="No access to this project")
    
    return crud.get_updates_by_project(db, project_id=project_id)
