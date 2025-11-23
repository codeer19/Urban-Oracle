import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom office marker icon
const officeIcon = L.divIcon({
  html: `<div style="background: linear-gradient(135deg, #10b981, #06b6d4); width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; border: 3px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">🏛️</div>`,
  className: 'custom-marker',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

// Component to handle map clicks
function LocationSelector({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng);
    },
  });
  return null;
}

function LocationPicker({ onConfirm, onCancel, initialLocation }) {
  const [selectedLocation, setSelectedLocation] = useState(initialLocation || { lat: 28.6139, lng: 77.2090 });
  const [address, setAddress] = useState('');

  // Prevent body scroll when modal is open
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleLocationSelect = (latlng) => {
    setSelectedLocation(latlng);
  };

  const handleConfirm = () => {
    if (selectedLocation && address) {
      onConfirm({
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
        address: address
      });
    } else {
      alert('Please click on the map to select a location and enter an address');
    }
  };

  const useCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setSelectedLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          alert('Could not get your location');
        }
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
      <div className="bg-zinc-900 rounded-2xl max-w-4xl w-full my-8 border border-zinc-800 shadow-2xl">
        <div className="p-6 border-b border-zinc-800 sticky top-0 bg-zinc-900 z-10">
          <h2 className="text-2xl font-bold text-white mb-2">📍 Set Office Location</h2>
          <p className="text-slate-400">Click on the map to select your municipal office location</p>
        </div>

        <div className="p-6 space-y-4 max-h-[calc(90vh-100px)] overflow-y-auto">
          {/* Address Input */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Office Address / Name
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g., City Hall, Mumbai Municipal Corporation"
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>

          {/* Map */}
          <div className="h-96 rounded-xl overflow-hidden border-2 border-zinc-800">
            <MapContainer
              center={[selectedLocation.lat, selectedLocation.lng]}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap'
              />
              <LocationSelector onLocationSelect={handleLocationSelect} />
              {selectedLocation && (
                <Marker 
                  position={[selectedLocation.lat, selectedLocation.lng]}
                  icon={officeIcon}
                />
              )}
            </MapContainer>
          </div>

          {/* Selected Coordinates */}
          {selectedLocation && (
            <div className="bg-zinc-800 p-4 rounded-xl border border-zinc-700">
              <p className="text-sm text-slate-400 mb-1">Selected Location:</p>
              <p className="text-white font-mono text-sm">
                Lat: {selectedLocation.lat.toFixed(6)}, Lng: {selectedLocation.lng.toFixed(6)}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sticky bottom-0 bg-zinc-900 pt-4 pb-2">
            <button
              onClick={useCurrentLocation}
              className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-semibold transition-all border border-zinc-700"
            >
              📍 Use My Current Location
            </button>
            <button
              onClick={handleConfirm}
              disabled={!address}
              className={`flex-1 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all ${!address ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              ✓ Confirm Location
            </button>
            {onCancel && (
              <button
                onClick={onCancel}
                className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-slate-300 rounded-xl font-semibold transition-all"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LocationPicker;
