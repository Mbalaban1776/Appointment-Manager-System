import React, { ReactElement } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Appointments from './pages/Appointments/Appointments';
import Layout from './components/layout/Layout';
import { useAuthStore } from './services/auth/authStore';

const ProtectedRoute = ({ children }: { children: ReactElement }) => {
  const token = useAuthStore((state) => state.token);
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="appointments" element={<Appointments />} />
      </Route>
    </Routes>
  );
};

export default App;
