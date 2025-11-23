import React, { useState } from 'react';

function LandingPage({ onGetStarted }) {
  const [address, setAddress] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (address && name) {
      localStorage.setItem('urbanoracle_user', JSON.stringify({ name, address }));
      onGetStarted();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Logo & Tagline */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="flex items-center justify-center gap-4 mb-6">
              {/* Professional Logo */}
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/50 transform hover:scale-110 transition-transform">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-4 border-slate-900 animate-pulse"></div>
              </div>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                UrbanOracle
              </h1>
            </div>
            <p className="text-2xl text-purple-200 font-light mb-4">
              See Problems Before They Happen
            </p>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              AI-powered civic platform that predicts infrastructure failures, 
              empowers citizens with blockchain voting, and saves cities millions
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="bg-slate-800/50 backdrop-blur-lg p-6 rounded-2xl border border-slate-700 hover:border-purple-500 transition-all hover:transform hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">🔮</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Predictive AI</h3>
              <p className="text-slate-400">
                Know which pothole will worsen in 2 weeks. Fix problems before they become disasters.
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-lg p-6 rounded-2xl border border-slate-700 hover:border-purple-500 transition-all hover:transform hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">🔐</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Blockchain Voting</h3>
              <p className="text-slate-400">
                Transparent, tamper-proof voting. Citizens decide what gets fixed first.
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-lg p-6 rounded-2xl border border-slate-700 hover:border-purple-500 transition-all hover:transform hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Smart Routes</h3>
              <p className="text-slate-400">
                AI optimizes repair routes. Save 40% time and millions in city budgets.
              </p>
            </div>
          </div>

          {/* Sign Up Form */}
          <div className="max-w-md mx-auto">
            <div className="bg-slate-800/50 backdrop-blur-lg p-8 rounded-2xl border border-slate-700 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                Get Started Free
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Your Address / City
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="New York, NY"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-cyan-600 hover:to-purple-700 transform hover:scale-105 transition-all shadow-lg shadow-purple-500/50"
                >
                  Start Reporting Issues →
                </button>
              </form>
              <p className="text-center text-slate-500 text-sm mt-4">
                No credit card required • Free forever
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-3xl mx-auto">
            <div className="text-center">
              <p className="text-4xl font-bold text-cyan-400">40%</p>
              <p className="text-slate-400 mt-2">Time Saved</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-purple-400">$2M+</p>
              <p className="text-slate-400 mt-2">Cost Savings</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-pink-400">100%</p>
              <p className="text-slate-400 mt-2">Transparent</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-8 text-slate-500 text-sm">
        <p>Powered by AI • Secured by Blockchain • Built for Citizens</p>
      </div>
    </div>
  );
}

export default LandingPage;
