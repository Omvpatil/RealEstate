"""Unit routes."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import crud, schemas, models
from database.database import get_db
from database.auth import require_builder

router = APIRouter(prefix="/api/units", tags=["Units"])


@router.post("", response_model=schemas.UnitResponse, status_code=status.HTTP_201_CREATED)
def create_unit(
    unit: schemas.UnitCreate,
    current_user: models.User = Depends(require_builder),
    db: Session = Depends(get_db)
):
    """Create a new unit (Builder only)."""
    # Verify project ownership
    project = crud.get_project(db, project_id=unit.project_id)
    if not project or project.builder_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to create units for this project")
    
    return crud.create_unit(db=db, unit=unit)
