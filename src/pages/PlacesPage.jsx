import React from 'react';
import { useTripContext } from '../context/TripContext';
import { Navigate } from 'react-router-dom';
import { MapPin, ExternalLink, Info, Star } from 'lucide-react';

const PlacesPage = () => {
  const { tripData } = useTripContext();

  if (!tripData) {
    return <Navigate to="/" replace />;
  }

  const { places, trip_details } = tripData;

  const getGoogleMapsUrl = (query) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query || trip_details.destination)}`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/20">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <MapPin className="text-red-600" /> Must-Visit Places & Attractions Dashboard
        </h1>
        <p className="text-gray-600 text-sm">
          Top recommended spots, landmarks, and highlights for {trip_details.destination}.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {places.map((place, index) => (
          <div key={index} className="bg-white/90 backdrop-blur-md border border-white/30 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between p-6">
            <div>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full mb-2">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> Top Highlight
                  </span>
                  <h3 className="text-2xl font-bold text-gray-900">{place.name}</h3>
                </div>
                <a
                  href={getGoogleMapsUrl(place.google_maps_query || `${place.name} ${trip_details.destination}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100"
                >
                  Map <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">{place.description}</p>
              
              {place.specifications && (
                <div className="bg-slate-50 p-4 rounded-xl text-sm text-gray-700 flex gap-3 border border-slate-200">
                  <Info className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-gray-900 block mb-0.5">Visitor Specs & Guidelines:</span>
                    <span>{place.specifications}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlacesPage;
