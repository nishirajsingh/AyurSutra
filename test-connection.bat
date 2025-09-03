@echo off
echo Testing AyurSutra API Connection...
echo.

echo Starting backend server...
start "Backend Server" cmd /k "cd backend && npm start"

timeout /t 5 /nobreak > nul

echo.
echo Testing API endpoints...
curl -s http://localhost:8000/health
echo.
echo.
curl -s http://localhost:8000/api/test
echo.

echo.
echo Connection test complete!
echo Backend should be running on http://localhost:8000
echo API endpoints available at http://localhost:8000/api
pause