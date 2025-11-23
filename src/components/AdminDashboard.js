import React, { useState, useEffect } from 'react';
import { getReports } from '../services/firebase';
import { updateReportStatus, generateOptimalRoute } from '../services/admin';
import LocationPicker from './LocationPicker';

function AdminDashboard() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('votes');
  const [optimalRoute, setOptimalRoute] = useState(null);
  const [adminOffice, setAdminOffice] = useState(null);
  const [showOfficeSetup, setShowOfficeSetup] = useState(false);

  useEffect(() => {
    loadReports();
    loadAdminOffice();
  }, []);

  const loadAdminOffice = () => {
    const saved = localStorage.getItem('admin_office_location');
    if (saved) {
      setAdminOffice(JSON.parse(saved));
    } else {
      setShowOfficeSetup(true);
    }
  };

  const handleSetOffice = (location) => {
    localStorage.setItem('admin_office_location', JSON.stringify(location));
    setAdminOffice(location);
    setShowOfficeSetup(false);
    alert('✅ Office location set!');
  };

  const loadReports = async () => {
    setLoading(true);
    const data = await getReports();
    setReports(data);
    setLoading(false);
  };

  const handleStatusChange = async (reportId, newStatus) => {
    try {
      await updateReportStatus(reportId, newStatus);
      loadReports();
      alert(`✅ Status updated to: ${newStatus}`);
    } catch (error) {
      alert('❌ Error updating status');
    }
  };

  const generateRoute = () => {
    if (!adminOffice) {
      alert('⚠️ Please set your office location first!');
      setShowOfficeSetup(true);
      return;
    }

    const pendingReports = reports.filter(r => r.status === 'pending');
    if (pendingReports.length === 0) {
      alert('No pending issues to route!');
      return;
    }

    const route = generateOptimalRoute(pendingReports, adminOffice);
    setOptimalRoute(route);
  };

  // Filter and sort reports
  const filteredReports = reports
    .filter(r => filter === 'all' || r.status === filter)
    .sort((a, b) => {
      if (sortBy === 'votes') return (b.votes || 0) - (a.votes || 0);
      if (sortBy === 'risk') return (b.riskScore || 0) - (a.riskScore || 0);
      if (sortBy === 'date') return b.timestamp?.seconds - a.timestamp?.seconds;
      return 0;
    });

  const stats = {
    total: reports.length,
    pending: reports.filter(r => r.status === 'pending').length,
    inProgress: reports.filter(r => r.status === 'in_progress').length,
    fixed: reports.filter(r => r.status === 'fixed').length,
    totalVotes: reports.reduce((sum, r) => sum + (r.votes || 0), 0),
    estimatedCost: reports
      .filter(r => r.status === 'pending')
      .reduce((sum, r) => sum + (r.estimatedCost || 500), 0)
  };

  return (
    <div className="space-y-6">
      {/* Office Setup Modal with Map */}
      {showOfficeSetup && (
        <LocationPicker
          onConfirm={handleSetOffice}
          onCancel={() => adminOffice && setShowOfficeSetup(false)}
          initialLocation={adminOffice}
        />
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">🏛️ Admin Dashboard</h1>
            <p className="text-purple-100">City Official Control Panel</p>
          </div>
          <button
            onClick={() => setShowOfficeSetup(true)}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg"
          >
            📍 {adminOffice ? 'Change Office' : 'Set Office Location'}
          </button>
        </div>
        {adminOffice && (
          <p className="text-sm text-purple-200 mt-2">
            Office: {adminOffice.address}
          </p>
        )}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
          <p className="text-sm text-gray-600">Total Reports</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
          <p className="text-sm text-gray-600">Pending</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-3xl font-bold text-purple-600">{stats.totalVotes}</p>
          <p className="text-sm text-gray-600">Total Votes</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-3xl font-bold text-green-600">${stats.estimatedCost.toLocaleString()}</p>
          <p className="text-sm text-gray-600">Est. Repair Cost</p>
        </div>
      </div>

      {/* Route Optimization */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">🚗 Route Optimization</h2>
          <button
            onClick={generateRoute}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
          >
            Generate Optimal Route
          </button>
        </div>

        {optimalRoute && (
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h3 className="font-bold mb-2">✅ Optimal Repair Route Generated</h3>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Total Issues</p>
                <p className="text-2xl font-bold">{optimalRoute.totalIssues}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Est. Time Saved</p>
                <p className="text-2xl font-bold text-green-600">{optimalRoute.timeSaved}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Distance</p>
                <p className="text-2xl font-bold">{optimalRoute.totalDistance} km</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="font-semibold">Recommended Order:</p>
              <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200 mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🏛️</span>
                  <div>
                    <p className="font-bold text-emerald-900">Start: {optimalRoute.startPoint.address}</p>
                    <p className="text-xs text-emerald-700">Office Location</p>
                  </div>
                </div>
              </div>
              {optimalRoute.route.map((stop, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                  <span className="font-bold text-purple-600 text-lg">#{i + 1}</span>
                  <div className="flex-1">
                    <p className="capitalize font-semibold">{stop.category}</p>
                    <p className="text-xs text-gray-500">
                      {stop.distanceFromPrevious.toFixed(2)} km from {i === 0 ? 'office' : 'previous stop'}
                    </p>
                  </div>
                  <span className="text-sm text-gray-600 capitalize">({stop.severity})</span>
                  <span className="text-sm text-purple-600 font-semibold">{stop.votes} votes</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Filters and Sorting */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="text-sm font-medium mr-2">Filter:</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border rounded-lg"
            >
              <option value="all">All Reports</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="fixed">Fixed</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mr-2">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border rounded-lg"
            >
              <option value="votes">Most Voted</option>
              <option value="risk">Highest Risk</option>
              <option value="date">Most Recent</option>
            </select>
          </div>
          <button
            onClick={loadReports}
            className="ml-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">Image</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Category</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Severity</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Votes</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                    Loading reports...
                  </td>
                </tr>
              ) : filteredReports.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                    No reports found
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <img 
                        src={report.imageUrl} 
                        alt={report.category}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </td>
                    <td className="px-4 py-3 capitalize font-medium">{report.category}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        report.severity === 'severe' ? 'bg-red-100 text-red-700' :
                        report.severity === 'moderate' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {report.severity}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-bold text-purple-600">{report.votes || 0}</span> 👍
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={report.status}
                        onChange={(e) => handleStatusChange(report.id, e.target.value)}
                        className={`px-2 py-1 rounded text-sm font-semibold border-2 ${
                          report.status === 'fixed' ? 'border-green-500 text-green-700' :
                          report.status === 'in_progress' ? 'border-blue-500 text-blue-700' :
                          'border-yellow-500 text-yellow-700'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="fixed">Fixed</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(report.timestamp?.seconds * 1000).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
