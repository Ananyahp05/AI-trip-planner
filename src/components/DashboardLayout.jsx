import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useTripContext } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';
import {
  Plane,
  Calendar,
  Map,
  Luggage,
  Globe,
  DollarSign,
  MapPin,
  History,
  PlusCircle,
  Share2,
  Menu,
  X,
  ArrowRight,
  LogOut,
  UserCheck
} from 'lucide-react';
import ShareExportModal from './ShareExportModal';

const DashboardLayout = () => {
  const { tripData, resetActiveTrip, savedTrips } = useTripContext();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/itinerary', label: 'Overview & Itinerary', icon: <Calendar className="w-5 h-5" />, requiresTrip: true },
    { path: '/map', label: 'Interactive Map', icon: <Map className="w-5 h-5" />, requiresTrip: true },
    { path: '/packing', label: 'Packing Checklist', icon: <Luggage className="w-5 h-5" />, requiresTrip: true },
    { path: '/guide', label: 'Destination Guide', icon: <Globe className="w-5 h-5" />, requiresTrip: true },
    { path: '/budget', label: 'Budget Breakdown', icon: <DollarSign className="w-5 h-5" />, requiresTrip: true },
    { path: '/places', label: 'Must-Visit Places', icon: <MapPin className="w-5 h-5" />, requiresTrip: true },
    { path: '/history', label: 'Saved Trips History', icon: <History className="w-5 h-5" />, count: savedTrips.length },
  ];

  const handlePlanNewTrip = () => {
    resetActiveTrip();
    navigate('/plan');
  };

  const handleLogout = () => {
    logout();
    resetActiveTrip();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen relative flex bg-slate-900 font-sans text-slate-100 overflow-x-hidden">
      {/* Clear Background Image */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat no-print"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")',
        }}
      >
        <div className="absolute inset-0 bg-slate-950/60"></div>
      </div>

      {/* Sidebar Navigation (Desktop) */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-72 bg-slate-900/90 backdrop-blur-xl border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} no-print`}>
        <div>
          {/* Logo & Header */}
          <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-tr from-amber-500 to-orange-600 rounded-xl shadow-lg shadow-amber-500/20">
                <Plane className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-serif font-bold text-lg text-white tracking-wide">AI Trip Planner</h1>
                <span className="text-xs text-amber-400 font-semibold block">Travel Dashboards</span>
              </div>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white p-1"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* User Profile Badge */}
          {user && (
            <div className="mx-4 my-3 p-3 bg-slate-800/80 border border-slate-700/60 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400/50 p-0.5 flex-shrink-0"
                />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">{user.name}</div>
                  <div className="text-[10px] text-amber-300 truncate">{user.email}</div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Active Trip Badge */}
          {tripData?.trip_details && (
            <div className="mx-4 my-2 p-3 bg-indigo-950/60 border border-indigo-500/30 rounded-xl">
              <div className="text-[10px] text-indigo-300 uppercase font-bold tracking-wider mb-0.5">Active Destination</div>
              <div className="font-bold text-white text-xs truncate flex items-center gap-1">
                {tripData.trip_details.origin} <ArrowRight className="w-3 h-3 text-indigo-400 inline" /> {tripData.trip_details.destination}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">{tripData.trip_details.dates}</div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-320px)]">
            <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Dashboards</div>
            {navItems.map((item) => {
              const isDisabled = item.requiresTrip && !tripData;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) => `
                    flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200
                    ${isDisabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''}
                    ${isActive
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold shadow-lg shadow-amber-500/20 translate-x-1'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && item.count > 0 && (
                    <span className="px-2 py-0.5 text-xs font-bold bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded-full">
                      {item.count}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-800/80 space-y-2">
          <button
            onClick={handlePlanNewTrip}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all shadow-md transform hover:scale-105"
          >
            <PlusCircle className="w-4 h-4" /> Plan New Trip
          </button>
          <button
            onClick={handleLogout}
            className="w-full py-2 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 border border-red-500/20 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen relative z-10">

        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-4 flex items-center justify-between no-print">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-slate-300 hover:text-white bg-slate-800 rounded-xl"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-white capitalize font-serif">
                {navItems.find(i => i.path === location.pathname)?.label || 'AI Trip Planner'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user && (
              <div className="hidden sm:flex items-center gap-2 text-xs text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <span>Signed in as <strong className="text-white">{user.name}</strong></span>
              </div>
            )}

            {tripData && (
              <button
                onClick={() => setIsShareModalOpen(true)}
                className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center gap-1.5 transition-all transform hover:scale-105"
              >
                <Share2 className="w-4 h-4" /> Share & PDF
              </button>
            )}

            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-xl transition-colors sm:hidden"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Dynamic Route View Page */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Export & Share Modal */}
      {tripData && (
        <ShareExportModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          data={tripData}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
