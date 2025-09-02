# Google OAuth Setup Guide for AyurSutra

## 🔐 Google OAuth Integration Complete!

The application now supports **"Continue with Google"** functionality for both login and registration.

## 🚀 Setup Instructions

### 1. **Get Google OAuth Credentials**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set Application type to "Web application"
6. Add Authorized redirect URIs:
   - `http://localhost:8000/api/auth/google/callback`
   - `http://localhost:3000/auth/google/success`

### 2. **Update Environment Variables**

Edit `backend/.env` file:
```env
GOOGLE_CLIENT_ID=your_actual_google_client_id_here
GOOGLE_CLIENT_SECRET=your_actual_google_client_secret_here
```

### 3. **Start the Application**

```bash
# Start Backend
cd backend
npm run dev

# Start Frontend (in another terminal)
cd ..
npm start
```

## 🎯 How Google OAuth Works

### **User Flow:**
1. User clicks "Continue with Google" on login/signup page
2. Redirected to Google OAuth consent screen
3. After approval, Google redirects to backend callback
4. Backend creates/finds user and generates JWT token
5. User redirected to frontend with token
6. If new user, prompted to complete profile
7. Redirected to appropriate dashboard

### **Features:**
- ✅ **Automatic Account Creation**: New users automatically get accounts
- ✅ **Account Linking**: Existing email users get Google linked
- ✅ **Profile Completion**: Missing info collected after OAuth
- ✅ **Role Selection**: Users choose Patient/Practitioner role
- ✅ **Secure Authentication**: JWT tokens for session management

## 📱 User Experience

### **For New Users:**
1. Click "Continue with Google"
2. Authorize with Google
3. Complete profile (phone, role, etc.)
4. Access dashboard

### **For Existing Users:**
1. Click "Continue with Google"
2. Automatic login if email matches
3. Direct access to dashboard

## 🔧 Technical Implementation

### **Backend Components:**
- `src/config/passport.js` - Google OAuth strategy
- `src/controllers/authController.js` - OAuth handlers
- `src/routes/auth.js` - OAuth routes
- `src/models/User.js` - Updated with googleId field

### **Frontend Components:**
- `pages/GoogleAuthSuccess.js` - OAuth callback handler
- `pages/CompleteProfile.js` - Profile completion form
- Updated Login/SignUp pages with Google buttons

### **Database Changes:**
- Added `googleId` field to User model
- Made `password` optional for OAuth users
- Made `phone` optional for OAuth users (collected later)

## 🛡️ Security Features

- ✅ **Secure OAuth Flow**: Standard OAuth 2.0 implementation
- ✅ **JWT Integration**: Seamless token-based auth
- ✅ **Account Protection**: Prevents duplicate accounts
- ✅ **Session Management**: Proper login/logout handling

## 🎨 UI/UX Features

- ✅ **Consistent Design**: Matches app's Ayurveda theme
- ✅ **Loading States**: Smooth transitions during OAuth
- ✅ **Error Handling**: User-friendly error messages
- ✅ **Mobile Responsive**: Works on all devices

The Google OAuth integration is now complete and ready for use!