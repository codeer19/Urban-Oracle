import React, { useState, useEffect } from 'react';
import { getReports } from '../services/firebase';
import { analyzeTrends, getPredictiveInsights } from '../services/predictiveAlerts';
import HeatMap from './HeatMap';
import ImpactDashboard from './ImpactDashboard';
import AIInsightsPanel from './AIInsightsPanel';
import { filterNearbyReports, getOrFetchUserLocation } from '../services/locationFilter';
import { DEMO_REPORTS } from '../data/demoData';

function HomePage({ darkMode, onNavigate }) {
  const [stats, setStats] = useState({ total: 0, fixed: 0, pending: 0, votes: 0 });
  const [topReports, setTopReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState([]);
  const [insights, setInsights] = useState(null);
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
      setTopReports(reports.sort((a, b) => (b.votes || 0) - (a.votes || 0)).slice(0, 5));
      
      // Generate predictive alerts (only for nearby reports)
      const predictiveAlerts = analyzeTrends(reports);
      setAlerts(predictiveAlerts.slice(0, 3)); // Top 3 alerts
      
      // Get insights
      const predictiveInsights = getPredictiveInsights(reports);
      setInsights(predictiveInsights);
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

      {/* Top Voted Issues */}
      <div className={`${cardClass} border rounded-xl md:rounded-2xl p-4 md:p-6 backdrop-blur-lg`}>
        <h2 className={`text-lg md:text-2xl font-bold mb-4 md:mb-6 ${textClass} flex items-center gap-2`}>
          🔥 Trending Issues
        </h2>
        
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className={`h-20 ${darkMode ? 'bg-slate-700' : 'bg-slate-200'} rounded-lg`}></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {topReports.map((report, i) => (
              <div
                key={report.id}
                className={`${darkMode ? 'bg-slate-700/50 hover:bg-slate-700' : 'bg-slate-50 hover:bg-slate-100'} p-3 md:p-4 rounded-lg flex items-center gap-3 md:gap-4 transition-all hover:transform hover:scale-102 cursor-pointer animate-slide-in`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <img 
                  src={report.imageUrl} 
                  alt={report.category}
                  className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className={`font-bold capitalize text-sm md:text-base ${textClass} truncate`}>{report.category}</h3>
                  <p className="text-xs md:text-sm text-slate-400 capitalize">{report.severity} severity</p>
                </div>
                <div className="text-center flex-shrink-0">
                  <p className="text-xl md:text-2xl font-bold text-purple-500">{report.votes || 0}</p>
                  <p className="text-[10px] md:text-xs text-slate-400">votes</p>
                </div>
                <button
                  onClick={() => onNavigate('map')}
                  className="px-3 md:px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-lg hover:from-cyan-600 hover:to-purple-700 transform hover:scale-105 transition-all text-sm md:text-base flex-shrink-0"
                >
                  Vote
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Predictive AI Alerts - WOW FACTOR */}
      {alerts.length > 0 && (
        <div className={`${cardClass} border border-red-500/30 rounded-xl md:rounded-2xl p-4 md:p-6 backdrop-blur-lg animate-pulse-glow`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
            <h2 className={`text-lg md:text-2xl font-bold ${textClass} flex items-center gap-2`}>
              🔮 AI Predictive Alerts
            </h2>
            <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs md:text-sm font-semibold self-start">
              {alerts.length} Active
            </span>
          </div>
          
          <div className="space-y-3">
            {alerts.map((alert, i) => (
              <div
                key={i}
                className={`${darkMode ? 'bg-red-900/20 border-red-500/30' : 'bg-red-50 border-red-200'} border rounded-lg md:rounded-xl p-3 md:p-4 animate-slide-in`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="flex items-start gap-2 md:gap-3">
                  <div className="text-2xl md:text-3xl flex-shrink-0">{alert.type === 'cluster' ? '⚠️' : alert.type === 'weather' ? '🌧️' : '📈'}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-bold mb-1 text-sm md:text-base ${textClass}`}>{alert.message}</h3>
                    <p className="text-xs md:text-sm text-slate-400 mb-2">{alert.prediction}</p>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full font-semibold whitespace-nowrap">
                        💰 Save: {alert.savingsEstimate}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold whitespace-nowrap ${
                        alert.severity === 'high' ? 'bg-red-500/20 text-red-400' :
                        alert.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {alert.severity.toUpperCase()} PRIORITY
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {insights && (
            <div className="mt-4 pt-4 border-t border-red-500/20">
              <p className="text-center text-lg font-bold text-green-400">
                💰 Total Potential Savings: ${insights.estimatedSavings.toLocaleString()}
              </p>
              <p className="text-center text-sm text-slate-400 mt-1">
                By addressing these issues proactively
              </p>
            </div>
          )}
        </div>
      )}

      {/* Heat Map Toggle */}
      <div className={`${cardClass} border rounded-2xl p-6 backdrop-blur-lg`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-2xl font-bold ${textClass}`}>
            🔥 Issue Heat Map
          </h2>
          <button
            onClick={() => setShowHeatMap(!showHeatMap)}
            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 transform hover:scale-105 transition-all font-semibold"
          >
            {showHeatMap ? 'Hide' : 'Show'} Heat Map
          </button>
        </div>
        
        {showHeatMap && allReports.length > 0 && (
          <HeatMap reports={allReports} darkMode={darkMode} />
        )}
        
        {!showHeatMap && (
          <div className="text-center py-8">
            <p className="text-slate-400">
              Visualize problem hotspots and density patterns
            </p>
          </div>
        )}
      </div>

      {/* AI Insights Panel - WOW FACTOR */}
      <AIInsightsPanel reports={allReports.length > 0 ? allReports : DEMO_REPORTS} darkMode={darkMode} />

      {/* Impact Dashboard - IMPRESSIVE NUMBERS */}
      <ImpactDashboard darkMode={darkMode} />

      {/* Features Showcase */}
      <div className="grid md:grid-cols-3 gap-4 md:gap-6">
        {[
          { icon: '🔮', title: 'Predictive AI', desc: 'Know which issues will worsen before they become disasters' },
          { icon: '🔐', title: 'Blockchain Voting', desc: 'Transparent, tamper-proof citizen prioritization' },
          { icon: '🚀', title: 'Smart Routes', desc: 'AI optimizes repair routes, saving 40% time' }
        ].map((feature, i) => (
          <div
            key={i}
            className={`${cardClass} border rounded-xl p-4 md:p-6 backdrop-blur-lg hover:border-purple-500 transition-all hover:transform hover:scale-105 animate-fade-in`}
            style={{ animationDelay: `${i * 0.2}s` }}
          >
            <div className="text-4xl md:text-5xl mb-3 md:mb-4">{feature.icon}</div>
            <h3 className={`text-lg md:text-xl font-bold mb-2 ${textClass}`}>{feature.title}</h3>
            <p className="text-sm md:text-base text-slate-400">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
