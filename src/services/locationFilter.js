// Location-based filtering service
// Only show reports from nearby areas (same city/region)

// Calculate distance between two coordinates (Haversine formula)
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
}

// Filter reports to only show nearby ones
export function filterNearbyReports(reports, userLocation, radiusKm = 50) {
  if (!userLocation || !userLocation.lat || !userLocation.lng) {
    // If no user location, show all reports (fallback)
    console.warn('No user location available, showing all reports');
    return reports;
  }

  const nearbyReports = reports.filter(report => {
    if (!report.location || !report.location.lat || !report.location.lng) {
      return false; // Skip reports without location
    }

    const distance = calculateDistance(
      userLocation.lat,
      userLocation.lng,
      report.location.lat,
      report.location.lng
    );

    return distance <= radiusKm;
  });

  console.log(`Filtered ${reports.length} reports to ${nearbyReports.length} within ${radiusKm}km`);
  return nearbyReports;
}

// Get user's current location
export function getUserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        console.error('Location error:', error);
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // Cache for 5 minutes
      }
    );
  });
}

// Save user location to localStorage
export function saveUserLocation(location) {
  localStorage.setItem('urbanoracle_location', JSON.stringify(location));
}

// Get saved user location from localStorage
export function getSavedUserLocation() {
  const saved = localStorage.getItem('urbanoracle_location');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      return null;
    }
  }
  return null;
}

// Get user location (from cache or fresh)
export async function getOrFetchUserLocation() {
  // Try saved location first
  const saved = getSavedUserLocation();
  if (saved) {
    console.log('Using saved location:', saved);
    return saved;
  }

  // Fetch fresh location
  try {
    const location = await getUserLocation();
    saveUserLocation(location);
    console.log('Fetched fresh location:', location);
    return location;
  } catch (error) {
    console.error('Could not get user location:', error);
    return null;
  }
}
