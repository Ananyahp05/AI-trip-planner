import React from 'react';
import { useTripContext } from '../context/TripContext';
import { Navigate } from 'react-router-dom';
import { DollarSign, Wallet, PieChart, CreditCard, Building, Utensils, Compass, Car } from 'lucide-react';

const budgetIcons = {
  accommodation: <Building className="w-6 h-6 text-blue-500" />,
  food: <Utensils className="w-6 h-6 text-amber-500" />,
  transportation: <Car className="w-6 h-6 text-emerald-500" />,
  activities: <Compass className="w-6 h-6 text-purple-500" />,
  total: <Wallet className="w-6 h-6 text-rose-500" />
};

const BudgetPage = () => {
  const { tripData } = useTripContext();

  if (!tripData) {
    return <Navigate to="/" replace />;
  }

  const { budget_breakdown, trip_details } = tripData;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/20">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1 flex items-center gap-2">
              <DollarSign className="text-emerald-600" /> Budget & Expense Dashboard
            </h1>
            <p className="text-gray-600 text-sm">
              Estimated costs for {trip_details.origin} ➔ {trip_details.destination} ({trip_details.duration})
            </p>
          </div>
          <div className="bg-emerald-100 text-emerald-900 border border-emerald-300 px-4 py-2 rounded-xl font-bold text-sm">
            Budget Tier: {tripData.budget || 'Custom'}
          </div>
        </div>
      </div>

      {/* Expense Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(budget_breakdown).map(([key, value]) => {
          const isTotal = key.toLowerCase() === 'total';
          return (
            <div 
              key={key} 
              className={`p-6 rounded-2xl border transition-all duration-300 shadow-lg flex flex-col justify-between ${
                isTotal 
                  ? 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white border-emerald-500 transform hover:-translate-y-1' 
                  : 'bg-white/90 backdrop-blur-md border-white/20 hover:shadow-xl'
              }`}
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className={`text-xs font-bold uppercase tracking-wider ${isTotal ? 'text-emerald-100' : 'text-gray-500'}`}>
                    {key.replace('_', ' ')}
                  </span>
                  <div className={`p-2.5 rounded-xl ${isTotal ? 'bg-white/20' : 'bg-slate-100'}`}>
                    {budgetIcons[key] || <CreditCard className="w-6 h-6 text-gray-600" />}
                  </div>
                </div>
                <div className={`text-3xl font-black mb-1 ${isTotal ? 'text-white' : 'text-gray-900'}`}>
                  {value}
                </div>
                <p className={`text-xs ${isTotal ? 'text-emerald-100' : 'text-gray-500'}`}>
                  {isTotal ? 'Overall Estimated Budget' : `Estimated expenditure for ${key.replace('_', ' ')}`}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BudgetPage;
