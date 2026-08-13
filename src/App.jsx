import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import PlannerPage from './pages/PlannerPage';
import ItineraryPage from './pages/ItineraryPage';
import MapPage from './pages/MapPage';
import PackingPage from './pages/PackingPage';
import GuidePage from './pages/GuidePage';
import BudgetPage from './pages/BudgetPage';
import PlacesPage from './pages/PlacesPage';
import SavedTripsPage from './pages/SavedTripsPage';

function App() {
  return (
    <Routes>
      {/* Root route redirects to Auth page */}
      <Route path="/" element={<Navigate to="/auth" replace />} />

      {/* Public Sign In / Sign Up Route */}
      <Route path="/auth" element={<AuthPage />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        {/* Standalone Full-Screen "Plan Your Journey" Page */}
        <Route path="/plan" element={<PlannerPage />} />

        {/* Dashboard Pages Layout (with Sidebar Navigation) */}
        <Route element={<DashboardLayout />}>
          <Route path="/itinerary" element={<ItineraryPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/packing" element={<PackingPage />} />
          <Route path="/guide" element={<GuidePage />} />
          <Route path="/budget" element={<BudgetPage />} />
          <Route path="/places" element={<PlacesPage />} />
          <Route path="/history" element={<SavedTripsPage />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/auth" replace />} />
    </Routes>
  );
}

export default App;
