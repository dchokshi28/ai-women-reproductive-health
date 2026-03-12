@echo off
echo ========================================
echo   HerHealth AI - Initial Setup
echo ========================================
echo.

echo Step 1: Setting up Backend...
echo.
cd new_backend

echo Creating virtual environment...
python -m venv venv

echo Activating virtual environment...
call venv\Scripts\activate

echo Installing Python dependencies...
pip install -r requirements.txt

echo.
echo Creating .env file...
if not exist .env (
    copy .env.example .env
    echo ✓ .env file created. Please edit it with your credentials.
) else (
    echo ✓ .env file already exists
)

echo.
echo Training ML models...
cd app\ml_models
python train_models.py
cd ..\..

echo.
echo Initializing database...
python init_db.py

cd ..

echo.
echo ========================================
echo Step 2: Setting up Frontend...
echo ========================================
echo.
cd new_frontend

echo Installing Node dependencies...
call npm install

cd ..

echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Edit new_backend\.env with your database credentials
echo 2. Ensure PostgreSQL is running
echo 3. Run start_new.bat to start the application
echo.
echo Demo credentials:
echo   Email: demo@herhealth.ai
echo   Password: demo123
echo.
pause
