@echo off
echo ========================================
echo   HerHealth AI - Starting Application
echo ========================================
echo.

echo [1/2] Starting FastAPI Backend...
start cmd /k "cd new_backend && venv\Scripts\activate && uvicorn main:app --reload --port 8000"

timeout /t 3 /nobreak >nul

echo [2/2] Starting React Frontend...
start cmd /k "cd new_frontend && npm run dev"

echo.
echo ========================================
echo   Application Started Successfully!
echo ========================================
echo.
echo Backend API: http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit this window...
pause >nul
