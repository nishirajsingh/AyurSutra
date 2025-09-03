@echo off
echo Setting up AyurSutra Application...
echo.

echo Installing frontend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Failed to install frontend dependencies
    pause
    exit /b 1
)

echo Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo Failed to install backend dependencies
    pause
    exit /b 1
)

echo.
echo Checking for .env file...
if not exist .env (
    echo .env file not found! Creating from template...
    copy .env.example .env
    echo.
    echo IMPORTANT: Please edit backend/.env file with your configuration:
    echo - Set your MongoDB connection string
    echo - Generate secure JWT_SECRET and SESSION_SECRET
    echo.
    echo Opening .env file for editing...
    notepad .env
)

cd ..
echo.
echo Setup complete! 
echo.
echo To start the application:
echo 1. Start backend: cd backend && npm run dev
echo 2. Start frontend: npm start
echo.
pause