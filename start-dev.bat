@echo off
echo Starting AyurSutra Development Environment...
echo.

echo Checking if backend is running...
curl -s http://localhost:8000/api/test >nul 2>&1
if %errorlevel% neq 0 (
    echo Backend not running. Starting backend server...
    start "Backend Server" cmd /k "cd backend && npm start"
    echo Waiting for backend to start...
    timeout /t 5 /nobreak > nul
) else (
    echo Backend is already running!
)

echo.
echo Starting frontend...
start "Frontend" cmd /k "npm start"

echo.
echo Development environment started!
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo API: http://localhost:8000/api
pause