import React from 'react';
import { useTripContext } from '../context/TripContext';
import { useNavigate } from 'react-router-dom';
import { History, Trash2, MapPin, Calendar, ArrowRight } from 'lucide-react';

const SavedTripsPage = () => {
  const { savedTrips, setActiveTripData, deleteSavedTrip, clearAllSavedTrips } = useTripContext();
  const navigate = useNavigate();

  const handleLoadTrip = (data) => {
    setActiveTripData(data);
    navigate('/itinerary');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1 flex items-center gap-2">
            <History className="text-amber-500" /> Saved Trips History
          </h1>
          <p className="text-gray-600 text-sm">
            Access and load previously created travel itineraries anytime.
          </p>
        </div>
        {savedTrips.length > 0 && (
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to delete all saved trip history?")) {
                clearAllSavedTrips();
              }
            }}
            className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-xl border border-red-200 flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-4 h-4" /> Clear All History
          </button>
        )}
      </div>

      {savedTrips.length === 0 ? (
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-12 text-center shadow-xl border border-white/20">
          <History className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">No Saved Trips Found</h3>
          <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
            Generate a trip plan using the trip planner form to save your itinerary history here automatically!
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-sm rounded-xl shadow-lg hover:from-amber-600 hover:to-orange-700 transition-all"
          >
            + Create New Trip
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedTrips.map((trip) => {
            const details = trip.data.trip_details;
            return (
              <div
                key={trip.id}
                className="bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-indigo-600" />
                      {details.origin} <ArrowRight className="w-4 h-4 text-gray-400 inline" /> {details.destination}
                    </h3>
                    <button
                      onClick={() => deleteSavedTrip(trip.id)}
                      className="text-gray-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                      title="Delete Trip"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-gray-500 flex items-center gap-1 mb-4">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" /> {details.dates || 'Planned Trip'}
                  </p>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs font-bold px-2.5 py-1 bg-amber-100 text-amber-800 rounded-lg">
                      Budget: {trip.data.budget || 'Custom'}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg">
                      Duration: {details.duration}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleLoadTrip(trip.data)}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow transition-all"
                >
                  Open Trip Dashboard <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SavedTripsPage;
