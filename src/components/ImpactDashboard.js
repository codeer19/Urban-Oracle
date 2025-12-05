import React, { useState, useEffect } from 'react';
import { getReports } from '../services/firebase';
import { DEMO_REPORTS, DEMO_STATS } from '../data/demoData';

const ImpactDashboard = ({ darkMode }) => {
  const [stats, setStats] = useState(DEMO_STATS);
  const [loading, setLoading] = useState(true);
  const [useDemo, setUseDemo] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const reports = await getReports();
      
      if (reports.length === 0) {
        // Use demo data if no real data
        setUseDemo(true);
        setStats(DEMO_STATS);
      } else {
        // Calculate from real data
        const realStats = calculateStats(reports);
        setStats(realStats);
        setUseDemo(false);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
      setUseDemo(true);
      setStats(DEMO_STATS);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (reports) => {
    const fixed = reports.filter(r => r.status === 'fixed');
    return {
      totalReports: reports.length,
      pendingReports: reports.filter(r => r.status === 'pending').length,
      fixedReports: fixed.length,
      totalVotes: reports.reduce((sum, r) => sum + (r.votes || 0), 0),
      totalSavings: fixed.reduce((sum, r) => sum + (r.aiAnalysis?.savingsFromEarlyFix || 5000), 0),
      avgResponseTime: 15,
      criticalIssues: reports.filter(r => r.aiAnalysis?.riskScore >= 90).length,
      predictedSavings: reports
        .filter(r => r.status === 'pending' && r.aiAnalysis?.riskScore >= 80)
        .reduce((sum, r) => sum + ((r.aiAnalysis?.estimatedCost || 3000) * 2.5), 0)
    };
  };

  const bgClass = darkMode ? 'bg-zinc-900' : 'bg-white';
  const textClass = darkMode ? 'text-white' : 'text-slate-900';
  const subtextClass = darkMode ? 'text-slate-400' : 'text-slate-600';
  const borderClass = darkMode ? 'border-zinc-800' : 'border-slate-200';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-emerald-500"></div>
      </div>
    );
  }

  const StatCard = ({ icon, label, value, subtext, gradient, trend }) => (
    <div className={`${bgClass} ${borderClass} border rounded-xl md:rounded-2xl p-3 md:p-6 hover:scale-105 transition-transform duration-300 shadow-lg`}>
      <div className="flex items-start justify-between mb-2 md:mb-4">
        <div className={`w-10 h-10 md:w-14 md:h-14 rounded-lg md:rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-xl md:text-3xl shadow-lg`}>
          {icon}
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-emerald-500 text-xs md:text-sm font-semibold">
            <span>↗</span>
            <span>{trend}</span>
          </div>
        )}
      </div>
      <div className={`text-2xl md:text-4xl font-bold ${textClass} mb-1 md:mb-2`}>
        {value}
      </div>
      <div className={`text-xs md:text-sm font-medium ${subtextClass} mb-1`}>
        {label}
      </div>
      {subtext && (
        <div className="text-[10px] md:text-xs text-emerald-500 font-medium">
          {subtext}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 p-6 md:p-8 text-white shadow-xl">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="relative z-10">
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold">Impact Dashboard</h2>
            <p className="text-sm md:text-base text-emerald-50 mt-1">Real-time analytics and savings</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/15 backdrop-blur-md rounded-xl p-5 border border-white/30 hover:bg-white/20 transition-all group">
              <div className="text-5xl font-bold mb-2 group-hover:scale-110 transition-transform">
                ${(stats.totalSavings / 1000).toFixed(0)}K
              </div>
              <div className="text-sm font-semibold text-emerald-50">Money Saved</div>
              <div className="text-xs text-white/80 mt-1">
                Through early intervention
              </div>
            </div>
            
            <div className="bg-white/15 backdrop-blur-md rounded-xl p-5 border border-white/30 hover:bg-white/20 transition-all group">
              <div className="text-5xl font-bold mb-2 group-hover:scale-110 transition-transform">
                ${(stats.predictedSavings / 1000).toFixed(0)}K
              </div>
              <div className="text-sm font-semibold text-emerald-50">Potential Savings</div>
              <div className="text-xs text-white/80 mt-1">
                If critical issues fixed now
              </div>
            </div>
            
            <div className="bg-white/15 backdrop-blur-md rounded-xl p-5 border border-white/30 hover:bg-white/20 transition-all group">
              <div className="text-5xl font-bold mb-2 group-hover:scale-110 transition-transform">
                {stats.criticalIssues}
              </div>
              <div className="text-sm font-semibold text-emerald-50">Critical Alerts</div>
              <div className="text-xs text-white/80 mt-1">
                High-risk issues detected
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {[
          { value: stats.totalReports, label: 'Total Reports', color: 'from-blue-500 to-cyan-500' },
          { value: stats.pendingReports, label: 'Pending Issues', color: 'from-amber-500 to-orange-500' },
          { value: stats.fixedReports, label: 'Fixed Issues', color: 'from-green-500 to-emerald-500' },
          { value: stats.totalVotes, label: 'Total Votes', color: 'from-purple-500 to-pink-500' }
        ].map((stat, i) => (
          <div key={i} className={`${bgClass} ${borderClass} border rounded-xl p-4 hover:shadow-lg hover:scale-105 transition-all duration-300 group cursor-pointer`}>
            <div className={`text-3xl font-bold mb-2 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent group-hover:scale-110 transition-transform`}>
              {stat.value}
            </div>
            <div className={`text-sm ${subtextClass} font-medium`}>{stat.label}</div>
          </div>
        ))}
      </div>


    </div>
  );
};

export default ImpactDashboard;
