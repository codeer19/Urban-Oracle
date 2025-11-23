import React, { useState, useEffect } from 'react';
import { getUserStats, getLeaderboard, BADGES } from '../services/gamification';

function UserProfile({ userId, darkMode, onClose }) {
  const [stats, setStats] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editAddress, setEditAddress] = useState('');

  useEffect(() => {
    loadData();
    const user = localStorage.getItem('urbanoracle_user');
    if (user) {
      const userData = JSON.parse(user);
      setEditName(userData.name || '');
      setEditAddress(userData.address || '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const handleSaveProfile = () => {
    const userData = { name: editName, address: editAddress };
    localStorage.setItem('urbanoracle_user', JSON.stringify(userData));
    setEditing(false);
    alert('✅ Profile updated!');
  };

  const loadData = async () => {
    try {
      const userStats = await getUserStats(userId);
      const leaders = await getLeaderboard(10);
      setStats(userStats || {
        points: 0,
        level: 1,
        reportsSubmitted: 0,
        totalImpact: 0,
        badges: []
      });
      setLeaderboard(leaders || []);
    } catch (error) {
      console.error('Error loading profile:', error);
      setStats({
        points: 0,
        level: 1,
        reportsSubmitted: 0,
        totalImpact: 0,
        badges: []
      });
    }
    setLoading(false);
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  const bgClass = darkMode ? 'bg-slate-800' : 'bg-white';
  const textClass = darkMode ? 'text-white' : 'text-slate-900';
  const cardClass = darkMode ? 'bg-slate-700' : 'bg-slate-50';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`${bgClass} rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-2xl font-bold ${textClass}`}>Your Profile</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setEditing(!editing)}
                className={`px-4 py-2 rounded-xl ${darkMode ? 'bg-zinc-700 hover:bg-zinc-600' : 'bg-slate-200 hover:bg-slate-300'} ${textClass} transition-all`}
              >
                {editing ? 'Cancel' : '✏️ Edit'}
              </button>
              <button onClick={onClose} className="text-2xl hover:text-red-500 transition-colors">×</button>
            </div>
          </div>

          {/* Edit Profile Form */}
          {editing && (
            <div className={`${cardClass} p-4 rounded-xl mb-6`}>
              <h3 className={`font-bold mb-3 ${textClass}`}>Edit Profile</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-slate-400">Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg ${darkMode ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-white border-slate-300'} border`}
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-400">Address / City</label>
                  <input
                    type="text"
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg ${darkMode ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-white border-slate-300'} border`}
                  />
                </div>
                <button
                  onClick={handleSaveProfile}
                  className="w-full py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg hover:shadow-lg transition-all"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className={`${cardClass} p-4 rounded-xl text-center`}>
              <p className="text-3xl font-bold text-purple-500">{stats.points}</p>
              <p className="text-sm text-slate-400">Points</p>
            </div>
            <div className={`${cardClass} p-4 rounded-xl text-center`}>
              <p className="text-3xl font-bold text-cyan-500">{stats.level}</p>
              <p className="text-sm text-slate-400">Level</p>
            </div>
            <div className={`${cardClass} p-4 rounded-xl text-center`}>
              <p className="text-3xl font-bold text-green-500">{stats.reportsSubmitted}</p>
              <p className="text-sm text-slate-400">Reports</p>
            </div>
            <div className={`${cardClass} p-4 rounded-xl text-center`}>
              <p className="text-3xl font-bold text-yellow-500">${(stats.totalImpact || 0).toLocaleString()}</p>
              <p className="text-sm text-slate-400">Impact</p>
            </div>
          </div>

          {/* Badges */}
          <div className="mb-6">
            <h3 className={`font-bold mb-3 ${textClass}`}>🏆 Badges Earned</h3>
            <div className="grid grid-cols-3 gap-3">
              {Object.values(BADGES).map(badge => {
                const earned = stats.badges?.includes(badge.id);
                return (
                  <div
                    key={badge.id}
                    className={`${cardClass} p-4 rounded-xl text-center ${
                      earned ? 'opacity-100' : 'opacity-30'
                    }`}
                  >
                    <div className="text-4xl mb-2">{badge.icon}</div>
                    <p className={`text-sm font-medium ${textClass}`}>{badge.name}</p>
                    <p className="text-xs text-slate-400">{badge.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Leaderboard */}
          <div>
            <h3 className={`font-bold mb-3 ${textClass}`}>🏅 Leaderboard</h3>
            <div className="space-y-2">
              {leaderboard.map((user, i) => (
                <div
                  key={user.id}
                  className={`${cardClass} p-3 rounded-lg flex items-center justify-between ${
                    user.id === userId ? 'ring-2 ring-purple-500' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-slate-400">#{i + 1}</span>
                    <div>
                      <p className={`font-medium ${textClass}`}>
                        {user.id === userId ? 'You' : `User ${user.id.substring(0, 8)}`}
                      </p>
                      <p className="text-xs text-slate-400">Level {user.level}</p>
                    </div>
                  </div>
                  <p className="font-bold text-purple-500">{user.points} pts</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
