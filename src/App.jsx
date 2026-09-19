import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import { LeaveProvider } from './context/LeaveContext';
import { useAuth } from './hooks/useAuth';

import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

import Login from './pages/Login';
import EmployeeDashboard from './pages/EmployeeDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import ApplyLeave from './pages/ApplyLeave';
import LeaveHistory from './pages/LeaveHistory';
import LeaveBalance from './pages/LeaveBalance';
import LeaveDetails from './pages/LeaveDetails';
import LeaveRequests from './pages/LeaveRequests';
import Employees from './pages/Employees';
import Departments from './pages/Departments';
import Profile from './pages/Profile';

import './App.css';

const RoleAwareDashboard = () => {
  const { isManager } = useAuth();
  return isManager ? <ManagerDashboard /> : <EmployeeDashboard />;
};

const AppLayout = ({ children, title }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <div className="main-content-wrapper">
        <Header
          onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
          title={title}
        />
        <main className="page-body">
          {children}
        </main>
      </div>
    </div>
  );
};

export const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LeaveProvider>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <AppLayout title="Dashboard">
                    <RoleAwareDashboard />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/apply-leave"
              element={
                <ProtectedRoute allowedRoles={['employee']}>
                  <AppLayout title="Apply Leave">
                    <ApplyLeave />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/leave-history"
              element={
                <ProtectedRoute allowedRoles={['employee']}>
                  <AppLayout title="My Leave History">
                    <LeaveHistory />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/leave-balance"
              element={
                <ProtectedRoute allowedRoles={['employee']}>
                  <AppLayout title="Leave Balance">
                    <LeaveBalance />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/leave-requests"
              element={
                <ProtectedRoute allowedRoles={['manager']}>
                  <AppLayout title="Leave Requests">
                    <LeaveRequests />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/leave-requests/:id"
              element={
                <ProtectedRoute>
                  <AppLayout title="Leave Request Details">
                    <LeaveDetails />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/employees"
              element={
                <ProtectedRoute allowedRoles={['manager']}>
                  <AppLayout title="Employees">
                    <Employees />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/departments"
              element={
                <ProtectedRoute allowedRoles={['manager']}>
                  <AppLayout title="Departments">
                    <Departments />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <AppLayout title="My Profile">
                    <Profile />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </LeaveProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
