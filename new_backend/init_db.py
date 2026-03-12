"""
Database initialization script
Run this to create all tables and seed initial data
"""
from app.database.database import engine, Base, SessionLocal
from app.models.models import User, Post
from app.services.auth import get_password_hash
from datetime import datetime

def init_db():
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✓ Tables created successfully")
    
    db = SessionLocal()
    
    # Check if posts already exist
    existing_posts = db.query(Post).first()
    if not existing_posts:
        print("\nSeeding initial posts...")
        posts = [
            Post(
                doctor_name="Dr. Sarah Jenkins",
                verified=True,
                profile_image="https://i.pravatar.cc/150?img=1",
                title="Understanding PCOS",
                content="Polycystic ovary syndrome (PCOS) is a common hormonal disorder among women of reproductive age. Symptoms include irregular periods and excess androgen levels. Early diagnosis is key.",
                likes=124,
                comments=15
            ),
            Post(
                doctor_name="Dr. Emily Chen",
                verified=True,
                profile_image="https://i.pravatar.cc/150?img=5",
                title="Nutrition for Hormonal Balance",
                content="A balanced diet rich in Omega-3 fatty acids, leafy greens, and lean proteins can significantly impact hormonal stability throughout your cycle.",
                likes=89,
                comments=7
            ),
            Post(
                doctor_name="Dr. Ayesha Rahman",
                verified=True,
                profile_image="https://i.pravatar.cc/150?img=9",
                title="Debunking Menstruation Myths",
                content="There are many myths surrounding menstruation. Exercise is actually beneficial during your period, contrary to popular belief, as it can help relieve cramps.",
                likes=210,
                comments=42
            )
        ]
        
        for post in posts:
            db.add(post)
        
        db.commit()
        print("✓ Posts seeded successfully")
    else:
        print("\n✓ Posts already exist, skipping seed")
    
    # Create demo user
    existing_user = db.query(User).filter(User.email == "demo@herhealth.ai").first()
    if not existing_user:
        print("\nCreating demo user...")
        demo_user = User(
            email="demo@herhealth.ai",
            username="demo_user",
            hashed_password=get_password_hash("demo123"),
            full_name="Demo User",
            age=28,
            subscription_tier="free"
        )
        db.add(demo_user)
        db.commit()
        print("✓ Demo user created")
        print("  Email: demo@herhealth.ai")
        print("  Password: demo123")
    else:
        print("\n✓ Demo user already exists")
    
    db.close()
    print("\n" + "="*50)
    print("Database initialization complete!")
    print("="*50)

if __name__ == "__main__":
    init_db()
