import React from 'react';
import { useTripContext } from '../context/TripContext';
import { Navigate, Link } from 'react-router-dom';
import { Calendar, Clock, Navigation, ExternalLink, Plane, Hotel, MapPin, Sparkles } from 'lucide-react';

const ItineraryPage = () => {
  const { tripData } = useTripContext();

  if (!tripData) {
    return <Navigate to="/" replace />;
  }

  const { trip_details, en_route_stops, itinerary } = tripData;

  const getGoogleMapsUrl = (query) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query || trip_details.destination)}`;
  };

  const getHotelSearchUrl = (location) => {
    return `https://www.google.com/travel/hotels?q=${encodeURIComponent(location || trip_details.destination)}`;
  };

  const getFlightSearchUrl = (origin, destination) => {
    return `https://www.google.com/travel/flights?q=flights+from+${encodeURIComponent(origin)}+to+${encodeURIComponent(destination)}`;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Overview Banner */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-bold rounded-full uppercase tracking-wide">
            Overview & Schedule
          </span>
          <h1 className="text-3xl font-bold text-gray-900 mt-2 mb-1">
            {trip_details.origin} <span className="text-indigo-500">→</span> {trip_details.destination}
          </h1>
          <p className="text-gray-600 text-sm font-medium flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-600" /> {trip_details.dates} ({trip_details.duration})
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <a
            href={getFlightSearchUrl(trip_details.origin, trip_details.destination)}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl border border-indigo-200 flex items-center gap-1.5 transition-colors"
          >
            <Plane className="w-4 h-4" /> Book Flights
          </a>
          <a
            href={getHotelSearchUrl(trip_details.destination)}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl border border-blue-200 flex items-center gap-1.5 transition-colors"
          >
            <Hotel className="w-4 h-4" /> Reserve Hotels
          </a>
        </div>
      </div>

      {/* Scenic En-route Stops */}
      {en_route_stops && en_route_stops.length > 0 && (
        <section className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/20">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Navigation className="text-blue-600" /> Scenic Stops Along the Way
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {en_route_stops.map((stop, index) => (
              <div key={index} className="bg-blue-50/80 p-4 rounded-xl border border-blue-100 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-gray-900 text-base">{stop.name}</h3>
                  <span className="text-xs font-semibold px-2 py-0.5 bg-blue-200 text-blue-800 rounded-full">{stop.type || 'Stop'}</span>
                </div>
                <p className="text-gray-600 text-sm mt-2 mb-3">{stop.description}</p>
                <a
                  href={getGoogleMapsUrl(`${stop.name} ${trip_details.destination}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800"
                >
                  View on Google Maps <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Daily Timeline */}
      <section className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Calendar className="text-indigo-600" /> Daily Itinerary Schedule
          </h2>
          <Link
            to="/map"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-200"
          >
            <MapPin className="w-3.5 h-3.5" /> View on Map Dashboard
          </Link>
        </div>

        <div className="space-y-8">
          {itinerary.map((day, index) => (
            <div key={index} className="relative border-l-4 border-indigo-200 pl-6 py-2">
              <div className="absolute -left-2.5 top-0 w-5 h-5 bg-indigo-600 rounded-full border-4 border-white"></div>
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h3 className="text-xl font-semibold text-gray-900">Day {day.day}</h3>
                <span className="text-sm text-gray-500 font-medium bg-gray-100 px-2.5 py-1 rounded-md">
                  {day.date} • {day.day_of_week} {day.is_weekend && <span className="text-amber-600 font-bold ml-1">(Weekend)</span>}
                </span>
              </div>
              <p className="text-indigo-600 font-bold mb-4 text-base flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-amber-500 inline" /> {day.theme}
              </p>

              <div className="space-y-4">
                {day.activities.map((activity, actIndex) => (
                  <div key={actIndex} className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md transition-all">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex items-center gap-2 text-indigo-600 font-bold mb-1 text-xs uppercase tracking-wider">
                        <Clock className="w-3.5 h-3.5" /> {activity.time}
                      </div>
                      <a
                        href={getGoogleMapsUrl(activity.google_maps_query || activity.place_name)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        Maps <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <h4 className="font-bold text-gray-800 text-lg mb-1">{activity.place_name}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{activity.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ItineraryPage;
