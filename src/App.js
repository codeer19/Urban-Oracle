import React, { useState, lazy, Suspense, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import NotificationCenter from './components/NotificationCenter';
import UserProfile from './components/UserProfile';
import Onboarding from './components/Onboarding';
import { getVoterId } from './services/voting';
import './App.css';

// Lazy load components for faster initial load
const HomePage = lazy(() => import('./components/HomePage'));
const ReportForm = lazy(() => import('./components/ReportForm'));
const MapView = lazy(() => import('./components/MapView'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const AdminLogin = lazy(() => import('./components/AdminLogin'));

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600"></div>
  </div>
);

function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : true;
  });
  const [userName, setUserName] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const userId = getVoterId();

  // Smooth dark mode transition
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    document.documentElement.classList.add('transition-colors', 'duration-300');
  }, [darkMode]);

  useEffect(() => {
    // Check if user already signed up
    const user = localStorage.getItem('urbanoracle_user');
    if (user) {
      const userData = JSON.parse(user);
      setUserName(userData.name);
      setShowLanding(false);
    }
  }, []);

  const handleGetStarted = () => {
    const user = localStorage.getItem('urbanoracle_user');
    if (user) {
      const userData = JSON.parse(user);
      setUserName(userData.name);
    }
    setShowLanding(false);
  };

  const handleAdminLogin = (success) => {
    setIsAdminLoggedIn(success);
    if (success) {
      setActiveTab('admin');
    }
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setActiveTab('map');
  };

  if (showLanding) {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

  const bgClass = darkMode 
    ? 'min-h-screen bg-black'
    : 'min-h-screen bg-gradient-to-br from-slate-50 to-slate-100';

  const headerClass = darkMode
    ? 'bg-zinc-900/80 backdrop-blur-xl border-b border-zinc-800'
    : 'bg-white shadow-md border-b border-slate-200';

  const subtextClass = darkMode ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className={bgClass}>
      {/* Redesigned Header - Clean & Professional */}
      <header className={`${headerClass} sticky top-0 z-50`}>
        <div className="max-w-7xl mx-auto px-4 py-3">
          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 via-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  UrbanOracle
                </h1>
                <p className={`text-xs ${subtextClass}`}>AI-Powered Civic Intelligence</p>
              </div>
            </div>

            {/* Main Navigation */}
            <nav className="flex items-center gap-2">
              {[
                { id: 'home', icon: '🏠', label: 'Home' },
                { id: 'map', icon: '🗺️', label: 'Map' },
                { id: 'report', icon: '📝', label: 'Report' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg'
                      : darkMode ? 'text-slate-300 hover:bg-zinc-800' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
              <button
                onClick={() => {
                  if (isAdminLoggedIn) {
                    setActiveTab('admin');
                  } else {
                    setActiveTab('adminLogin');
                  }
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === 'admin' || activeTab === 'adminLogin'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : darkMode ? 'text-slate-300 hover:bg-zinc-800' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                🏛️ Admin
              </button>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-3 py-2 rounded-lg text-sm ${darkMode ? 'text-slate-300 hover:bg-zinc-800' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                👤 {userName}
              </button>
              <NotificationCenter darkMode={darkMode} onClose={() => {}} />
              <button
                onClick={() => setActiveTab('leaderboard')}
                className={`px-3 py-2 rounded-lg ${darkMode ? 'bg-zinc-800 text-yellow-400' : 'bg-slate-100 text-slate-700'}`}
              >
                🏆
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`px-3 py-2 rounded-lg ${darkMode ? 'bg-zinc-800 text-yellow-400' : 'bg-slate-100 text-slate-700'}`}
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
              {isAdminLoggedIn && (
                <button
                  onClick={handleAdminLogout}
                  className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 text-sm"
                >
                  Logout
                </button>
              )}
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden">
            {/* Top Row: Logo + Actions */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 via-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-base font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    UrbanOracle
                  </h1>
                  <p className={`text-[9px] ${subtextClass}`}>AI-Powered Civic Intelligence</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <NotificationCenter darkMode={darkMode} onClose={() => {}} />
                <button
                  onClick={() => setActiveTab('leaderboard')}
                  className={`p-2 rounded-lg text-lg ${darkMode ? 'bg-zinc-800' : 'bg-slate-100'}`}
                >
                  🏆
                </button>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`p-2 rounded-lg text-lg ${darkMode ? 'bg-zinc-800 text-yellow-400' : 'bg-slate-100 text-slate-700'}`}
                >
                  {darkMode ? '☀️' : '🌙'}
                </button>
              </div>
            </div>

            {/* Bottom Row: Navigation */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
              {[
                { id: 'home', icon: '🏠', label: 'Home' },
                { id: 'map', icon: '🗺️', label: 'Map' },
                { id: 'report', icon: '📝', label: 'Report' },
                { id: isAdminLoggedIn ? 'admin' : 'adminLogin', icon: '🏛️', label: 'Admin' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg'
                      : darkMode ? 'bg-zinc-800 text-slate-300' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-4 md:py-6 px-4 md:px-6">
        <Suspense fallback={<LoadingSpinner />}>
          {activeTab === 'home' && <HomePage darkMode={darkMode} onNavigate={setActiveTab} />}
          {activeTab === 'map' && <MapView darkMode={darkMode} userId={userId} />}
          {activeTab === 'report' && <ReportForm darkMode={darkMode} userId={userId} />}
          {activeTab === 'profile' && <UserProfile userId={userId} darkMode={darkMode} onClose={() => setActiveTab('home')} />}
          {activeTab === 'leaderboard' && <UserProfile userId={userId} darkMode={darkMode} onClose={() => setActiveTab('home')} />}
          {activeTab === 'adminLogin' && <AdminLogin onLogin={handleAdminLogin} darkMode={darkMode} />}
          {activeTab === 'admin' && isAdminLoggedIn && <AdminDashboard darkMode={darkMode} />}
        </Suspense>
      </main>

      {/* Profile Modal */}
      {showProfile && (
        <UserProfile 
          userId={userId} 
          darkMode={darkMode} 
          onClose={() => setShowProfile(false)} 
        />
      )}

      {/* Onboarding Tutorial */}
      <Onboarding darkMode={darkMode} onComplete={() => {}} />
    </div>
  );
}

export default App;
