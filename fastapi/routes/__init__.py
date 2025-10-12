"""Route package initialization."""

from .auth import router as auth_router
from .projects import router as projects_router
from .units import router as units_router
from .bookings import router as bookings_router
from .appointments import router as appointments_router
from .messages import router as messages_router
from .payments import router as payments_router
from .notifications import router as notifications_router
from .change_requests import router as change_requests_router

__all__ = [
    "auth_router",
    "projects_router",
    "units_router",
    "bookings_router",
    "appointments_router",
    "messages_router",
    "payments_router",
    "notifications_router",
    "change_requests_router",
]
