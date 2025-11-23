// Real-time notification system
import { db } from '../firebase';
import { collection, query, where, onSnapshot, addDoc } from 'firebase/firestore';

// Request notification permission
export async function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return Notification.permission === 'granted';
}

// Show browser notification
export function showNotification(title, options) {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      icon: '/logo192.png',
      badge: '/logo192.png',
      ...options
    });
  }
}

// Listen for status changes on user's reports
export function subscribeToUserReports(userId, callback) {
  const q = query(
    collection(db, 'reports'),
    where('userId', '==', userId)
  );

  return onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'modified') {
        const report = change.doc.data();
        
        // Notify on status change
        if (report.status === 'in_progress') {
          showNotification('🚧 Work Started!', {
            body: `Your ${report.category} report is now being fixed!`,
            tag: report.id
          });
        } else if (report.status === 'fixed') {
          showNotification('✅ Issue Fixed!', {
            body: `Your ${report.category} report has been resolved!`,
            tag: report.id
          });
        }
        
        callback(report);
      }
    });
  });
}

// Listen for nearby issues
export function subscribeToNearbyIssues(location, radiusKm, callback) {
  // In production, use geohash queries for better performance
  const q = query(collection(db, 'reports'));
  
  return onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added') {
        const report = { id: change.doc.id, ...change.doc.data() };
        
        // Check if nearby
        const distance = calculateDistance(
          location.lat,
          location.lng,
          report.location.lat,
          report.location.lng
        );
        
        if (distance <= radiusKm) {
          showNotification('📍 New Issue Nearby!', {
            body: `${report.category} reported ${distance.toFixed(1)}km away`,
            tag: report.id
          });
          callback(report);
        }
      }
    });
  });
}

// Calculate distance
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Create notification record in Firebase
export async function createNotification(userId, notification) {
  try {
    await addDoc(collection(db, 'notifications'), {
      userId,
      ...notification,
      read: false,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error creating notification:', error);
  }
}
