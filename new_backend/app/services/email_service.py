import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.config.config import settings

class EmailService:
    def __init__(self):
        self.smtp_host = settings.SMTP_HOST
        self.smtp_port = settings.SMTP_PORT
        self.smtp_user = settings.SMTP_USER
        self.smtp_password = settings.SMTP_PASSWORD
        self.email_from = settings.EMAIL_FROM
    
    def send_email(self, to_email: str, subject: str, body: str, html: bool = False):
        if not self.smtp_user or not self.smtp_password:
            print("Email service not configured")
            return False
        
        msg = MIMEMultipart('alternative')
        msg['From'] = self.email_from
        msg['To'] = to_email
        msg['Subject'] = subject
        
        if html:
            msg.attach(MIMEText(body, 'html'))
        else:
            msg.attach(MIMEText(body, 'plain'))
        
        try:
            with smtplib.SMTP(self.smtp_host, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_user, self.smtp_password)
                server.send_message(msg)
            print(f"Email sent to {to_email}")
            return True
        except Exception as e:
            print(f"Failed to send email: {e}")
            return False
    
    def send_welcome_email(self, to_email: str, username: str):
        subject = "Welcome to HerHealth AI!"
        body = f"""
        <html>
        <body>
            <h2>Welcome {username}!</h2>
            <p>Thank you for joining HerHealth AI. We're here to support your reproductive health journey.</p>
            <p>Start by logging your first cycle and get personalized insights!</p>
            <p>Best regards,<br>HerHealth AI Team</p>
        </body>
        </html>
        """
        return self.send_email(to_email, subject, body, html=True)
    
    def send_cycle_reminder(self, to_email: str, username: str, days_until: int):
        subject = "Cycle Reminder"
        body = f"""
        <html>
        <body>
            <h2>Hi {username},</h2>
            <p>Your next period is expected in approximately {days_until} days.</p>
            <p>Remember to track your symptoms and stay prepared!</p>
            <p>Best regards,<br>HerHealth AI Team</p>
        </body>
        </html>
        """
        return self.send_email(to_email, subject, body, html=True)

email_service = EmailService()
