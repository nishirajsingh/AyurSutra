import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Landing from './pages/Landing';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Pricing from './pages/Pricing';
import PatientDashboard from './pages/PatientDashboard';
import PractitionerDashboard from './pages/PractitionerDashboard';
import PractitionerSignup from './pages/PractitionerSignup';
import AdminDashboard from './pages/AdminDashboard';
import Booking from './pages/Booking';
import Feedback from './pages/Feedback';
import GoogleAuthSuccess from './pages/GoogleAuthSuccess';
import CompleteProfile from './pages/CompleteProfile';

function App() {
  return (
    <AuthProvider>
      <Router future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
        <div className="App">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/patient" element={
              <ProtectedRoute requiredRole="patient">
                <PatientDashboard />
              </ProtectedRoute>
            } />
            <Route path="/practitioner" element={
              <ProtectedRoute requiredRole="practitioner">
                <PractitionerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/practitioner/signup" element={<PractitionerSignup />} />
            <Route path="/admin" element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/booking" element={
              <ProtectedRoute>
                <Booking />
              </ProtectedRoute>
            } />
            <Route path="/feedback" element={
              <ProtectedRoute>
                <Feedback />
              </ProtectedRoute>
            } />
            <Route path="/auth/google/success" element={<GoogleAuthSuccess />} />
            <Route path="/complete-profile" element={
              <ProtectedRoute>
                <CompleteProfile />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;