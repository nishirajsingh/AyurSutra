# Vercel Deployment Guide

## Prerequisites
1. Install Vercel CLI: `npm i -g vercel`
2. Create a Vercel account at https://vercel.com

## Deployment Steps

### 1. Environment Variables Setup
In your Vercel dashboard, add these environment variables:

```
MONGODB_URI=mongodb+srv://nishirajsingh2005_db_user:4acHpk3UkUwjdH0I@nishiraj.oobc3ow.mongodb.net/ayursutra?retryWrites=true&w=majority&appName=Nishiraj
SESSION_SECRET=your_secure_session_secret_here
JWT_SECRET=your_secure_jwt_secret_here
NODE_ENV=production
REACT_APP_API_URL=https://your-app-name.vercel.app/api
FRONTEND_URL=https://your-app-name.vercel.app
```

### 2. Deploy to Vercel

#### Option A: Using Vercel CLI
```bash
# Login to Vercel
vercel login

# Deploy from project root
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N
# - Project name: ayursutra-booking-system
# - Directory: ./
```

#### Option B: Using Git Integration
1. Push your code to GitHub
2. Go to Vercel dashboard
3. Click "New Project"
4. Import your GitHub repository
5. Configure build settings:
   - Framework Preset: Create React App
   - Build Command: `npm run vercel-build`
   - Output Directory: `build`
6. Add environment variables
7. Deploy

### 3. Post-Deployment
1. Update `REACT_APP_API_URL` in Vercel environment variables with your actual domain
2. Update `FRONTEND_URL` in Vercel environment variables
3. Redeploy to apply changes

### 4. Custom Domain (Optional)
1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Update DNS records as instructed

## Important Notes
- The app will be deployed as a full-stack application
- Backend API will be available at `/api/*` routes
- Frontend will be served from the root `/`
- MongoDB connection will work with the provided connection string
- Make sure to use strong secrets for SESSION_SECRET and JWT_SECRET in production

## Troubleshooting
- If deployment fails, check the build logs in Vercel dashboard
- Ensure all environment variables are set correctly
- Verify MongoDB connection string is accessible from Vercel's servers