import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

function HeatMap({ reports, darkMode }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current).setView([28.6139, 77.2090], 12);
    mapInstanceRef.current = map;

    // Add tile layer
    L.tileLayer(
      darkMode
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution: '&copy; OpenStreetMap contributors'
      }
    ).addTo(map);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [darkMode]);

  useEffect(() => {
    if (!mapInstanceRef.current || !reports.length) return;

    // Clear existing layers
    mapInstanceRef.current.eachLayer((layer) => {
      if (layer instanceof L.Circle || layer instanceof L.CircleMarker) {
        mapInstanceRef.current.removeLayer(layer);
      }
    });

    // Create heat intensity circles based on severity
    reports.forEach(report => {
      const severity = report.severity === 'severe' ? 3 : report.severity === 'moderate' ? 2 : 1;
      const votes = report.votes || 0;
      const intensity = severity * (1 + votes / 10);

      // Color based on severity
      const color = report.severity === 'severe' ? '#ef4444' : 
                    report.severity === 'moderate' ? '#f59e0b' : '#10b981';

      // Create circle with better visibility
      L.circle([report.location.lat, report.location.lng], {
        color: color,
        fillColor: color,
        fillOpacity: 0.4,
        opacity: 0.8,
        radius: intensity * 150, // Larger radius for better visibility
        weight: 3
      })
      .bindPopup(`
        <div style="min-width: 150px;">
          <strong style="text-transform: capitalize;">${report.category}</strong><br/>
          <span style="color: ${color};">Severity: ${report.severity}</span><br/>
          Votes: ${votes}
        </div>
      `)
      .addTo(mapInstanceRef.current);
    });

    // Fit map to show all markers
    if (reports.length > 0) {
      const bounds = L.latLngBounds(reports.map(r => [r.location.lat, r.location.lng]));
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [reports]);

  return (
    <div className="relative">
      <div ref={mapRef} className="h-96 rounded-xl overflow-hidden shadow-2xl" />
      
      {/* Legend */}
      <div className={`absolute bottom-4 right-4 ${darkMode ? 'bg-zinc-900/90' : 'bg-white/90'} backdrop-blur-sm p-4 rounded-lg shadow-lg`}>
        <h4 className={`font-bold mb-2 text-sm ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          🔥 Heat Intensity
        </h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <span className={darkMode ? 'text-slate-300' : 'text-slate-700'}>High Priority</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
            <span className={darkMode ? 'text-slate-300' : 'text-slate-700'}>Medium Priority</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span className={darkMode ? 'text-slate-300' : 'text-slate-700'}>Low Priority</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeatMap;
