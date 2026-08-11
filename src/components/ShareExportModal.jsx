import React, { useState } from 'react';
import { X, Printer, Copy, Check, Share2, FileText } from 'lucide-react';

const ShareExportModal = ({ isOpen, onClose, data }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !data) return null;

  const { trip_details, itinerary, budget_breakdown } = data;

  const generateSummaryText = () => {
    let summary = `📍 TRIP ITINERARY: ${trip_details.origin} ➔ ${trip_details.destination}\n`;
    summary += `📅 Dates: ${trip_details.dates} (${trip_details.duration})\n\n`;

    if (itinerary && Array.isArray(itinerary)) {
      itinerary.forEach(day => {
        summary += `--- DAY ${day.day}: ${day.theme} (${day.date}) ---\n`;
        day.activities.forEach(act => {
          summary += `• ${act.time}: ${act.place_name} - ${act.description}\n`;
        });
        summary += `\n`;
      });
    }

    if (budget_breakdown) {
      summary += `💰 ESTIMATED BUDGET:\n`;
      Object.entries(budget_breakdown).forEach(([k, v]) => {
        summary += `• ${k.replace('_', ' ')}: ${v}\n`;
      });
    }

    summary += `\nCreated with AI Trip Planner ✨`;
    return summary;
  };

  const handleCopyText = async () => {
    const text = generateSummaryText();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in no-print">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-indigo-600 to-amber-600 text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Share2 className="w-6 h-6" />
            <h2 className="text-xl font-bold font-serif">Export & Share Itinerary</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
            <h3 className="font-bold text-gray-800 text-sm mb-1 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" /> Print or Save as PDF
            </h3>
            <p className="text-xs text-gray-600 mb-3">
              Use your browser's print engine to save this formatted itinerary directly as a clean PDF document.
            </p>
            <button
              onClick={handlePrint}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg flex items-center justify-center gap-2 shadow transition-all"
            >
              <Printer className="w-4 h-4" /> Print / Save as PDF
            </button>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
            <h3 className="font-bold text-gray-800 text-sm mb-1 flex items-center gap-2">
              <Copy className="w-4 h-4 text-amber-600" /> Copy Text Summary
            </h3>
            <p className="text-xs text-gray-600 mb-3">
              Copy a beautifully formatted text summary of your daily schedule to paste in WhatsApp, Email, or iMessage.
            </p>
            <button
              onClick={handleCopyText}
              className={`w-full py-2.5 px-4 text-sm font-semibold rounded-lg flex items-center justify-center gap-2 shadow transition-all ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-500 hover:bg-amber-600 text-white'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" /> Copied to Clipboard!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" /> Copy Itinerary Text
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm text-gray-600 font-semibold hover:text-gray-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareExportModal;
