import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getReports, deleteReport } from '../services/firebase';
import { castVote, hasUserVoted } from '../services/voting';
import { filterNearbyReports, getOrFetchUserLocation } from '../services/locationFilter';

// Fix Leaflet default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons based on severity
const getMarkerIcon = (severity, category) => {
  const colors = {
    minor: '#22c55e',
    moderate: '#f59e0b',
    severe: '#ef4444'
  };
  
  const emojis = {
    pothole: '🕳️',
    streetlight: '💡',
    graffiti: '🎨',
    garbage: '🗑️',
    damaged_sign: '🚧',
    flooding: '💧',
    other: '❓'
  };
  
  const color = colors[severity] || '#6b7280';
  const emoji = emojis[category] || '📍';
  
  return L.divIcon({
    html: `<div style="background: ${color}; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">${emoji}</div>`,
    className: 'custom-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
};

// Component to recenter map when reports load
function RecenterMap({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 13);
    }
  }, [center, map]);
  return null;
}

function MapView() {
  const [reports, setReports] = useState([]);
  const [allReports, setAllReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [mapCenter, setMapCenter] = useState([28.6139, 77.2090]); // Default: Delhi
  const [userLocation, setUserLocation] = useState(null);
  const [filterRadius, setFilterRadius] = useState(50); // 50km default

  useEffect(() => {
    loadReportsAndLocation();
  }, []);

  const loadReportsAndLocation = async () => {
    setLoading(true);
    
    // Get user location first
    const location = await getOrFetchUserLocation();
    if (location) {
      setUserLocation(location);
      setMapCenter([location.lat, location.lng]);
    }
    
    // Load all reports
    const data = await getReports();
    setAllReports(data);
    
    // Filter to nearby reports only
    const nearby = filterNearbyReports(data, location, filterRadius);
    setReports(nearby);
    
    setLoading(false);
  };

  const loadReports = async () => {
    setLoading(true);
    const data = await getReports();
    setAllReports(data);
    
    // Filter to nearby reports
    const nearby = filterNearbyReports(data, userLocation, filterRadius);
    setReports(nearby);
    
    setLoading(false);
  };

  const handleVote = async (reportId) => {
    try {
      // Check if already voted
      const alreadyVoted = await hasUserVoted(reportId);
      if (alreadyVoted) {
        alert('✅ You already voted on this issue!');
        return;
      }

      // Cast vote with blockchain hash
      const voteHash = await castVote(reportId);
      
      alert(`✅ Vote recorded!\n\n🔐 Blockchain Hash:\n${voteHash.hash.substring(0, 16)}...`);
      
      // Reload reports to show updated vote count
      loadReports();
      
    } catch (error) {
      console.error('Vote error:', error);
      alert('❌ ' + error.message);
    }
  };

  const handleDelete = async (reportId) => {
    if (!window.confirm('Are you sure you want to delete this report?')) {
      return;
    }

    try {
      await deleteReport(reportId);
      alert('✅ Report deleted successfully!');
      setSelectedReport(null);
      loadReports();
    } catch (error) {
      console.error('Delete error:', error);
      alert('❌ Failed to delete report');
    }
  };

  const getCategoryStats = () => {
    const stats = {};
    reports.forEach(report => {
      stats[report.category] = (stats[report.category] || 0) + 1;
    });
    return stats;
  };

  const stats = getCategoryStats();

  return (
    <div className="space-y-4">
      {/* Location Filter Info */}
      {userLocation && (
        <div className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30 p-3 rounded-lg mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-emerald-400">📍</span>
              <span className="text-sm font-medium text-slate-700">
                Showing reports within {filterRadius}km of your location
              </span>
            </div>
            <select
              value={filterRadius}
              onChange={(e) => {
                setFilterRadius(Number(e.target.value));
                const nearby = filterNearbyReports(allReports, userLocation, Number(e.target.value));
                setReports(nearby);
              }}
              className="px-3 py-1 bg-white border border-emerald-500/30 rounded-lg text-sm"
            >
              <option value={10}>10 km</option>
              <option value={25}>25 km</option>
              <option value={50}>50 km</option>
              <option value={100}>100 km</option>
            </select>
          </div>
        </div>
      )}

      {/* Stats Bar */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-3">📊 Nearby Reports</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="text-3xl font-bold text-blue-600">{reports.length}</p>
            <p className="text-sm text-gray-600">Total Reports</p>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <p className="text-3xl font-bold text-red-600">
              {reports.filter(r => r.severity === 'severe').length}
            </p>
            <p className="text-sm text-gray-600">Severe Issues</p>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <p className="text-3xl font-bold text-yellow-600">
              {reports.filter(r => r.status === 'pending').length}
            </p>
            <p className="text-sm text-gray-600">Pending</p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <p className="text-3xl font-bold text-green-600">
              {reports.filter(r => r.status === 'fixed').length}
            </p>
            <p className="text-sm text-gray-600">Fixed</p>
          </div>
        </div>
      </div>

      {/* Reports List with Voting */}
      {reports.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-3">🗳️ Vote on Issues</h2>
          <div className="grid gap-3">
            {reports.slice(0, 5).map((report) => (
              <div key={report.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                <img 
                  src={report.imageUrl} 
                  alt={report.category}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-bold capitalize">{report.category}</h3>
                  <p className="text-sm text-gray-600 capitalize">{report.severity} severity</p>
                  <p className="text-xs text-gray-500">
                    {new Date(report.timestamp?.seconds * 1000).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">{report.votes || 0}</p>
                  <p className="text-xs text-gray-600">votes</p>
                </div>
                <button
                  onClick={() => handleVote(report.id)}
                  className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold"
                >
                  👍 Vote
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Map */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-bold">🗺️ Interactive Report Map</h2>
          <button
            onClick={loadReports}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            🔄 Refresh
          </button>
        </div>

        {loading ? (
          <div className="h-96 flex items-center justify-center bg-slate-50 rounded-lg border border-slate-200">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600 mx-auto mb-3"></div>
              <p className="text-slate-500">Loading map...</p>
            </div>
          </div>
        ) : (
          <div className="h-96 rounded-lg overflow-hidden border border-slate-200 shadow-sm">
            <MapContainer
              center={mapCenter}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
              preferCanvas={true}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap'
                maxZoom={19}
                updateWhenIdle={true}
                keepBuffer={2}
              />
              <RecenterMap center={mapCenter} />
              
              {reports.map((report) => (
                <Marker
                  key={report.id}
                  position={[report.location.lat, report.location.lng]}
                  icon={getMarkerIcon(report.severity, report.category)}
                  eventHandlers={{
                    click: () => setSelectedReport(report)
                  }}
                >
                  <Popup>
                    <div className="p-2 min-w-[200px]">
                      <h3 className="font-bold text-lg capitalize mb-2">
                        {report.category}
                      </h3>
                      <img 
                        src={report.imageUrl} 
                        alt={report.category}
                        className="w-full h-32 object-cover rounded mb-2"
                      />
                      <div className="space-y-1 text-sm">
                        <p><strong>Severity:</strong> <span className="capitalize">{report.severity}</span></p>
                        <p><strong>Status:</strong> <span className="capitalize">{report.status}</span></p>
                        <p><strong>Votes:</strong> {report.votes || 0} 👍</p>
                        <p className="text-xs text-gray-500">
                          {new Date(report.timestamp?.seconds * 1000).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleVote(report.id);
                          }}
                          className="flex-1 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                        >
                          👍 Vote
                        </button>
                        <button
                          onClick={() => setSelectedReport(report)}
                          className="flex-1 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        )}

        {/* Legend */}
        <div className="mt-3 flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span>Minor</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
            <span>Moderate</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <span>Severe</span>
          </div>
        </div>
      </div>

      {/* Selected Report Details Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold capitalize">{selectedReport.category}</h2>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <img 
                src={selectedReport.imageUrl} 
                alt={selectedReport.category}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-3 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600">Severity</p>
                  <p className="font-bold capitalize">{selectedReport.severity}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="font-bold capitalize">{selectedReport.status}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600">Votes</p>
                  <p className="font-bold">{selectedReport.votes || 0} 👍</p>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600">Reported</p>
                  <p className="font-bold text-sm">
                    {new Date(selectedReport.timestamp?.seconds * 1000).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-1">📝 Description</p>
                <p className="text-gray-800 bg-gray-50 p-3 rounded">
                  {selectedReport.description || 'No description provided'}
                </p>
              </div>

              {/* Blockchain Vote Section */}
              <div className="mb-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h3 className="font-bold mb-2">🔐 Blockchain Voting</h3>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-2xl font-bold text-purple-600">{selectedReport.votes || 0}</p>
                    <p className="text-sm text-gray-600">Total Votes</p>
                  </div>
                  <button
                    onClick={() => handleVote(selectedReport.id)}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 font-semibold"
                  >
                    👍 Vote to Prioritize
                  </button>
                </div>
                
                {selectedReport.voteHashes && selectedReport.voteHashes.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-600 mb-2">Recent Vote Hashes (Transparent & Tamper-Proof):</p>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {selectedReport.voteHashes.slice(-5).reverse().map((vote, i) => (
                        <div key={i} className="text-xs bg-white p-2 rounded font-mono">
                          <span className="text-purple-600">🔐</span> {vote.hash.substring(0, 32)}...
                          <span className="text-gray-500 ml-2">
                            {new Date(vote.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedReport(null)}
                  className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Close
                </button>
                <button
                  onClick={() => handleDelete(selectedReport.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MapView;
