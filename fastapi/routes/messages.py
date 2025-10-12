"""Message routes."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from typing import Optional

from database import crud, schemas, models
from database.database import get_db
from database.auth import get_current_user

router = APIRouter(prefix="/api/messages", tags=["Messages"])


@router.get("/conversations", response_model=dict)
def get_conversations(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all conversations for current user."""
    conversations = crud.get_conversations(db, user_id=current_user.id)
    return {"conversations": conversations}


@router.get("/conversation/{customer_id}/{project_id}", response_model=dict)
def get_conversation_messages(
    customer_id: int,
    project_id: int,
    page: int = 1,
    limit: int = 50,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get messages in a specific conversation."""
    skip = (page - 1) * limit
    
    # Get messages between current user and the other party for this project
    query = db.query(models.Message).filter(
        models.Message.project_id == project_id,
        or_(
            and_(
                models.Message.sender_id == current_user.id,
                models.Message.recipient_id == customer_id
            ),
            and_(
                models.Message.sender_id == customer_id,
                models.Message.recipient_id == current_user.id
            )
        )
    ).order_by(models.Message.created_at.desc())
    
    total = query.count()
    messages = query.offset(skip).limit(limit).all()
    
    # Mark messages as read
    for msg in messages:
        if msg.recipient_id == current_user.id and not msg.is_read:
            msg.is_read = True
    db.commit()
    
    return {
        "messages": messages,
        "total": total,
        "page": page,
        "limit": limit
    }


@router.post("", response_model=schemas.MessageResponse, status_code=status.HTTP_201_CREATED)
def send_message(
    message: schemas.MessageCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Send a message."""
    message_data = message.dict()
    message_data["sender_id"] = current_user.id
    return crud.create_message(db=db, message=schemas.MessageCreate(**message_data))


@router.patch("/conversation/{conversation_id}/read", response_model=dict)
def mark_conversation_read(
    conversation_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Mark all messages in a conversation as read."""
    messages = db.query(models.Message).filter(
        models.Message.id == conversation_id,
        models.Message.recipient_id == current_user.id,
        models.Message.is_read == False
    ).all()
    
    count = 0
    for msg in messages:
        msg.is_read = True
        count += 1
    
    db.commit()
    
    return {
        "message": "Messages marked as read",
        "count": count
    }


@router.get("", response_model=dict)
def get_messages(
    page: int = 1,
    limit: int = 20,
    conversation_id: Optional[int] = None,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all messages for current user."""
    skip = (page - 1) * limit
    
    query = db.query(models.Message).filter(
        or_(
            models.Message.sender_id == current_user.id,
            models.Message.recipient_id == current_user.id
        )
    )
    
    if conversation_id:
        query = query.filter(models.Message.id == conversation_id)
    
    query = query.order_by(models.Message.created_at.desc())
    
    total = query.count()
    messages = query.offset(skip).limit(limit).all()
    
    return {
        "messages": messages,
        "total": total,
        "page": page,
        "limit": limit
    }
