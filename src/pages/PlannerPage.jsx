import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTripContext } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';
import TripForm from '../components/TripForm';
import { Plane, LogOut, History } from 'lucide-react';

const PlannerPage = () => {
  const { handleGenerateTrip, loading, error, savedTrips } = useTripContext();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      await handleGenerateTrip(formData);
      navigate('/itinerary');
    } catch (err) {
      console.error("Trip generation error", err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen relative font-sans text-slate-100 overflow-x-hidden flex flex-col justify-between p-4">
      {/* Clear Background Image */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")',
        }}
      >
        <div className="absolute inset-0 bg-black/25"></div>
      </div>

      {/* Top Floating Glass Header */}
      <header className="relative z-10 max-w-7xl w-full mx-auto flex justify-between items-center bg-slate-900/60 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-xl mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-tr from-amber-500 to-orange-600 rounded-xl shadow-lg shadow-amber-500/20">
            <Plane className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-serif font-bold text-lg text-white tracking-wide">AI Trip Planner</h1>
            <span className="text-xs text-amber-400 font-semibold block">Create Your Travel Masterpiece</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {savedTrips.length > 0 && (
            <button
              onClick={() => navigate('/history')}
              className="px-3.5 py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-md"
            >
              <History className="w-4 h-4 text-amber-400" /> Saved Trips ({savedTrips.length})
            </button>
          )}

          {user && (
            <div className="flex items-center gap-2 text-xs bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
              <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full bg-amber-500/20" />
              <span className="hidden sm:inline text-white font-bold">{user.name}</span>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="px-3.5 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold text-xs rounded-xl border border-red-500/20 flex items-center gap-1.5 transition-all"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </header>

      {/* Main Centered Form Container */}
      <main className="relative z-10 flex-1 flex flex-col justify-center items-center my-4 w-full">
        {error && (
          <div className="w-full max-w-md mb-4 bg-red-500/90 backdrop-blur-md border border-red-400 text-white p-4 rounded-xl shadow-lg animate-shake">
            <p className="text-xs font-semibold text-center">{error}</p>
          </div>
        )}

        <TripForm onSubmit={handleSubmit} loading={loading} />
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-2 text-xs text-amber-100/60 font-serif italic">
        Experience the world in style • Powered by Gemini AI
      </footer>
    </div>
  );
};

export default PlannerPage;
