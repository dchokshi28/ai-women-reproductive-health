# Women's AI Health App

## Quick Start

### Option 1: Use the Startup Script (Easiest)
1. Double-click `start.bat` in the project root
2. Two terminal windows will open (Backend and Frontend)
3. Wait for both to start
4. Open your browser to **http://localhost:3000**

### Option 2: Manual Start

#### Start Backend (Terminal 1):
```bash
cd backend
python main.py
```
Backend runs on: http://localhost:5000

#### Start Frontend (Terminal 2):
```bash
cd frontend
npm run dev
```
Frontend runs on: http://localhost:3000

## Project Structure
```
WOMENS_AI/
├── frontend/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── backend/           # Flask backend
│   ├── main.py
│   ├── routes/
│   ├── models/
│   └── services/
│
├── ml_models/         # ML models
│   ├── train_model.py
│   └── pcos_model.pkl
│
└── dataset/           # Training data
    └── menstrual_health_dataset.csv
```

## Features
- User Authentication (Login/Signup)
- Dashboard with health insights
- Cycle logging
- Educational posts from doctors
- Health quiz
- Community chat
- Subscription plans
- User profile

## Tech Stack
- Frontend: React + Vite + Tailwind CSS
- Backend: Flask + Python
- ML: XGBoost for health predictions

## Notes
- Make sure Python and Node.js are installed
- Backend must be running for full functionality
- First-time users: Sign up to create an account
