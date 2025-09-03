@echo off
echo Pushing AyurSutra to GitHub...
echo.

echo Initializing git repository...
git init

echo Adding all files...
git add .

echo Committing files...
git commit -m "Initial commit: AyurSutra Smart Appointment Booking System"

echo Setting main branch...
git branch -M main

echo Adding remote origin...
git remote add origin https://github.com/nishirajsingh/AyurSutra.git

echo Pushing to GitHub...
git push -u origin main

echo.
echo Successfully pushed to GitHub!
echo Repository: https://github.com/nishirajsingh/AyurSutra
pause