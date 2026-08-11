import React, { useState } from 'react';
import { CheckSquare, Square, Plus, RefreshCw, Luggage, Shirt, Smartphone, FileText, Sparkles, AlertCircle } from 'lucide-react';

const categoryIcons = {
  clothing: <Shirt className="w-5 h-5 text-indigo-500" />,
  electronics: <Smartphone className="w-5 h-5 text-blue-500" />,
  documents: <FileText className="w-5 h-5 text-amber-500" />,
  toiletries: <Sparkles className="w-5 h-5 text-teal-500" />,
  essentials: <Luggage className="w-5 h-5 text-rose-500" />
};

const defaultPacking = {
  clothing: ["Comfortable Walking Shoes", "Light Jacket / Sweater", "Weather-appropriate Outfits", "Sleepwear", "Socks & Underwear"],
  electronics: ["Smartphone & Charger", "Power Bank", "Universal Adapter", "Headphones"],
  documents: ["Government ID / Passport", "Boarding Passes / Tickets", "Hotel Booking Confirmations", "Travel Insurance Info"],
  toiletries: ["Toothbrush & Toothpaste", "Sunscreen & Sunglasses", "Personal Toiletries", "First Aid / Basic Medication"],
  essentials: ["Reusable Water Bottle", "Daypack / Backpack", "Snacks for Travel", "Cash & Credit Cards"]
};

const PackingList = ({ packingList: initialList }) => {
  const listToUse = (initialList && Object.keys(initialList).length > 0) ? initialList : defaultPacking;

  // Initialize items state with checked flag
  const [items, setItems] = useState(() => {
    const initialState = {};
    Object.entries(listToUse).forEach(([category, itemList]) => {
      initialState[category] = itemList.map(item => ({ text: item, checked: false }));
    });
    return initialState;
  });

  const [activeCategory, setActiveCategory] = useState('all');
  const [newItemText, setNewItemText] = useState('');
  const [targetCategory, setTargetCategory] = useState(Object.keys(listToUse)[0] || 'clothing');

  const toggleCheck = (category, index) => {
    setItems(prev => ({
      ...prev,
      [category]: prev[category].map((item, idx) => 
        idx === index ? { ...item, checked: !item.checked } : item
      )
    }));
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    setItems(prev => ({
      ...prev,
      [targetCategory]: [
        ...(prev[targetCategory] || []),
        { text: newItemText.trim(), checked: false }
      ]
    }));
    setNewItemText('');
  };

  // Calculate totals
  let totalItems = 0;
  let checkedItems = 0;
  Object.values(items).forEach(catItems => {
    catItems.forEach(item => {
      totalItems++;
      if (item.checked) checkedItems++;
    });
  });

  const progressPercent = totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;

  const categories = Object.keys(items);

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Luggage className="text-amber-600" /> AI Packing & Essentials Checklist
          </h2>
          <p className="text-sm text-gray-500">Customized smart packing list based on your trip preferences</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-sm font-bold text-gray-800">{checkedItems} of {totalItems} Packed</span>
            <span className="text-xs text-indigo-600 block font-semibold">{progressPercent}% Completed</span>
          </div>
          <div className="w-24 bg-gray-200 h-3 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-amber-500 to-indigo-600 h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 pb-3">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeCategory === 'all'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All Items
        </button>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize flex items-center gap-2 transition-all ${
              activeCategory === category
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {categoryIcons[category] || <Luggage className="w-4 h-4" />}
            {category}
          </button>
        ))}
      </div>

      {/* Add Custom Item Form */}
      <form onSubmit={handleAddItem} className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Add custom packing item..."
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <select
          value={targetCategory}
          onChange={(e) => setTargetCategory(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 capitalize bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 flex items-center gap-1 shadow"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </form>

      {/* Packing Items Grid */}
      <div className="space-y-6">
        {categories
          .filter(cat => activeCategory === 'all' || activeCategory === cat)
          .map(category => (
            <div key={category} className="bg-gray-50/80 p-4 rounded-xl border border-gray-200">
              <h3 className="text-base font-bold text-gray-900 capitalize mb-3 flex items-center gap-2">
                {categoryIcons[category] || <Luggage className="w-4 h-4" />}
                {category}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {items[category].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => toggleCheck(category, idx)}
                    className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                      item.checked
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800 line-through'
                        : 'bg-white border-gray-200 text-gray-800 hover:border-indigo-300 hover:shadow-sm'
                    }`}
                  >
                    {item.checked ? (
                      <CheckSquare className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    ) : (
                      <Square className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    )}
                    <span className="text-sm font-medium">{item.text}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default PackingList;
