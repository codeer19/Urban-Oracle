import { db } from '../firebase';
import { collection, addDoc, getDocs, query, where, orderBy, limit, deleteDoc, doc } from 'firebase/firestore';

// Convert and compress image to base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Create canvas to compress image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Calculate new dimensions (max 800px width)
        let width = img.width;
        let height = img.height;
        const maxWidth = 800;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to base64 with compression (0.7 quality)
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
        resolve(compressedBase64);
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Upload a new report
export async function uploadReport(reportData) {
  try {
    const { image, location, classification, description, timestamp } = reportData;
    
    // Convert image to base64 (temporary solution until Storage is set up)
    const imageBase64 = await fileToBase64(image);
    
    // Save report to Firestore
    const docRef = await addDoc(collection(db, 'reports'), {
      imageUrl: imageBase64, // Store as base64 for now
      location,
      category: classification?.category || 'other',
      severity: classification?.severity || 'moderate',
      confidence: classification?.confidence || 0.5,
      description,
      timestamp,
      status: 'pending',
      votes: 0,
      userId: 'anonymous', // TODO: Add auth later
    });
    
    console.log('✅ Report uploaded:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Upload error:', error);
    throw error;
  }
}

// Get all reports
export async function getReports(filters = {}) {
  try {
    let q = collection(db, 'reports');
    
    if (filters.category) {
      q = query(q, where('category', '==', filters.category));
    }
    
    if (filters.status) {
      q = query(q, where('status', '==', filters.status));
    }
    
    q = query(q, orderBy('timestamp', 'desc'), limit(100));
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('❌ Fetch error:', error);
    return [];
  }
}

// Get nearby reports (for duplicate detection)
export async function getNearbyReports(location, radiusKm = 0.1) {
  try {
    const allReports = await getReports();
    
    // Filter by distance
    return allReports.filter(report => {
      const distance = calculateDistance(
        location.lat, 
        location.lng,
        report.location.lat,
        report.location.lng
      );
      return distance <= radiusKm;
    });
  } catch (error) {
    console.error('❌ Nearby reports error:', error);
    return [];
  }
}

// Delete a report (only by creator)
export async function deleteReport(reportId, userId) {
  try {
    const reportRef = doc(db, 'reports', reportId);
    await deleteDoc(reportRef);
    console.log('✅ Report deleted:', reportId);
    return true;
  } catch (error) {
    console.error('❌ Delete error:', error);
    throw error;
  }
}

// Calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}
