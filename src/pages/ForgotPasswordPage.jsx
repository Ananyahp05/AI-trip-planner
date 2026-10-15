import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, Mail, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/+$/, '');

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong.');
      }

      setMessage(data.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 font-sans overflow-x-hidden">
      {/* Clear Background Image */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")',
        }}
      >
        <div className="absolute inset-0 bg-black/25"></div>
      </div>

      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden p-8 animate-fade-in-down">
        {/* Logo Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <div className="p-3.5 bg-gradient-to-tr from-amber-500 to-orange-600 rounded-2xl shadow-xl shadow-amber-500/30">
              <Plane className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-serif font-bold text-white tracking-tight drop-shadow-md mb-1">
            Reset Password
          </h1>
          <p className="text-amber-100/90 font-serif italic text-xs">
            Enter your email to receive a password reset link
          </p>
        </div>

        {/* Error/Success Alert */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/90 border border-red-400 text-white rounded-xl text-xs font-semibold flex items-center gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-200" />
            <span>{error}</span>
          </div>
        )}
        {message && (
          <div className="mb-4 p-3 bg-emerald-500/90 border border-emerald-400 text-white rounded-xl text-xs font-semibold flex items-center gap-2">
            <span>{message}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-amber-100 uppercase tracking-wider flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" /> Email Address
            </label>
            <input
              type="email"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/15 border border-white/20 rounded-xl text-white placeholder-amber-100/50 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white/25 transition-all text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 mt-2 rounded-xl text-white font-bold text-base bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 shadow-xl transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading ? 'Sending...' : 'Send Reset Link'} <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/auth')}
            className="text-xs text-amber-100/80 hover:text-white flex items-center justify-center gap-1.5 mx-auto transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
