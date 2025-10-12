#!/usr/bin/env python3
"""
Database Initialization Script
Creates all tables in the PostgreSQL database based on SQLAlchemy models.
"""

import sys
from pathlib import Path

# Add the parent directory to sys.path to import database modules
sys.path.insert(0, str(Path(__file__).parent))

from database.database import engine, Base, SessionLocal
from database import models
from database.models import UserType
import database.crud as crud
import database.schemas as schemas


def create_tables():
    """Create all database tables."""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created successfully!")


def create_sample_data():
    """Create sample data for testing (optional)."""
    print("\nCreating sample data...")
    db = SessionLocal()
    
    try:
        # Check if data already exists
        existing_user = crud.get_user_by_email(db, "builder@test.com")
        if existing_user:
            print("⚠️  Sample data already exists. Skipping...")
            return
        
        # Create a sample builder
        builder_user = schemas.UserCreate(
            email="builder@test.com",
            password="password123",
            user_type=UserType.BUILDER,
            builder_data=schemas.BuilderCreate(
                company_name="ABC Construction Co.",
                license_number="LIC-2024-001",
                phone="+1234567890",
                address="123 Builder Street, Construction City, CC 12345",
                website="https://abcconstruction.com",
                description="Leading construction company with 20+ years of experience"
            )
        )
        
        builder = crud.create_user(db, builder_user)
        print(f"✅ Created sample builder: {builder.email}")
        
        # Create a sample customer
        customer_user = schemas.UserCreate(
            email="customer@test.com",
            password="password123",
            user_type=UserType.CUSTOMER,
            customer_data=schemas.CustomerCreate(
                first_name="John",
                last_name="Doe",
                phone="+0987654321",
                address="456 Customer Avenue, Resident City, RC 67890"
            )
        )
        
        customer = crud.create_user(db, customer_user)
        print(f"✅ Created sample customer: {customer.email}")
        
        # Create a sample project
        from database.models import ProjectType, ProjectStatus
        from decimal import Decimal
        from datetime import date, timedelta
        
        builder_profile = crud.get_builder_by_user_id(db, builder.id)
        
        project = schemas.ProjectCreate(
            builder_id=builder_profile.id,
            project_name="Green Valley Residency",
            description="Luxury residential complex with modern amenities",
            project_type=ProjectType.RESIDENTIAL,
            status=ProjectStatus.CONSTRUCTION,
            location_address="123 Green Valley Road",
            location_city="Bangalore",
            location_state="Karnataka",
            location_zipcode="560001",
            latitude=Decimal("12.9716"),
            longitude=Decimal("77.5946"),
            total_units=150,
            available_units=145,
            price_range_min=Decimal("5500000"),
            price_range_max=Decimal("12000000"),
            project_area=Decimal("5000.00"),
            amenities=["gym", "swimming_pool", "parking", "24x7_security", "clubhouse", "garden"],
            start_date=date(2024, 1, 15),
            expected_completion_date=date(2026, 3, 15),
            images=[
                "https://example.com/project1/image1.jpg",
                "https://example.com/project1/image2.jpg"
            ],
            floor_plans=["https://example.com/project1/floorplan1.pdf"],
            is_featured=True
        )
        
        created_project = crud.create_project(db, project)
        print(f"✅ Created sample project: {created_project.project_name}")
        
        # Create sample units
        from database.models import UnitType, UnitStatus, FacingDirection
        
        units_data = [
            {
                "unit_number": "A-101",
                "unit_type": UnitType.TWO_BHK,
                "floor_number": 1,
                "area_sqft": Decimal("1200.00"),
                "price": Decimal("7500000"),
                "facing": FacingDirection.EAST,
                "balconies": 2,
                "bathrooms": 2,
                "parking_spaces": 1,
                "features": ["modular_kitchen", "false_ceiling", "premium_flooring"]
            },
            {
                "unit_number": "A-102",
                "unit_type": UnitType.THREE_BHK,
                "floor_number": 1,
                "area_sqft": Decimal("1600.00"),
                "price": Decimal("10500000"),
                "facing": FacingDirection.NORTH,
                "balconies": 3,
                "bathrooms": 3,
                "parking_spaces": 2,
                "features": ["modular_kitchen", "false_ceiling", "premium_flooring", "study_room"]
            },
            {
                "unit_number": "B-201",
                "unit_type": UnitType.TWO_BHK,
                "floor_number": 2,
                "area_sqft": Decimal("1250.00"),
                "price": Decimal("7800000"),
                "facing": FacingDirection.WEST,
                "balconies": 2,
                "bathrooms": 2,
                "parking_spaces": 1,
                "status": UnitStatus.BOOKED,
                "features": ["modular_kitchen", "false_ceiling"]
            }
        ]
        
        for unit_data in units_data:
            unit = schemas.UnitCreate(
                project_id=created_project.id,
                **unit_data
            )
            created_unit = crud.create_unit(db, unit)
            print(f"✅ Created sample unit: {created_unit.unit_number}")
        
        print("\n✅ Sample data created successfully!")
        print("\n📋 Test Credentials:")
        print("   Builder:")
        print("   - Email: builder@test.com")
        print("   - Password: password123")
        print("\n   Customer:")
        print("   - Email: customer@test.com")
        print("   - Password: password123")
        
    except Exception as e:
        print(f"❌ Error creating sample data: {e}")
        db.rollback()
    finally:
        db.close()


def main():
    """Main function to initialize database."""
    print("=" * 60)
    print("🏗️  RealEstate Database Initialization")
    print("=" * 60)
    
    # Create tables
    create_tables()
    
    # Ask user if they want to create sample data
    print("\n" + "=" * 60)
    response = input("Do you want to create sample data for testing? (y/n): ").lower().strip()
    
    if response in ['y', 'yes']:
        create_sample_data()
    else:
        print("Skipping sample data creation.")
    
    print("\n" + "=" * 60)
    print("✅ Database initialization complete!")
    print("=" * 60)
    print("\n📚 Next steps:")
    print("   1. Run the FastAPI server: uvicorn database.main:app --reload")
    print("   2. Access API docs: http://localhost:8000/api/docs")
    print("   3. Test authentication endpoints")
    print("=" * 60)


if __name__ == "__main__":
    main()
