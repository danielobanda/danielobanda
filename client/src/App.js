import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';

import { selectIsAuthenticated, selectCurrentUser } from './store/slices/authSlice';

// Layout Components
import Layout from './components/Layout/Layout';
import PublicLayout from './components/Layout/PublicLayout';

// Auth Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';

// Dashboard Pages
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import TeacherDashboard from './pages/Dashboard/TeacherDashboard';
import StudentDashboard from './pages/Dashboard/StudentDashboard';
import ParentDashboard from './pages/Dashboard/ParentDashboard';

// Feature Pages
import Students from './pages/Students/Students';
import StudentProfile from './pages/Students/StudentProfile';
import Teachers from './pages/Teachers/Teachers';
import Classes from './pages/Classes/Classes';
import Subjects from './pages/Subjects/Subjects';
import Attendance from './pages/Attendance/Attendance';
import Grades from './pages/Grades/Grades';
import Reports from './pages/Reports/Reports';
import Settings from './pages/Settings/Settings';
import Profile from './pages/Profile/Profile';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

// Public Route Component (redirect if authenticated)
const PublicRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

// Dashboard Route based on user role
const DashboardRoute = () => {
  const user = useSelector(selectCurrentUser);
  
  switch (user?.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'teacher':
      return <TeacherDashboard />;
    case 'student':
      return <StudentDashboard />;
    case 'parent':
      return <ParentDashboard />;
    default:
      return <Navigate to="/login" replace />;
  }
};

function App() {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    // Set up theme
    const savedTheme = localStorage.getItem('sms-theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  return (
    <Router>
      <div className="App min-h-screen bg-secondary-50">
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <PublicLayout>
                  <Login />
                </PublicLayout>
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <PublicLayout>
                  <Register />
                </PublicLayout>
              </PublicRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicRoute>
                <PublicLayout>
                  <ForgotPassword />
                </PublicLayout>
              </PublicRoute>
            }
          />
          <Route
            path="/reset-password/:token"
            element={
              <PublicRoute>
                <PublicLayout>
                  <ResetPassword />
                </PublicLayout>
              </PublicRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <DashboardRoute />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Admin/Teacher Only Routes */}
          <Route
            path="/students"
            element={
              <ProtectedRoute allowedRoles={['admin', 'teacher']}>
                <Layout>
                  <Students />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/students/:id"
            element={
              <ProtectedRoute allowedRoles={['admin', 'teacher']}>
                <Layout>
                  <StudentProfile />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/teachers"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout>
                  <Teachers />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/classes"
            element={
              <ProtectedRoute allowedRoles={['admin', 'teacher']}>
                <Layout>
                  <Classes />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/subjects"
            element={
              <ProtectedRoute allowedRoles={['admin', 'teacher']}>
                <Layout>
                  <Subjects />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/attendance"
            element={
              <ProtectedRoute allowedRoles={['admin', 'teacher', 'student', 'parent']}>
                <Layout>
                  <Attendance />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/grades"
            element={
              <ProtectedRoute allowedRoles={['admin', 'teacher', 'student', 'parent']}>
                <Layout>
                  <Grades />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/reports"
            element={
              <ProtectedRoute allowedRoles={['admin', 'teacher']}>
                <Layout>
                  <Reports />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout>
                  <Settings />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Redirect root to dashboard or login */}
          <Route
            path="/"
            element={
              isAuthenticated ? 
                <Navigate to="/dashboard" replace /> : 
                <Navigate to="/login" replace />
            }
          />

          {/* 404 and Unauthorized */}
          <Route
            path="/unauthorized"
            element={
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-danger-600 mb-4">403</h1>
                  <p className="text-lg text-secondary-600 mb-6">Unauthorized Access</p>
                  <p className="text-secondary-500 mb-8">
                    You don't have permission to access this page.
                  </p>
                  <button
                    onClick={() => window.history.back()}
                    className="btn-primary"
                  >
                    Go Back
                  </button>
                </div>
              </div>
            }
          />

          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-secondary-900 mb-4">404</h1>
                  <p className="text-lg text-secondary-600 mb-6">Page Not Found</p>
                  <p className="text-secondary-500 mb-8">
                    The page you're looking for doesn't exist.
                  </p>
                  <button
                    onClick={() => window.history.back()}
                    className="btn-primary"
                  >
                    Go Back
                  </button>
                </div>
              </div>
            }
          />
        </Routes>

        {/* Global Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#ffffff',
              color: '#1f2937',
              border: '1px solid #e5e7eb',
              borderRadius: '0.75rem',
              fontSize: '14px',
              padding: '12px 16px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#ffffff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#ffffff',
              },
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;