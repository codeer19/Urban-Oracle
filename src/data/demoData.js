// Demo data to showcase predictive analytics and impact
// This makes the app look impressive immediately

export const DEMO_REPORTS = [
  // Cluster 1: Downtown pothole crisis (systemic failure)
  {
    id: 'demo-1',
    category: 'pothole',
    severity: 'severe',
    description: 'Large pothole causing traffic hazard',
    location: { lat: 40.7589, lng: -73.9851, address: '5th Ave & 42nd St, Manhattan' },
    imageUrl: 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=400',
    status: 'pending',
    votes: 47,
    timestamp: { seconds: Date.now() / 1000 - 86400 * 2 },
    aiAnalysis: {
      riskScore: 92,
      estimatedCost: 3500,
      estimatedRepairTime: 6,
      prediction: { days: 5, nextSeverity: 'critical' }
    }
  },
  {
    id: 'demo-2',
    category: 'pothole',
    severity: 'severe',
    description: 'Deep pothole near intersection',
    location: { lat: 40.7591, lng: -73.9849, address: '5th Ave & 43rd St, Manhattan' },
    imageUrl: 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=400',
    status: 'pending',
    votes: 38,
    timestamp: { seconds: Date.now() / 1000 - 86400 * 3 },
    aiAnalysis: {
      riskScore: 88,
      estimatedCost: 3200,
      estimatedRepairTime: 5,
      prediction: { days: 7, nextSeverity: 'critical' }
    }
  },
  {
    id: 'demo-3',
    category: 'pothole',
    severity: 'moderate',
    description: 'Growing pothole in bike lane',
    location: { lat: 40.7587, lng: -73.9853, address: '5th Ave & 41st St, Manhattan' },
    imageUrl: 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=400',
    status: 'pending',
    votes: 29,
    timestamp: { seconds: Date.now() / 1000 - 86400 * 1 },
    aiAnalysis: {
      riskScore: 75,
      estimatedCost: 2000,
      estimatedRepairTime: 4,
      prediction: { days: 10, nextSeverity: 'severe' }
    }
  },

  // Cluster 2: Brooklyn flooding (drainage failure)
  {
    id: 'demo-4',
    category: 'flooding',
    severity: 'severe',
    description: 'Street floods every rain - drainage blocked',
    location: { lat: 40.6782, lng: -73.9442, address: 'Bedford Ave, Brooklyn' },
    imageUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=400',
    status: 'pending',
    votes: 63,
    timestamp: { seconds: Date.now() / 1000 - 86400 * 5 },
    aiAnalysis: {
      riskScore: 95,
      estimatedCost: 15000,
      estimatedRepairTime: 24,
      prediction: { days: 3, nextSeverity: 'critical' }
    }
  },
  {
    id: 'demo-5',
    category: 'flooding',
    severity: 'severe',
    description: 'Recurring flooding - basement damage',
    location: { lat: 40.6785, lng: -73.9440, address: 'Bedford Ave & N 7th, Brooklyn' },
    imageUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=400',
    status: 'pending',
    votes: 51,
    timestamp: { seconds: Date.now() / 1000 - 86400 * 4 },
    aiAnalysis: {
      riskScore: 93,
      estimatedCost: 18000,
      estimatedRepairTime: 30,
      prediction: { days: 3, nextSeverity: 'critical' }
    }
  },

  // High-priority streetlights
  {
    id: 'demo-6',
    category: 'streetlight',
    severity: 'severe',
    description: 'Dark intersection - safety hazard',
    location: { lat: 40.7489, lng: -73.9680, address: 'Park Ave & 34th St, Manhattan' },
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400',
    status: 'pending',
    votes: 42,
    timestamp: { seconds: Date.now() / 1000 - 86400 * 7 },
    aiAnalysis: {
      riskScore: 78,
      estimatedCost: 800,
      estimatedRepairTime: 3,
      prediction: { days: 30, nextSeverity: 'critical' }
    }
  },

  // Fixed issues (show impact)
  {
    id: 'demo-7',
    category: 'pothole',
    severity: 'severe',
    description: 'Major pothole - FIXED',
    location: { lat: 40.7128, lng: -74.0060, address: 'Broadway, Manhattan' },
    imageUrl: 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=400',
    status: 'fixed',
    votes: 55,
    timestamp: { seconds: Date.now() / 1000 - 86400 * 30 },
    fixedAt: { seconds: Date.now() / 1000 - 86400 * 5 },
    aiAnalysis: {
      riskScore: 90,
      estimatedCost: 4500,
      estimatedRepairTime: 8,
      actualCost: 4200,
      savingsFromEarlyFix: 12000
    }
  },
  {
    id: 'demo-8',
    category: 'flooding',
    severity: 'severe',
    description: 'Drainage fixed - no more flooding',
    location: { lat: 40.7580, lng: -73.9855, address: 'Times Square, Manhattan' },
    imageUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=400',
    status: 'fixed',
    votes: 78,
    timestamp: { seconds: Date.now() / 1000 - 86400 * 45 },
    fixedAt: { seconds: Date.now() / 1000 - 86400 * 10 },
    aiAnalysis: {
      riskScore: 98,
      estimatedCost: 25000,
      actualCost: 22000,
      savingsFromEarlyFix: 85000
    }
  },
  {
    id: 'demo-9',
    category: 'streetlight',
    severity: 'moderate',
    description: 'Streetlight repaired',
    location: { lat: 40.7614, lng: -73.9776, address: 'Central Park South' },
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400',
    status: 'fixed',
    votes: 31,
    timestamp: { seconds: Date.now() / 1000 - 86400 * 20 },
    fixedAt: { seconds: Date.now() / 1000 - 86400 * 3 },
    aiAnalysis: {
      riskScore: 65,
      estimatedCost: 600,
      actualCost: 550,
      savingsFromEarlyFix: 1500
    }
  },

  // More pending issues for variety
  {
    id: 'demo-10',
    category: 'graffiti',
    severity: 'minor',
    description: 'Graffiti on public building',
    location: { lat: 40.7306, lng: -73.9352, address: 'Queens Blvd, Queens' },
    imageUrl: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=400',
    status: 'pending',
    votes: 12,
    timestamp: { seconds: Date.now() / 1000 - 86400 * 6 },
    aiAnalysis: {
      riskScore: 35,
      estimatedCost: 400,
      estimatedRepairTime: 2
    }
  },
  {
    id: 'demo-11',
    category: 'garbage',
    severity: 'moderate',
    description: 'Overflowing trash bins',
    location: { lat: 40.7282, lng: -73.7949, address: 'Main St, Queens' },
    imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=400',
    status: 'pending',
    votes: 18,
    timestamp: { seconds: Date.now() / 1000 - 86400 * 1 },
    aiAnalysis: {
      riskScore: 45,
      estimatedCost: 200,
      estimatedRepairTime: 1
    }
  },
  {
    id: 'demo-12',
    category: 'damaged_sign',
    severity: 'moderate',
    description: 'Stop sign damaged and hard to read',
    location: { lat: 40.8448, lng: -73.8648, address: 'Bronx, NY' },
    imageUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400',
    status: 'pending',
    votes: 25,
    timestamp: { seconds: Date.now() / 1000 - 86400 * 4 },
    aiAnalysis: {
      riskScore: 70,
      estimatedCost: 350,
      estimatedRepairTime: 2
    }
  }
];

// Calculate impressive statistics
export const DEMO_STATS = {
  totalReports: DEMO_REPORTS.length,
  pendingReports: DEMO_REPORTS.filter(r => r.status === 'pending').length,
  fixedReports: DEMO_REPORTS.filter(r => r.status === 'fixed').length,
  totalVotes: DEMO_REPORTS.reduce((sum, r) => sum + r.votes, 0),
  totalSavings: DEMO_REPORTS
    .filter(r => r.status === 'fixed')
    .reduce((sum, r) => sum + (r.aiAnalysis.savingsFromEarlyFix || 0), 0),
  avgResponseTime: 15, // days
  criticalIssues: DEMO_REPORTS.filter(r => r.aiAnalysis.riskScore >= 90).length,
  predictedSavings: DEMO_REPORTS
    .filter(r => r.status === 'pending' && r.aiAnalysis.riskScore >= 80)
    .reduce((sum, r) => sum + (r.aiAnalysis.estimatedCost * 2.5), 0) // 2.5x cost if not fixed early
};
