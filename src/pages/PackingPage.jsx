import React from 'react';
import { useTripContext } from '../context/TripContext';
import { Navigate } from 'react-router-dom';
import PackingList from '../components/PackingList';

const PackingPage = () => {
  const { tripData } = useTripContext();

  if (!tripData) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/20">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🎒 Packing & Gear Dashboard
        </h1>
        <p className="text-gray-600 text-sm">
          Track your luggage packing progress for {tripData.trip_details.destination} with customized category checklists.
        </p>
      </div>

      <PackingList packingList={tripData.packing_list} />
    </div>
  );
};

export default PackingPage;
