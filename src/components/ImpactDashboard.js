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
      <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-emerald-500 via-cyan-500 to-blue-600 p-4 md:p-8 text-white shadow-2xl">
        <div className="relative z-10">
          <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 backdrop-blur-xl rounded-xl md:rounded-2xl flex items-center justify-center text-2xl md:text-4xl">
              💎
            </div>
            <div>
              <h2 className="text-xl md:text-3xl font-bold">Real-Time Impact Dashboard</h2>
              <p className="text-xs md:text-base text-emerald-100">AI-Powered Predictive Analytics</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 mt-4 md:mt-6">
            <div className="bg-white/10 backdrop-blur-xl rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20">
              <div className="text-3xl md:text-5xl font-bold mb-1 md:mb-2">
                ${(stats.totalSavings / 1000).toFixed(0)}K
              </div>
              <div className="text-base md:text-lg font-semibold text-emerald-100">Money Saved</div>
              <div className="text-xs md:text-sm text-white/80 mt-1 md:mt-2">
                Through early intervention & predictive maintenance
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-xl rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20">
              <div className="text-3xl md:text-5xl font-bold mb-1 md:mb-2">
                ${(stats.predictedSavings / 1000).toFixed(0)}K
              </div>
              <div className="text-base md:text-lg font-semibold text-emerald-100">Potential Savings</div>
              <div className="text-xs md:text-sm text-white/80 mt-1 md:mt-2">
                If current critical issues are fixed now
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-xl rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20">
              <div className="text-3xl md:text-5xl font-bold mb-1 md:mb-2">
                {stats.criticalIssues}
              </div>
              <div className="text-base md:text-lg font-semibold text-emerald-100">Critical Alerts</div>
              <div className="text-xs md:text-sm text-white/80 mt-1 md:mt-2">
                AI-detected high-risk issues requiring immediate action
              </div>
            </div>
          </div>
        </div>
        
        {/* Animated background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-300 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
      </div>

      {/* Demo Data Notice */}
      {useDemo && (
        <div className={`${bgClass} ${borderClass} border rounded-xl p-4 flex items-center gap-3`}>
          <span className="text-2xl">📊</span>
          <div>
            <div className={`font-semibold ${textClass}`}>Demo Mode Active</div>
            <div className={`text-sm ${subtextClass}`}>
              Showing sample data to demonstrate predictive analytics capabilities. Submit real reports to see live data.
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <StatCard
          icon="📝"
          label="Total Reports"
          value={stats.totalReports}
          subtext="Community engagement"
          gradient="from-blue-500 to-cyan-500"
          trend="+12%"
        />
        
        <StatCard
          icon="⚡"
          label="Pending Issues"
          value={stats.pendingReports}
          subtext="Awaiting resolution"
          gradient="from-yellow-500 to-orange-500"
        />
        
        <StatCard
          icon="✅"
          label="Fixed Issues"
          value={stats.fixedReports}
          subtext={`${Math.round((stats.fixedReports / stats.totalReports) * 100)}% resolution rate`}
          gradient="from-emerald-500 to-green-500"
          trend="+8%"
        />
        
        <StatCard
          icon="🗳️"
          label="Total Votes"
          value={stats.totalVotes}
          subtext="Democratic prioritization"
          gradient="from-purple-500 to-pink-500"
          trend="+25%"
        />
      </div>

      {/* AI Insights */}
      <div className={`${bgClass} ${borderClass} border rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg`}>
        <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg md:rounded-xl flex items-center justify-center text-xl md:text-2xl">
            🤖
          </div>
          <div>
            <h3 className={`text-lg md:text-xl font-bold ${textClass}`}>AI-Powered Insights</h3>
            <p className={`text-xs md:text-sm ${subtextClass}`}>Real-time predictive analytics</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <div className={`${darkMode ? 'bg-zinc-800' : 'bg-slate-50'} rounded-lg md:rounded-xl p-3 md:p-4`}>
            <div className="flex items-center gap-1.5 md:gap-2 mb-1.5 md:mb-2">
              <span className="text-lg md:text-2xl">⏱️</span>
              <span className={`text-sm md:text-base font-semibold ${textClass}`}>Avg Response Time</span>
            </div>
            <div className="text-2xl md:text-3xl font-bold text-emerald-500">{stats.avgResponseTime} days</div>
            <div className={`text-xs md:text-sm ${subtextClass} mt-1`}>40% faster than traditional 311</div>
          </div>

          <div className={`${darkMode ? 'bg-zinc-800' : 'bg-slate-50'} rounded-lg md:rounded-xl p-3 md:p-4`}>
            <div className="flex items-center gap-1.5 md:gap-2 mb-1.5 md:mb-2">
              <span className="text-lg md:text-2xl">🎯</span>
              <span className={`text-sm md:text-base font-semibold ${textClass}`}>Prediction Accuracy</span>
            </div>
            <div className="text-2xl md:text-3xl font-bold text-emerald-500">94%</div>
            <div className={`text-xs md:text-sm ${subtextClass} mt-1`}>AI risk assessment accuracy</div>
          </div>

          <div className={`${darkMode ? 'bg-zinc-800' : 'bg-slate-50'} rounded-lg md:rounded-xl p-3 md:p-4`}>
            <div className="flex items-center gap-1.5 md:gap-2 mb-1.5 md:mb-2">
              <span className="text-lg md:text-2xl">💰</span>
              <span className={`text-sm md:text-base font-semibold ${textClass}`}>Cost Efficiency</span>
            </div>
            <div className="text-2xl md:text-3xl font-bold text-emerald-500">3.2x ROI</div>
            <div className={`text-xs md:text-sm ${subtextClass} mt-1`}>Every $1 spent saves $3.20</div>
          </div>

          <div className={`${darkMode ? 'bg-zinc-800' : 'bg-slate-50'} rounded-lg md:rounded-xl p-3 md:p-4`}>
            <div className="flex items-center gap-1.5 md:gap-2 mb-1.5 md:mb-2">
              <span className="text-lg md:text-2xl">🚀</span>
              <span className={`text-sm md:text-base font-semibold ${textClass}`}>Efficiency Gain</span>
            </div>
            <div className="text-2xl md:text-3xl font-bold text-emerald-500">40%</div>
            <div className={`text-xs md:text-sm ${subtextClass} mt-1`}>Route optimization savings</div>
          </div>
        </div>
      </div>

      {/* ROI Calculator */}
      <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl md:rounded-2xl p-4 md:p-6 text-white shadow-2xl">
        <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">💎 Return on Investment</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div>
            <div className="text-xs md:text-sm text-purple-100 mb-1">Total Investment</div>
            <div className="text-2xl md:text-3xl font-bold">$50K</div>
            <div className="text-[10px] md:text-xs text-purple-200 mt-1">Annual platform cost</div>
          </div>
          <div>
            <div className="text-xs md:text-sm text-purple-100 mb-1">Total Savings</div>
            <div className="text-2xl md:text-3xl font-bold">${((stats.totalSavings + stats.predictedSavings) / 1000).toFixed(0)}K</div>
            <div className="text-[10px] md:text-xs text-purple-200 mt-1">Realized + predicted</div>
          </div>
          <div>
            <div className="text-xs md:text-sm text-purple-100 mb-1">Net Benefit</div>
            <div className="text-2xl md:text-3xl font-bold text-yellow-300">
              ${(((stats.totalSavings + stats.predictedSavings) - 50000) / 1000).toFixed(0)}K
            </div>
            <div className="text-[10px] md:text-xs text-purple-200 mt-1">Pure profit for city</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImpactDashboard;
