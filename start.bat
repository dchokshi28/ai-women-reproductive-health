@echo off
echo Starting Women's AI Health App...
echo.

echo Starting Flask Backend...
start cmd /k "cd backend && python main.py"

timeout /t 3 /nobreak > nul

echo Starting React Frontend...
start cmd /k "cd frontend && npm run dev"

echo.
echo Both servers are starting!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
pause
