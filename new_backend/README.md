# HerHealth AI - Women's Health Tracker

## 🚀 New Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **PostgreSQL** - Relational database
- **SQLAlchemy** - ORM
- **JWT Authentication** - Secure token-based auth

### ML & AI
- **XGBoost** - Gradient boosting
- **Random Forest** - Ensemble learning
- **Logistic Regression** - Classification
- **LangChain** - AI agent for health insights

### Frontend
- **React** - UI library
- **Tailwind CSS** - Styling
- **Chart.js** - Data visualization
- **Axios** - HTTP client

### Notifications
- **Firebase** - Push notifications
- **SMTP Email** - Email notifications

---

## 📋 Prerequisites

- Python 3.9+
- Node.js 16+
- PostgreSQL 14+
- OpenAI API Key (optional, for LangChain)

---

## 🛠️ Setup Instructions

### 1. Database Setup

```bash
# Install PostgreSQL and create database
psql -U postgres
CREATE DATABASE womens_health_db;
\q
```

### 2. Backend Setup

```bash
cd new_backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
copy .env.example .env
# Edit .env with your database credentials and API keys

# Train ML models
cd app/ml_models
python train_models.py
cd ../..

# Run FastAPI server
uvicorn main:app --reload --port 8000
```

Backend will run on: **http://localhost:8000**

API Docs: **http://localhost:8000/docs**

### 3. Frontend Setup

```bash
cd new_frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend will run on: **http://localhost:3000**

---

## 🔑 Environment Variables

### Backend (.env)

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/womens_health_db
SECRET_KEY=your-secret-key-change-this
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Optional: For AI features
OPENAI_API_KEY=sk-your-openai-key

# Optional: For Firebase notifications
FIREBASE_CREDENTIALS_PATH=./firebase-credentials.json

# Optional: For email notifications
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=your-email@gmail.com
```

---

## 📁 Project Structure

```
new_backend/
├── app/
│   ├── config/          # Configuration
│   ├── database/        # Database connection
│   ├── models/          # SQLAlchemy models & Pydantic schemas
│   ├── routes/          # API endpoints
│   ├── services/        # Business logic (ML, AI, Auth, Email, Firebase)
│   └── ml_models/       # Trained ML models
├── main.py              # FastAPI app entry point
└── requirements.txt     # Python dependencies

new_frontend/
├── src/
│   ├── components/      # Reusable components
│   ├── context/         # React context (Auth)
│   ├── pages/           # Page components
│   ├── services/        # API service layer
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── package.json         # Node dependencies
└── vite.config.js       # Vite configuration
```

---

## 🎯 Features

### ✅ Implemented
- User authentication (signup/login with JWT)
- Cycle logging with ML predictions
- Ensemble ML models (XGBoost + Random Forest + Logistic Regression)
- AI health insights using LangChain
- Educational posts from doctors
- Health quiz with score tracking
- Community chat
- User profile management
- Subscription tiers
- Chart.js visualizations
- Email notifications
- Firebase push notifications (setup required)

### 🔄 API Endpoints

**Authentication**
- POST `/api/auth/signup` - Create account
- POST `/api/auth/login` - Login

**Cycles**
- POST `/api/cycles/` - Log cycle
- GET `/api/cycles/` - Get user cycles
- POST `/api/cycles/predict` - Get ML prediction

**Posts**
- GET `/api/posts/` - Get educational posts

**Quiz**
- GET `/api/quiz/questions` - Get quiz questions
- POST `/api/quiz/submit` - Submit quiz score

**Chat**
- GET `/api/chat/messages` - Get messages
- POST `/api/chat/messages` - Send message

**User**
- GET `/api/user/profile` - Get profile
- PUT `/api/user/profile` - Update profile
- POST `/api/user/subscription` - Update subscription

**AI Agent**
- POST `/api/ai/ask` - Ask health question

---

## 🚀 Quick Start (Development)

### Terminal 1 - Backend
```bash
cd new_backend
venv\Scripts\activate
uvicorn main:app --reload --port 8000
```

### Terminal 2 - Frontend
```bash
cd new_frontend
npm run dev
```

Open browser: **http://localhost:3000**

---

## 📊 ML Models

The system uses an ensemble of three models:

1. **XGBoost** - High accuracy gradient boosting
2. **Random Forest** - Robust ensemble method
3. **Logistic Regression** - Fast baseline model

Predictions use majority voting for final classification:
- **0**: Normal Cycle
- **1**: Possible Irregularity
- **2**: High Risk - Consult Doctor

---

## 🤖 AI Agent (LangChain)

Set `OPENAI_API_KEY` in `.env` to enable:
- Personalized health insights
- Natural language health Q&A
- Context-aware recommendations

---

## 🔔 Notifications

### Email
Configure SMTP settings in `.env` for:
- Welcome emails
- Cycle reminders

### Firebase
1. Create Firebase project
2. Download `firebase-credentials.json`
3. Set path in `.env`

---

## 🏗️ Production Deployment

### Backend
```bash
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
```

### Frontend
```bash
npm run build
# Serve dist/ folder with nginx or similar
```

---

## 🐛 Troubleshooting

**Database connection error:**
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env

**ML models not found:**
- Run `python app/ml_models/train_models.py`

**CORS errors:**
- Check frontend URL in FastAPI CORS middleware

**Port already in use:**
- Change port in vite.config.js or uvicorn command

---

## 📝 License

MIT License

---

## 👥 Support

For issues or questions, please open a GitHub issue.

---

**Built with ❤️ for women's health**
