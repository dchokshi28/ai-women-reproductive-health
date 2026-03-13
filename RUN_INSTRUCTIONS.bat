@echo off
echo ========================================
echo   HerHealth AI - Quick Run
echo ========================================
echo.
echo IMPORTANT: Your disk is full!
echo.
echo To run this project, you need to:
echo.
echo 1. Free up disk space (at least 2GB recommended)
echo 2. Install PostgreSQL if not installed
echo 3. Create database: womens_health_db
echo.
echo Then run these commands manually:
echo.
echo === Backend ===
echo cd new_backend
echo python -m venv venv
echo venv\Scripts\activate
echo pip install -r requirements.txt
echo python init_db.py
echo uvicorn main:app --reload --port 8000
echo.
echo === Frontend ===
echo cd new_frontend
echo npm install
echo npm run dev
echo.
echo ========================================
echo.
pause
