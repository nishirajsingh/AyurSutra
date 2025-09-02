@echo off
echo Starting AyurSutra Backend...
echo.

echo Checking if MongoDB is running...
tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I /N "mongod.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo MongoDB is running.
) else (
    echo MongoDB is not running. Please start MongoDB first.
    echo You can start MongoDB with: net start MongoDB
    pause
    exit /b 1
)

cd backend

echo Installing dependencies...
npm install

echo Seeding database with initial data...
npm run seed

echo Starting backend server...
npm run dev

pause