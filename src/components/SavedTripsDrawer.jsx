import React from 'react';
import { X, History, Trash2, Calendar, MapPin, ArrowRight } from 'lucide-react';

const SavedTripsDrawer = ({ isOpen, onClose, savedTrips, onSelectTrip, onDeleteTrip, onClearAll }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-slate-900 to-indigo-900 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <History className="w-6 h-6 text-amber-400" />
              <h2 className="text-xl font-bold font-serif">Saved Itineraries</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/20 transition-colors text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {savedTrips.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <History className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p className="font-semibold text-lg">No Saved Trips Yet</p>
                <p className="text-sm mt-1 text-gray-400">Generate a trip plan and save it to access anytime!</p>
              </div>
            ) : (
              savedTrips.map((trip) => {
                const details = trip.data.trip_details;
                return (
                  <div
                    key={trip.id}
                    className="bg-slate-50 border border-slate-200 rounded-xl p-4 hover:border-indigo-400 hover:shadow-md transition-all group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-gray-900 text-base flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-indigo-600" />
                          {details.origin} <ArrowRight className="w-3.5 h-3.5 text-gray-400 inline" /> {details.destination}
                        </h3>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <Calendar className="w-3.5 h-3.5" /> {details.dates || 'Planned Trip'}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteTrip(trip.id);
                        }}
                        className="text-gray-400 hover:text-red-600 p-1 rounded transition-colors"
                        title="Delete Trip"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-slate-200 mt-3">
                      <span className="text-xs font-semibold px-2 py-0.5 bg-amber-100 text-amber-800 rounded">
                        {trip.data.budget || details.duration || 'Saved'}
                      </span>
                      <button
                        onClick={() => {
                          onSelectTrip(trip.data);
                          onClose();
                        }}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                      >
                        Load Trip <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {savedTrips.length > 0 && (
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
              <span className="text-xs text-gray-500 font-medium">{savedTrips.length} saved trips</span>
              <button
                onClick={onClearAll}
                className="text-xs text-red-600 hover:text-red-800 font-semibold flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear All History
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedTripsDrawer;
