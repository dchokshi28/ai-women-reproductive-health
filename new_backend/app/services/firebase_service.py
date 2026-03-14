import firebase_admin
from firebase_admin import credentials, messaging
from app.config.config import settings
from pathlib import Path

class FirebaseNotificationService:
    def __init__(self):
        self.initialized = False
        try:
            if settings.FIREBASE_CREDENTIALS_PATH:
                cred_path = Path(settings.FIREBASE_CREDENTIALS_PATH)
                if cred_path.exists():
                    cred = credentials.Certificate(str(cred_path))
                    firebase_admin.initialize_app(cred)
                    self.initialized = True
        except Exception as e:
            print(f"Firebase initialization failed: {e}")
    
    def send_notification(self, token: str, title: str, body: str):
        if not self.initialized:
            print("Firebase not initialized")
            return False
        
        message = messaging.Message(
            notification=messaging.Notification(
                title=title,
                body=body,
            ),
            token=token,
        )
        
        try:
            response = messaging.send(message)
            print(f"Successfully sent message: {response}")
            return True
        except Exception as e:
            print(f"Error sending notification: {e}")
            return False
    
    def send_cycle_reminder(self, token: str, days_until: int):
        title = "Cycle Reminder"
        body = f"Your next period is expected in {days_until} days. Track your symptoms!"
        return self.send_notification(token, title, body)

firebase_service = FirebaseNotificationService()
