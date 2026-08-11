import React from 'react';
import { Sun, CreditCard, Bus, ShieldAlert, Compass, Globe, Info } from 'lucide-react';

const LocalGuide = ({ localGuide, destination }) => {
  const guide = localGuide || {
    climate_summary: `Check local weather forecasts prior to departure for ${destination}. Layered clothing is usually recommended.`,
    currency_and_payments: "Major credit cards widely accepted; keep a small amount of local currency cash for small vendors.",
    emergency_contacts: "Emergency Service: Dial 112 or local emergency equivalent. Keep hotel card with address in local language.",
    local_etiquette: "Be respectful of local traditions, dress codes at religious sites, and observe customary greeting etiquette.",
    transport_tips: "Utilize official public transit apps, licensed taxis, or popular local ride-hailing services."
  };

  const cards = [
    {
      title: "Weather & Climate Guide",
      icon: <Sun className="w-6 h-6 text-amber-500" />,
      bg: "bg-amber-50/80",
      border: "border-amber-200",
      text: guide.climate_summary
    },
    {
      title: "Currency & Payment Tips",
      icon: <CreditCard className="w-6 h-6 text-emerald-500" />,
      bg: "bg-emerald-50/80",
      border: "border-emerald-200",
      text: guide.currency_and_payments
    },
    {
      title: "Getting Around & Transit",
      icon: <Bus className="w-6 h-6 text-blue-500" />,
      bg: "bg-blue-50/80",
      border: "border-blue-200",
      text: guide.transport_tips
    },
    {
      title: "Local Etiquette & Customs",
      icon: <Compass className="w-6 h-6 text-purple-500" />,
      bg: "bg-purple-50/80",
      border: "border-purple-200",
      text: guide.local_etiquette
    },
    {
      title: "Safety & Emergency Info",
      icon: <ShieldAlert className="w-6 h-6 text-rose-500" />,
      bg: "bg-rose-50/80",
      border: "border-rose-200",
      text: guide.emergency_contacts
    }
  ];

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/20">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Globe className="text-indigo-600" /> Destination Intelligence & Local Tips
        </h2>
        <p className="text-sm text-gray-500">Essential travel knowledge for {destination || 'your trip'}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, idx) => (
          <div 
            key={idx} 
            className={`${card.bg} p-5 rounded-2xl border ${card.border} hover:shadow-lg transition-all duration-300 flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-white rounded-xl shadow-sm">
                  {card.icon}
                </div>
                <h3 className="font-bold text-gray-900 text-lg">{card.title}</h3>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">{card.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LocalGuide;
