import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { LocationProvider } from './contexts/LocationContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import EnergyFlow from './pages/EnergyFlow';
import BatteryManagement from './pages/BatteryManagement';
import LoadManagement from './pages/LoadManagement';
import Forecast from './pages/Forecast';
import Settings from './pages/Settings';
import Developer from './pages/Developer';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LocationProvider>
          <Router>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="energy-flow" element={<EnergyFlow />} />
                  <Route path="battery" element={<BatteryManagement />} />
                  <Route path="load" element={<LoadManagement />} />
                  <Route path="forecast" element={<Forecast />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="developer" element={<Developer />} />
                </Route>
              </Routes>
            </div>
          </Router>
        </LocationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App; 