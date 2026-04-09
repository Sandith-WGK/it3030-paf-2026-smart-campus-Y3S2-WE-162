import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import AuthCallback from './pages/AuthCallback';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// A simple wrapper for private routes
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      
      {/* Protected Routes */}
      <Route 
        path="/dashboard" 
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/admin/users" 
        element={
          <PrivateRoute>
            <AdminDashboard />
          </PrivateRoute>
        } 
      />
      
      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
