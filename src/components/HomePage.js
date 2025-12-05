import React, { useState, useEffect } from 'react';
import { getReports } from '../services/firebase';
import HeatMap from './HeatMap';
import ImpactDashboard from './ImpactDashboard';
import AIInsightsPanel from './AIInsightsPanel';
import { filterNearbyReports, getOrFetchUserLocation } from '../services/locationFilter';
import { DEMO_REPORTS } from '../data/demoData';

function HomePage({ darkMode, onNavigate }) {
  const [stats, setStats] = useState({ total: 0, fixed: 0, pending: 0, votes: 0 });
  const [loading, setLoading] = useState(true);
  const [showHeatMap, setShowHeatMap] = useState(false);
  const [allReports, setAllReports] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Get user location
      const userLocation = await getOrFetchUserLocation();
      
      // Get all reports
      const allReportsData = await getReports();
      
      // Filter to nearby reports only (50km radius)
      const reports = filterNearbyReports(allReportsData, userLocation, 50);
      
      setAllReports(reports);
      setStats({
        total: reports.length,
        fixed: reports.filter(r => r.status === 'fixed').length,
        pending: reports.filter(r => r.status === 'pending').length,
        votes: reports.reduce((sum, r) => sum + (r.votes || 0), 0)
      });
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setLoading(false);
  };

  const cardClass = darkMode ? 'bg-zinc-900/50 border-zinc-800 backdrop-blur-xl' : 'bg-white border-slate-200';
  const textClass = darkMode ? 'text-white' : 'text-slate-900';

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Hero Section - Redesigned for Mobile */}
      <div className={`${cardClass} border rounded-2xl md:rounded-3xl p-6 md:p-16 relative overflow-hidden`}>
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-cyan-500/10 to-blue-500/10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_50%)]"></div>
        
        <div className="relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-3 md:mb-4 px-3 md:px-4 py-1.5 md:py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              <span className="text-emerald-400 text-xs md:text-sm font-semibold">🚀 Powered by AI & Blockchain</span>
            </div>
            
            <h1 className={`text-3xl md:text-5xl lg:text-7xl font-black mb-4 md:mb-6 ${textClass} animate-fade-in leading-tight`}>
              See Problems{' '}
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Before They Happen
              </span>
            </h1>
            <p className="text-base md:text-xl lg:text-2xl text-slate-400 mb-6 md:mb-10 animate-fade-in-delay font-light px-4">
              Predictive AI that saves cities millions. Transparent blockchain voting. 
              <br className="hidden md:block" />
              Join thousands making their communities better.
            </p>
            
            {/* CTA Buttons - Mobile Optimized */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center animate-fade-in-delay-2 px-4">
              <button
                onClick={() => onNavigate('report')}
                className="group px-6 md:px-10 py-3 md:py-5 bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-600 text-white rounded-xl md:rounded-2xl font-bold text-base md:text-lg hover:shadow-2xl hover:shadow-cyan-500/50 transform hover:scale-105 transition-all relative overflow-hidden"
              >
                <span className="relative z-10">📝 Report Issue</span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
              <button
                onClick={() => onNavigate('map')}
                className={`px-6 md:px-10 py-3 md:py-5 ${darkMode ? 'bg-zinc-800 hover:bg-zinc-700 border border-zinc-700' : 'bg-slate-200 hover:bg-slate-300'} ${textClass} rounded-xl md:rounded-2xl font-bold text-base md:text-lg transform hover:scale-105 transition-all`}
              >
                🗺️ View Map
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Animated Statistics - Mobile Optimized */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {[
          { label: 'Total Reports', value: stats.total, icon: '📊', color: 'from-emerald-400 to-cyan-500', delay: '0s' },
          { label: 'Issues Fixed', value: stats.fixed, icon: '✅', color: 'from-green-400 to-emerald-500', delay: '0.1s' },
          { label: 'Pending', value: stats.pending, icon: '⏳', color: 'from-amber-400 to-orange-500', delay: '0.2s' },
          { label: 'Total Votes', value: stats.votes, icon: '👍', color: 'from-blue-400 to-cyan-500', delay: '0.3s' }
        ].map((stat, i) => (
          <div
            key={i}
            className={`${cardClass} border rounded-xl md:rounded-2xl p-4 md:p-6 hover:border-emerald-500/50 hover:transform hover:scale-105 transition-all cursor-pointer animate-slide-up group`}
            style={{ animationDelay: stat.delay }}
          >
            <div className={`text-3xl md:text-5xl mb-2 md:mb-3 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent group-hover:scale-110 transition-transform`}>
              {stat.icon}
            </div>
            <p className={`text-2xl md:text-4xl font-black ${textClass} mb-1`}>
              {loading ? '...' : stat.value}
            </p>
            <p className="text-xs md:text-sm text-slate-500 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>





      {/* Impact Dashboard - IMPRESSIVE NUMBERS */}
      <ImpactDashboard darkMode={darkMode} />

      {/* AI Insights Panel - WOW FACTOR */}
      <AIInsightsPanel reports={allReports.length > 0 ? allReports : DEMO_REPORTS} darkMode={darkMode} />

      {/* Heat Map Visualization */}
      {allReports.length > 0 && (
        <div className={`${cardClass} border rounded-xl md:rounded-2xl p-4 md:p-6`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className={`text-xl md:text-2xl font-bold ${textClass}`}>
                🔥 Issue Heat Map
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Visualize problem hotspots by severity
              </p>
            </div>
            <button
              onClick={() => setShowHeatMap(!showHeatMap)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                showHeatMap 
                  ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white' 
                  : darkMode ? 'bg-zinc-800 text-slate-300' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {showHeatMap ? 'Hide' : 'Show'} Map
            </button>
          </div>
          
          {showHeatMap && <HeatMap reports={allReports} darkMode={darkMode} />}
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-4">
        <button
          onClick={() => onNavigate('map')}
          className={`${cardClass} border rounded-xl p-6 hover:border-emerald-500 transition-all text-left group`}
        >
          <div className="text-4xl mb-3">🗺️</div>
          <h3 className={`text-xl font-bold mb-2 ${textClass} group-hover:text-emerald-400 transition-colors`}>
            View All Issues on Map
          </h3>
          <p className="text-slate-400">
            See real-time reports, vote on priorities, and track progress
          </p>
        </button>
        
        <button
          onClick={() => onNavigate('report')}
          className={`${cardClass} border rounded-xl p-6 hover:border-cyan-500 transition-all text-left group`}
        >
          <div className="text-4xl mb-3">📝</div>
          <h3 className={`text-xl font-bold mb-2 ${textClass} group-hover:text-cyan-400 transition-colors`}>
            Report New Issue
          </h3>
          <p className="text-slate-400">
            Upload photo, AI classifies automatically, takes 30 seconds
          </p>
        </button>
      </div>


    </div>
  );
}

export default HomePage;
