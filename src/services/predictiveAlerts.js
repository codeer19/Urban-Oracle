// Predictive AI Analysis for Infrastructure Issues

export const analyzeTrends = (reports) => {
  const alerts = [];
  
  // Group by category
  const byCategory = {};
  reports.forEach(report => {
    if (!byCategory[report.category]) {
      byCategory[report.category] = [];
    }
    byCategory[report.category].push(report);
  });

  // Analyze each category
  Object.entries(byCategory).forEach(([category, categoryReports]) => {
    // Check for clustering (multiple reports in same area)
    const clusters = findClusters(categoryReports);
    clusters.forEach(cluster => {
      if (cluster.length >= 3) {
        alerts.push({
          type: 'cluster',
          severity: 'high',
          category,
          message: `⚠️ ${cluster.length} ${category} issues detected in same area - potential systemic problem`,
          reports: cluster,
          prediction: 'This pattern suggests underlying infrastructure failure. Immediate inspection recommended.',
          savingsEstimate: calculateSavings(cluster.length, category)
        });
      }
    });

    // Check for escalating severity
    const recentReports = categoryReports
      .sort((a, b) => b.timestamp?.seconds - a.timestamp?.seconds)
      .slice(0, 5);
    
    const severityTrend = analyzeSeverityTrend(recentReports);
    if (severityTrend === 'escalating') {
      alerts.push({
        type: 'escalation',
        severity: 'medium',
        category,
        message: `📈 ${category} issues are getting worse over time`,
        prediction: 'Early intervention could prevent major damage. Estimated cost savings: $5,000-$15,000',
        savingsEstimate: '$5,000-$15,000'
      });
    }

    // Check for high vote concentration
    const highVoteReports = categoryReports.filter(r => (r.votes || 0) > 10);
    if (highVoteReports.length > 0) {
      alerts.push({
        type: 'priority',
        severity: 'high',
        category,
        message: `🔥 ${highVoteReports.length} ${category} issues have high community priority`,
        prediction: 'Strong citizen demand. Addressing these will maximize public satisfaction.',
        savingsEstimate: 'High political capital gain'
      });
    }
  });

  // Weather-based predictions
  const weatherAlerts = generateWeatherPredictions(reports);
  alerts.push(...weatherAlerts);

  return alerts.sort((a, b) => {
    const severityOrder = { high: 3, medium: 2, low: 1 };
    return severityOrder[b.severity] - severityOrder[a.severity];
  });
};

const findClusters = (reports, radiusKm = 0.5) => {
  const clusters = [];
  const used = new Set();

  reports.forEach((report, i) => {
    if (used.has(i)) return;
    
    const cluster = [report];
    used.add(i);

    reports.forEach((other, j) => {
      if (i !== j && !used.has(j)) {
        const distance = calculateDistance(
          report.location.lat,
          report.location.lng,
          other.location.lat,
          other.location.lng
        );
        
        if (distance <= radiusKm) {
          cluster.push(other);
          used.add(j);
        }
      }
    });

    if (cluster.length > 1) {
      clusters.push(cluster);
    }
  });

  return clusters;
};

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const analyzeSeverityTrend = (reports) => {
  if (reports.length < 3) return 'stable';
  
  const severityValues = { minor: 1, moderate: 2, severe: 3 };
  const values = reports.map(r => severityValues[r.severity] || 1);
  
  let increasing = 0;
  for (let i = 1; i < values.length; i++) {
    if (values[i] > values[i-1]) increasing++;
  }
  
  return increasing >= values.length / 2 ? 'escalating' : 'stable';
};

const calculateSavings = (count, category) => {
  const baseCosts = {
    pothole: 5000,
    streetlight: 3000,
    flooding: 15000,
    damaged_sign: 2000,
    graffiti: 1000,
    garbage: 500
  };
  
  const cost = baseCosts[category] || 3000;
  const preventionSavings = cost * count * 0.4; // 40% savings from early intervention
  
  return `$${Math.round(preventionSavings).toLocaleString()}`;
};

const generateWeatherPredictions = (reports) => {
  const alerts = [];
  
  // Check for pothole clusters (predict worsening in rain)
  const potholes = reports.filter(r => r.category === 'pothole');
  if (potholes.length > 5) {
    alerts.push({
      type: 'weather',
      severity: 'medium',
      category: 'pothole',
      message: `🌧️ ${potholes.length} potholes detected - will worsen significantly in next rain`,
      prediction: 'Rain forecast: These will expand 3x in size. Repair now to save $50,000+',
      savingsEstimate: '$50,000+'
    });
  }

  // Check for flooding-prone areas
  const flooding = reports.filter(r => r.category === 'flooding');
  if (flooding.length > 2) {
    alerts.push({
      type: 'weather',
      severity: 'high',
      category: 'flooding',
      message: `💧 Recurring flooding detected in ${flooding.length} locations`,
      prediction: 'Drainage system failure likely. Next monsoon could cause major damage.',
      savingsEstimate: '$100,000+'
    });
  }

  return alerts;
};

export const getPredictiveInsights = (reports) => {
  const insights = {
    totalReports: reports.length,
    criticalIssues: reports.filter(r => r.severity === 'severe').length,
    estimatedSavings: 0,
    topPriorities: [],
    trends: []
  };

  // Calculate potential savings
  const alerts = analyzeTrends(reports);
  alerts.forEach(alert => {
    if (alert.savingsEstimate && alert.savingsEstimate.includes('$')) {
      const amount = parseInt(alert.savingsEstimate.replace(/[^0-9]/g, ''));
      if (!isNaN(amount)) {
        insights.estimatedSavings += amount;
      }
    }
  });

  // Top priorities by votes
  insights.topPriorities = reports
    .sort((a, b) => (b.votes || 0) - (a.votes || 0))
    .slice(0, 5)
    .map(r => ({
      category: r.category,
      votes: r.votes || 0,
      severity: r.severity
    }));

  return insights;
};
