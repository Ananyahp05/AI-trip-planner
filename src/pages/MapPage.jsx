import React from 'react';
import { useTripContext } from '../context/TripContext';
import { Navigate } from 'react-router-dom';
import MapContainer from '../components/MapContainer';

const MapPage = () => {
  const { tripData } = useTripContext();

  if (!tripData) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/20">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🗺️ Interactive Map Dashboard
        </h1>
        <p className="text-gray-600 text-sm">
          Visualize all locations, en-route stops, and daily itinerary activities for {tripData.trip_details.destination}.
        </p>
      </div>

      <MapContainer data={tripData} />
    </div>
  );
};

export default MapPage;
