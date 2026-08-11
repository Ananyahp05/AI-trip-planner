import React from 'react';
import { useTripContext } from '../context/TripContext';
import { Navigate } from 'react-router-dom';
import LocalGuide from '../components/LocalGuide';

const GuidePage = () => {
  const { tripData } = useTripContext();

  if (!tripData) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/20">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🌐 Destination Guide & Insights Dashboard
        </h1>
        <p className="text-gray-600 text-sm">
          Everything you need to know about weather, currency, safety, transit, and local culture for {tripData.trip_details.destination}.
        </p>
      </div>

      <LocalGuide localGuide={tripData.local_guide} destination={tripData.trip_details.destination} />
    </div>
  );
};

export default GuidePage;
