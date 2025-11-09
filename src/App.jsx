import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Features from './pages/Features';
import HowItWorks from './pages/HowItWorks';
import JobListings from './pages/JobListings';
import MentorshipHub from './pages/MentorshipHub';
import Entrepreneurs from './pages/Entrepreneurs';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import StudentDashboard from './pages/student/StudentDashboard';
import AlumniDashboard from './pages/alumni/AlumniDashboard';

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // Redirect to appropriate dashboard based on role
    switch (user.role) {
      case 'Student':
        return <Navigate to="/student/dashboard" replace />;
      case 'Alumni':
        return <Navigate to="/alumni/dashboard" replace />;
      case 'Admin':
        return <Navigate to="/admin/dashboard" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return children;
};

function AppContent() {
  const location = useLocation();
  const { user } = useAuth();
  
  // Hide header for all dashboard routes
  const showHeader = !location.pathname.includes('/dashboard');

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {showHeader && <Header />}
      <AnimatePresence mode="wait">
        <main className="flex-1">
          <Routes location={location}>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/features" element={<Features />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/jobs" element={<JobListings />} />
            <Route path="/mentorship" element={<MentorshipHub />} />
            <Route path="/entrepreneurs" element={<Entrepreneurs />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Protected Dashboard Routes */}
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute requiredRole="Admin">
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/student/dashboard" 
              element={
                <ProtectedRoute requiredRole="Student">
                  <StudentDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/alumni/dashboard" 
              element={
                <ProtectedRoute requiredRole="Alumni">
                  <AlumniDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Redirect root dashboard to appropriate dashboard based on role */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  {user?.role === 'Student' && <Navigate to="/student/dashboard" replace />}
                  {user?.role === 'Alumni' && <Navigate to="/alumni/dashboard" replace />}
                  {user?.role === 'Admin' && <Navigate to="/admin/dashboard" replace />}
                  {!user && <Navigate to="/login" replace />}
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
      </AnimatePresence>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;