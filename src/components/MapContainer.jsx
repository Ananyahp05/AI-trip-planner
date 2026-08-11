import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Navigation, MapPin, ExternalLink, Route, Compass } from 'lucide-react';

const MapContainer = ({ data }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [routeInfo, setRouteInfo] = useState(null);

  useEffect(() => {
    if (!mapRef.current || !data) return;

    const { trip_details, en_route_stops, itinerary, places } = data;

    const markers = [];
    const routePoints = [];

    // 1. Origin
    if (trip_details?.origin_coords?.lat && trip_details?.origin_coords?.lng) {
      const originPt = [trip_details.origin_coords.lat, trip_details.origin_coords.lng];
      markers.push({
        lat: trip_details.origin_coords.lat,
        lng: trip_details.origin_coords.lng,
        title: `Origin: ${trip_details.origin}`,
        subtitle: 'Starting Point',
        color: '#3B82F6' // Blue
      });
      routePoints.push({ lat: trip_details.origin_coords.lat, lng: trip_details.origin_coords.lng, label: trip_details.origin });
    }

    // 2. En-route Stops
    if (en_route_stops && Array.isArray(en_route_stops)) {
      en_route_stops.forEach(stop => {
        if (stop.lat && stop.lng) {
          markers.push({
            lat: stop.lat,
            lng: stop.lng,
            title: stop.name,
            subtitle: `Stop: ${stop.type || 'En-route stop'}`,
            description: stop.description,
            color: '#F59E0B' // Amber
          });
          routePoints.push({ lat: stop.lat, lng: stop.lng, label: stop.name });
        }
      });
    }

    // 3. Main Destination
    if (trip_details?.destination_coords?.lat && trip_details?.destination_coords?.lng) {
      markers.push({
        lat: trip_details.destination_coords.lat,
        lng: trip_details.destination_coords.lng,
        title: `Destination: ${trip_details.destination}`,
        subtitle: 'Main Destination',
        color: '#EF4444' // Red
      });
      routePoints.push({ lat: trip_details.destination_coords.lat, lng: trip_details.destination_coords.lng, label: trip_details.destination });
    }

    // 4. Daily Activities
    if (itinerary && Array.isArray(itinerary)) {
      itinerary.forEach(day => {
        if (day.activities && Array.isArray(day.activities)) {
          day.activities.forEach(act => {
            if (act.lat && act.lng) {
              markers.push({
                lat: act.lat,
                lng: act.lng,
                title: act.place_name,
                subtitle: `Day ${day.day} - ${act.time}`,
                description: act.description,
                color: '#6366F1' // Indigo
              });
              routePoints.push({ lat: act.lat, lng: act.lng, label: act.place_name });
            }
          });
        }
      });
    }

    // 5. Must-Visit Places
    if (places && Array.isArray(places)) {
      places.forEach(place => {
        if (place.lat && place.lng) {
          const exists = markers.some(m => Math.abs(m.lat - place.lat) < 0.001 && Math.abs(m.lng - place.lng) < 0.001);
          if (!exists) {
            markers.push({
              lat: place.lat,
              lng: place.lng,
              title: place.name,
              subtitle: 'Recommended Place',
              description: place.description,
              color: '#10B981' // Emerald
            });
          }
        }
      });
    }

    const center = markers.length > 0 ? [markers[0].lat, markers[0].lng] : [20, 0];

    // Cleanup previous map
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapRef.current).setView(center, markers.length > 1 ? 6 : 10);
    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(map);

    // Create custom pin SVG icon generator
    const createCustomIcon = (color) => {
      const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="${color}" stroke="#FFFFFF" stroke-width="1.5">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      `;
      return L.divIcon({
        html: svg,
        className: 'custom-leaflet-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
      });
    };

    const leafletMarkers = [];

    markers.forEach(m => {
      const icon = createCustomIcon(m.color);
      const marker = L.marker([m.lat, m.lng], { icon }).addTo(map);

      const popupContent = `
        <div style="font-family: sans-serif; padding: 4px; min-width: 170px;">
          <h4 style="margin: 0 0 4px 0; font-weight: bold; font-size: 15px; color: #1E293B;">${m.title}</h4>
          <p style="margin: 0 0 4px 0; font-size: 12px; color: #64748B; font-weight: 600;">${m.subtitle}</p>
          ${m.description ? `<p style="margin: 0 0 8px 0; font-size: 12px; color: #334155;">${m.description}</p>` : ''}
          <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(m.title + ' ' + (trip_details?.destination || ''))}" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 4px 8px; background: #3B82F6; color: white; border-radius: 4px; text-decoration: none; font-size: 11px; font-weight: 600;">Open in Google Maps</a>
        </div>
      `;

      marker.bindPopup(popupContent);
      leafletMarkers.push(marker);
    });

    // Draw Best Route Line (Polyline)
    if (routePoints.length >= 2) {
      const latLngs = routePoints.map(p => [p.lat, p.lng]);

      // Outer glow line
      L.polyline(latLngs, {
        color: '#2563EB',
        weight: 8,
        opacity: 0.35,
        lineCap: 'round'
      }).addTo(map);

      // Inner animated dashed line representing the travel route
      L.polyline(latLngs, {
        color: '#F59E0B',
        weight: 4,
        opacity: 0.9,
        dashArray: '8, 12',
        lineCap: 'round'
      }).addTo(map);

      setRouteInfo({
        origin: trip_details.origin,
        destination: trip_details.destination,
        stopsCount: (en_route_stops?.length || 0) + (itinerary?.reduce((acc, d) => acc + (d.activities?.length || 0), 0) || 0),
        waypoints: routePoints.map(p => p.label)
      });
    }

    // Fit bounds
    if (markers.length > 1) {
      const group = new L.featureGroup(leafletMarkers);
      map.fitBounds(group.getBounds().pad(0.2));
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [data]);

  const getDirectionsGoogleMapsUrl = () => {
    if (!data?.trip_details) return '#';
    const origin = encodeURIComponent(data.trip_details.origin);
    const destination = encodeURIComponent(data.trip_details.destination);
    
    let waypointsStr = '';
    if (data.en_route_stops && data.en_route_stops.length > 0) {
      const waypoints = data.en_route_stops.map(s => encodeURIComponent(s.name)).join('|');
      waypointsStr = `&waypoints=${waypoints}`;
    }

    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}${waypointsStr}&travelmode=driving`;
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/20 space-y-4">
      {/* Header & Legend */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200 pb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Route className="text-amber-500" /> Interactive Route Map & Directions
          </h3>
          <p className="text-sm text-gray-500">
            Highlighting the best travel route from <strong className="text-indigo-600">{data?.trip_details?.origin}</strong> to <strong className="text-red-600">{data?.trip_details?.destination}</strong>
          </p>
        </div>

        <a
          href={getDirectionsGoogleMapsUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center gap-2 transition-all transform hover:scale-105"
        >
          <Navigation className="w-4 h-4" /> Get Live Driving Directions
        </a>
      </div>

      {/* Route Info Badge Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs font-semibold text-gray-700">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span> Origin ({data?.trip_details?.origin})</span>
          <span className="text-amber-500 font-bold">➔</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span> Scenic Stops</span>
          <span className="text-amber-500 font-bold">➔</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span> Destination ({data?.trip_details?.destination})</span>
        </div>
        <div className="flex items-center gap-2 text-indigo-600">
          <Compass className="w-4 h-4" /> Route Path Plotted
        </div>
      </div>

      {/* Map Element */}
      <div 
        ref={mapRef} 
        className="w-full h-[480px] rounded-xl overflow-hidden shadow-inner border border-gray-200 z-10"
      />
    </div>
  );
};

export default MapContainer;
