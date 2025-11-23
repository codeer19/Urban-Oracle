import React, { useState, useEffect } from 'react';
import { requestNotificationPermission } from '../services/notifications';

function NotificationCenter({ darkMode, onClose }) {
  const [notifications, setNotifications] = useState([
    { id: 1, title: '🎉 Welcome!', body: 'Start reporting issues to earn points', time: 'Just now', type: 'info' },
    { id: 2, title: '🔥 Trending', body: '5 new reports in your area', time: '2 min ago', type: 'alert' }
  ]);
  const [showPanel, setShowPanel] = useState(false);
  const [enabled, setEnabled] = useState(false);

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showPanel && !e.target.closest('.notification-panel')) {
        setShowPanel(false);
        if (onClose) onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showPanel, onClose]);

  useEffect(() => {
    // Check if notifications are enabled
    setEnabled(Notification.permission === 'granted');
  }, []);

  const clearNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const handleEnable = async () => {
    const granted = await requestNotificationPermission();
    setEnabled(granted);
    if (granted) {
      // Show test notification
      new Notification('🎉 Notifications Enabled!', {
        body: 'You\'ll now receive updates on your reports'
      });
    }
  };

  const bgClass = darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200';
  const textClass = darkMode ? 'text-white' : 'text-slate-900';

  return (
    <div className="relative notification-panel">
      <button
        onClick={() => setShowPanel(!showPanel)}
        className={`relative px-3 py-2 rounded-xl transition-all ${darkMode ? 'bg-zinc-800 text-white hover:bg-zinc-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
      >
        🔔
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
            {notifications.length}
          </span>
        )}
      </button>

      {showPanel && (
        <div className={`absolute right-0 mt-2 w-80 md:w-96 ${bgClass} border rounded-2xl shadow-2xl z-50 max-h-[500px] overflow-hidden animate-fade-in`}>
          <div className={`p-4 border-b ${darkMode ? 'border-zinc-800' : 'border-slate-200'} flex items-center justify-between`}>
            <h3 className={`font-bold ${textClass}`}>Notifications</h3>
            {notifications.length > 0 && (
              <button
                onClick={clearAll}
                className="text-xs text-red-400 hover:text-red-300"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="overflow-y-auto max-h-[400px]">
            {!enabled && (
              <div className="p-6 text-center">
                <div className="text-5xl mb-3">🔔</div>
                <p className="text-sm text-slate-400 mb-4">
                  Enable notifications to get real-time updates on your reports
                </p>
                <button
                  onClick={handleEnable}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-lg hover:from-cyan-600 hover:to-purple-700 transform hover:scale-105 transition-all font-semibold"
                >
                  Enable Notifications
                </button>
              </div>
            )}

            {enabled && notifications.length === 0 && (
              <div className="p-8 text-center text-slate-400">
                <div className="text-5xl mb-3">✨</div>
                <p>All caught up!</p>
                <p className="text-sm mt-1">No new notifications</p>
              </div>
            )}

            {notifications.map((notif) => (
              <div 
                key={notif.id} 
                className={`p-4 border-b ${darkMode ? 'border-zinc-800 hover:bg-zinc-800/50' : 'border-slate-200 hover:bg-slate-50'} transition-colors group`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className={`font-medium ${textClass} mb-1`}>{notif.title}</p>
                    <p className="text-sm text-slate-400">{notif.body}</p>
                    <p className="text-xs text-slate-500 mt-2">{notif.time}</p>
                  </div>
                  <button
                    onClick={() => clearNotification(notif.id)}
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-400 transition-all"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationCenter;
