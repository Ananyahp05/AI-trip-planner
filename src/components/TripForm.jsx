import React, { useState } from 'react';
import { MapPin, Calendar, DollarSign, Heart, Loader2, Navigation, Plane, ArrowRight, ShieldCheck } from 'lucide-react';

const TripForm = ({ onSubmit, loading }) => {
    const [formData, setFormData] = useState({
        origin: '',
        destination: '',
        startDate: '',
        endDate: '',
        budget: 'Medium',
        interests: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="w-full max-w-md mx-auto bg-gradient-to-b from-slate-900/80 to-slate-950/90 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden p-8 animate-fade-in-down">
            {/* Header Badge & Title */}
            <div className="text-center mb-6">
                <div className="flex justify-center mb-3">
                    <div className="p-3.5 bg-gradient-to-tr from-amber-500 to-orange-600 rounded-2xl shadow-xl shadow-amber-500/30">
                        <Plane className="h-8 w-8 text-white" />
                    </div>
                </div>
                <h2 className="text-3xl font-serif font-bold text-white tracking-tight drop-shadow-md mb-1">
                    AI Trip Planner
                </h2>
                <p className="text-amber-100/90 font-serif italic text-xs">
                    Plan your journey with Gemini AI
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* From & To */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-amber-100 uppercase tracking-wider flex items-center gap-1.5">
                            <Navigation className="w-3.5 h-3.5 text-amber-400" /> Origin City
                        </label>
                        <input
                            type="text"
                            name="origin"
                            required
                            className="w-full px-4 py-3 bg-white/15 border border-white/20 rounded-xl text-white placeholder-amber-100/50 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white/25 transition-all text-sm"
                            placeholder="e.g. Paris"
                            value={formData.origin}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-amber-100 uppercase tracking-wider flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-red-400" /> Destination
                        </label>
                        <input
                            type="text"
                            name="destination"
                            required
                            className="w-full px-4 py-3 bg-white/15 border border-white/20 rounded-xl text-white placeholder-amber-100/50 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white/25 transition-all text-sm"
                            placeholder="e.g. Tokyo"
                            value={formData.destination}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-amber-100 uppercase tracking-wider flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-indigo-400" /> Start Date
                        </label>
                        <input
                            type="date"
                            name="startDate"
                            required
                            className="w-full px-4 py-3 bg-white/15 border border-white/20 rounded-xl text-white placeholder-amber-100/50 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white/25 transition-all text-sm [color-scheme:dark]"
                            value={formData.startDate}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-amber-100 uppercase tracking-wider flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-indigo-400" /> End Date
                        </label>
                        <input
                            type="date"
                            name="endDate"
                            required
                            className="w-full px-4 py-3 bg-white/15 border border-white/20 rounded-xl text-white placeholder-amber-100/50 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white/25 transition-all text-sm [color-scheme:dark]"
                            value={formData.endDate}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                {/* Budget */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-amber-100 uppercase tracking-wider flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Budget Tier
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                        {['Low', 'Medium', 'High'].map((option) => (
                            <button
                                key={option}
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, budget: option }))}
                                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                                    formData.budget === option
                                        ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30 scale-105'
                                        : 'bg-white/15 text-amber-100 hover:bg-white/25'
                                }`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Interests */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-amber-100 uppercase tracking-wider flex items-center gap-1.5">
                        <Heart className="w-3.5 h-3.5 text-rose-400" /> Interests & Activities
                    </label>
                    <input
                        type="text"
                        name="interests"
                        className="w-full px-4 py-3 bg-white/15 border border-white/20 rounded-xl text-white placeholder-amber-100/50 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white/25 transition-all text-sm"
                        placeholder="e.g., History, Food, Culture, Shopping"
                        value={formData.interests}
                        onChange={handleChange}
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-6 mt-2 rounded-xl text-white font-bold text-base bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all duration-200 shadow-xl flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <Loader2 className="animate-spin h-5 w-5 text-white" />
                            Crafting Your Journey...
                        </span>
                    ) : (
                        <>
                            Plan My Journey <ArrowRight className="w-5 h-5" />
                        </>
                    )}
                </button>
            </form>

            <div className="mt-6 text-center text-xs text-amber-100/70 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Personalized luxury itineraries by Gemini AI
            </div>
        </div>
    );
};

export default TripForm;
