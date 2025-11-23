import React, { useState } from 'react';

function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple authentication (in production, use Firebase Auth or backend)
    // Demo credentials: admin / admin123
    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('urbanoracle_admin', 'true');
      onLogin(true);
    } else {
      setError('Invalid credentials. Try: admin / admin123');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">🔐</div>
          <h2 className="text-2xl font-bold">Admin Login</h2>
          <p className="text-gray-600 mt-2">City Officials Only</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter username"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter password"
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
          >
            Login to Admin Dashboard
          </button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm font-semibold mb-2 text-blue-900">👥 Who can access?</p>
          <p className="text-xs text-blue-700 mb-3">
            City officials, municipal corporation workers, and authorized government personnel responsible for infrastructure maintenance.
          </p>
          <p className="text-sm text-gray-600 font-semibold mb-2">Demo Credentials:</p>
          <p className="text-sm text-gray-700">Username: <code className="bg-gray-200 px-2 py-1 rounded">admin</code></p>
          <p className="text-sm text-gray-700">Password: <code className="bg-gray-200 px-2 py-1 rounded">admin123</code></p>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
