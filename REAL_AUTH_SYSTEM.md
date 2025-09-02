# AyurSutra - Real Authentication System

## 🔐 Complete Backend Integration

The application now uses **real MongoDB database** with persistent user data and authentication.

## 🚀 How to Use the System

### 1. **Start the Backend Server**
```bash
cd backend
npm run dev
```
The server will run on `http://localhost:8000`

### 2. **Start the Frontend**
```bash
npm start
```
The frontend will run on `http://localhost:3000`

## 👥 User Registration & Login

### **For Patients:**
1. Go to `/signup` page
2. Select "Patient" user type
3. Fill in required information:
   - Name, Email, Password
   - Phone, Address, Date of Birth, Gender, Age
   - Medical History (optional)
   - Allergies (optional)
   - Current Medications (optional)
   - Emergency Contact (optional)
4. Click "Create Patient Account"
5. You'll be automatically logged in and redirected to patient dashboard

### **For Practitioners:**
1. Go to `/signup` page
2. Select "Practitioner" user type
3. Fill in required information:
   - Name, Email, Password
   - Phone, Address
   - Specialization (required)
   - Experience in years (required)
   - Qualification (required)
   - License Number (required)
   - Consultation Fee (optional, defaults to ₹1000)
4. Click "Create Practitioner Account"
5. You'll be automatically logged in and redirected to practitioner dashboard

### **Login Process:**
1. Go to `/login` page
2. Select your user type (Patient/Practitioner/Admin)
3. Enter your registered email and password
4. Click "Sign in"
5. You'll be redirected to your appropriate dashboard

## 💾 Real Data Persistence

### **What Gets Saved:**
- ✅ User profiles with all details
- ✅ Login sessions with JWT tokens
- ✅ Last login timestamps
- ✅ User preferences and settings
- ✅ Medical history for patients
- ✅ Professional details for practitioners

### **Real-time Features:**
- ✅ Secure password hashing with bcrypt
- ✅ JWT token-based authentication
- ✅ Protected routes based on user roles
- ✅ Session persistence across browser refreshes
- ✅ Automatic logout on token expiration
- ✅ User profile updates saved to database

## 🔧 Database Schema

### **Patient Fields:**
- Personal: name, email, phone, address, age, gender, dateOfBirth
- Medical: medicalHistory[], allergies[], currentMedications[]
- Emergency: emergencyContact{name, phone, relationship}

### **Practitioner Fields:**
- Personal: name, email, phone, address
- Professional: specialization, experience, qualification, licenseNumber
- Business: consultationFee, rating, totalRatings
- Schedule: availability[] with time slots

### **Common Fields:**
- Authentication: password (hashed), role, isActive
- Tracking: createdAt, updatedAt, lastLogin
- Profile: profileImage

## 🛡️ Security Features

- ✅ Password hashing with bcrypt (12 rounds)
- ✅ JWT token authentication
- ✅ Input validation and sanitization
- ✅ Rate limiting on API endpoints
- ✅ XSS protection
- ✅ MongoDB injection prevention
- ✅ Role-based access control

## 📱 Dashboard Features

### **Patient Dashboard:**
- View upcoming appointments
- Book new sessions
- Track treatment progress
- View medical history
- Submit feedback

### **Practitioner Dashboard:**
- View patient appointments
- Manage availability
- View patient details
- Track earnings and statistics

## 🔄 Next Steps

1. **Register as a Patient or Practitioner**
2. **Login with your credentials**
3. **Explore the dashboard features**
4. **Book appointments (patients)**
5. **Manage practice (practitioners)**

The system is now fully functional with real user data, MongoDB persistence, and secure authentication!