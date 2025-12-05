import React, { useState, useEffect } from 'react';
import { getReports } from '../services/firebase';
import ImpactDashboard from './ImpactDashboard';
import { filterNearbyReports, getOrFetchUserLocation } from '../services/locationFilter';

function HomePage({ darkMode, onNavigate }) {
  const [stats, setStats] = useState({ total: 0, fixed: 0, pending: 0, votes: 0 });
  const [loading, setLoading] = useState(true);
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
      {/* Hero Section */}
      <div className={`${cardClass} border rounded-2xl md:rounded-3xl p-6 md:p-16 relative overflow-hidden`}>
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-cyan-500/10 to-blue-500/10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 w-36 h-36 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-3 md:mb-4 px-3 md:px-4 py-1.5 md:py-2 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 rounded-full backdrop-blur-sm">
              <span className="text-emerald-400 text-xs md:text-sm font-semibold">Powered by AI & Blockchain</span>
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
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center animate-fade-in-delay-2 px-4">
              <button
                onClick={() => onNavigate('report')}
                className="group px-6 md:px-10 py-3 md:py-5 bg-gradient-to-r from-emerald-500 to-cyan-600 text-white rounded-xl font-bold text-base md:text-lg hover:shadow-2xl hover:shadow-emerald-500/50 hover:scale-105 transition-all duration-300 relative overflow-hidden"
              >
                <span className="relative z-10">Report Issue</span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
              <button
                onClick={() => onNavigate('map')}
                className={`px-6 md:px-10 py-3 md:py-5 ${darkMode ? 'bg-zinc-800 hover:bg-zinc-700 border-2 border-zinc-700 hover:border-emerald-500' : 'bg-white hover:bg-slate-50 border-2 border-slate-300 hover:border-emerald-500'} ${textClass} rounded-xl font-bold text-base md:text-lg hover:scale-105 transition-all duration-300`}
              >
                View Map
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {[
          { label: 'Total Reports', value: stats.total, gradient: 'from-emerald-500 to-cyan-500', icon: '📊' },
          { label: 'Issues Fixed', value: stats.fixed, gradient: 'from-green-500 to-emerald-500', icon: '✓' },
          { label: 'Pending', value: stats.pending, gradient: 'from-amber-500 to-orange-500', icon: '⏱' },
          { label: 'Total Votes', value: stats.votes, gradient: 'from-blue-500 to-cyan-500', icon: '▲' }
        ].map((stat, i) => (
          <div
            key={i}
            className={`${cardClass} border rounded-xl p-4 md:p-6 hover:scale-105 hover:shadow-lg transition-all duration-300 group cursor-pointer`}
          >
            <div className={`text-xs font-semibold mb-2 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
              {stat.icon} {stat.label}
            </div>
            <p className={`text-3xl md:text-4xl font-bold ${textClass} group-hover:scale-110 transition-transform`}>
              {loading ? '...' : stat.value}
            </p>
          </div>
        ))}
      </div>





      {/* Impact Dashboard */}
      <ImpactDashboard darkMode={darkMode} />




    </div>
  );
}

export default HomePage;
