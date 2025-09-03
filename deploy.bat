@echo off
echo Deploying AyurSutra to Vercel...
echo.

echo Installing dependencies...
npm install
cd backend
npm install
cd ..

echo.
echo Building application...
npm run build

echo.
echo Deploying to Vercel...
vercel --prod

echo.
echo Deployment complete!
echo Don't forget to update environment variables in Vercel dashboard.
pause