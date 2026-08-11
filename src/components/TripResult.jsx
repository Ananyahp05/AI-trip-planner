import React, { useState } from 'react';
import { Calendar, DollarSign, MapPin, Clock, Navigation, Info, ExternalLink, Globe, Luggage, Map, Share2, Hotel, Plane } from 'lucide-react';
import MapContainer from './MapContainer';
import PackingList from './PackingList';
import LocalGuide from './LocalGuide';
import ShareExportModal from './ShareExportModal';

const TripResult = ({ data }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

    if (!data) return null;

    const { trip_details, en_route_stops, itinerary, budget_breakdown, places, packing_list, local_guide } = data;

    const getGoogleMapsUrl = (query) => {
        return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query || `${trip_details.destination}`)}`;
    };

    const getHotelSearchUrl = (location) => {
        return `https://www.google.com/travel/hotels?q=${encodeURIComponent(location || trip_details.destination)}`;
    };

    const getFlightSearchUrl = (origin, destination) => {
        return `https://www.google.com/travel/flights?q=flights+from+${encodeURIComponent(origin)}+to+${encodeURIComponent(destination)}`;
    };

    return (
        <div className="space-y-8 animate-fade-in pb-12">

            {/* Trip Header Banner */}
            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-1 flex items-center gap-2">
                        {trip_details.origin} <span className="text-indigo-500">→</span> {trip_details.destination}
                    </h2>
                    <p className="text-gray-600 flex items-center gap-2 text-sm font-medium">
                        <Calendar className="w-4 h-4 text-indigo-600" /> {trip_details.dates} ({trip_details.duration})
                    </p>
                </div>
                
                {/* External Action Shortcuts */}
                <div className="flex flex-wrap items-center gap-2 no-print">
                    <button
                        onClick={() => setIsShareModalOpen(true)}
                        className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-bold text-sm shadow-md flex items-center gap-1.5 transition-all transform hover:scale-105"
                    >
                        <Share2 className="w-4 h-4" /> Share & Export
                    </button>
                    <a
                        href={getFlightSearchUrl(trip_details.origin, trip_details.destination)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl font-semibold text-xs border border-indigo-200 flex items-center gap-1 transition-colors"
                    >
                        <Plane className="w-3.5 h-3.5" /> Flights
                    </a>
                    <a
                        href={getHotelSearchUrl(trip_details.destination)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl font-semibold text-xs border border-blue-200 flex items-center gap-1 transition-colors"
                    >
                        <Hotel className="w-3.5 h-3.5" /> Hotels
                    </a>
                </div>
            </div>

            {/* Main Navigation Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-white/20 pb-2 no-print">
                {[
                    { id: 'overview', label: 'Overview & Itinerary', icon: <Calendar className="w-4 h-4" /> },
                    { id: 'map', label: 'Interactive Map', icon: <Map className="w-4 h-4" /> },
                    { id: 'packing', label: 'Packing Checklist', icon: <Luggage className="w-4 h-4" /> },
                    { id: 'guide', label: 'Destination Guide', icon: <Globe className="w-4 h-4" /> },
                    { id: 'budget', label: 'Budget Breakdown', icon: <DollarSign className="w-4 h-4" /> },
                    { id: 'places', label: 'Must-Visit Places', icon: <MapPin className="w-4 h-4" /> }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-sm ${
                            activeTab === tab.id
                                ? 'bg-white text-indigo-700 shadow-md scale-105'
                                : 'bg-white/40 text-gray-800 hover:bg-white/70 backdrop-blur-sm'
                        }`}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* TAB CONTENT: Interactive Map */}
            {(activeTab === 'map' || activeTab === 'overview') && (
                <div className={activeTab === 'overview' ? 'mb-8' : ''}>
                    <MapContainer data={data} />
                </div>
            )}

            {/* TAB CONTENT: Overview & Itinerary */}
            {(activeTab === 'overview') && (
                <>
                    {/* En-route Stops */}
                    {en_route_stops && en_route_stops.length > 0 && (
                        <section className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/20">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <Navigation className="text-blue-600" /> Scenic Stops Along the Way
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {en_route_stops.map((stop, index) => (
                                    <div key={index} className="bg-blue-50/80 p-4 rounded-xl border border-blue-100 hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-gray-900">{stop.name}</h3>
                                            <span className="text-xs font-semibold px-2 py-1 bg-blue-200 text-blue-800 rounded-full">{stop.type || 'Stop'}</span>
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

                    {/* Daily Itinerary Timeline */}
                    <section className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/20">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <Calendar className="text-indigo-600" /> Daily Adventure Itinerary
                        </h2>
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
                                    <p className="text-indigo-600 font-bold mb-4 text-base">{day.theme}</p>

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
                                                        className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 no-print"
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
                </>
            )}

            {/* TAB CONTENT: Packing Checklist */}
            {(activeTab === 'packing') && (
                <PackingList packingList={packing_list} />
            )}

            {/* TAB CONTENT: Local Guide */}
            {(activeTab === 'guide') && (
                <LocalGuide localGuide={local_guide} destination={trip_details.destination} />
            )}

            {/* TAB CONTENT: Budget Section */}
            {(activeTab === 'budget' || activeTab === 'overview') && (
                <section className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/20">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <DollarSign className="text-green-600" /> Budget Breakdown
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(budget_breakdown).map(([key, value]) => (
                            <div key={key} className="bg-emerald-50/80 p-4 rounded-xl border border-emerald-100 hover:shadow-md transition-shadow">
                                <div className="text-emerald-800 font-bold text-sm uppercase tracking-wide mb-1">{key.replace('_', ' ')}</div>
                                <div className="text-2xl font-black text-emerald-900">{value}</div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* TAB CONTENT: Must-Visit Places */}
            {(activeTab === 'places' || activeTab === 'overview') && (
                <section className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/20">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <MapPin className="text-red-600" /> Recommended Highlights & Attractions
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {places.map((place, index) => (
                            <div key={index} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-bold text-gray-900">{place.name}</h3>
                                        <a
                                            href={getGoogleMapsUrl(place.google_maps_query || place.name)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 bg-blue-50 px-2 py-1 rounded"
                                        >
                                            Map <ExternalLink className="w-3 h-3" />
                                        </a>
                                    </div>
                                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">{place.description}</p>
                                    <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700 flex gap-2">
                                        <Info className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <span className="font-semibold text-gray-900">Details:</span> {place.specifications}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Export & Share Modal */}
            <ShareExportModal
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
                data={data}
            />

        </div>
    );
};

export default TripResult;
