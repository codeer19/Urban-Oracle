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

    // Create heat intensity circles
    reports.forEach(report => {
      const severity = report.severity === 'severe' ? 3 : report.severity === 'moderate' ? 2 : 1;
      const votes = report.votes || 0;
      const intensity = severity * (1 + votes / 10);

      const color = report.severity === 'severe' ? '#ef4444' : 
                    report.severity === 'moderate' ? '#f59e0b' : '#22c55e';

      L.circle([report.location.lat, report.location.lng], {
        color: color,
        fillColor: color,
        fillOpacity: 0.3,
        radius: intensity * 100,
        weight: 2
      }).addTo(mapInstanceRef.current);
    });
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
