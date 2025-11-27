// Demo Mode - Automatically load impressive data for demos
import { addReport, getReports } from './firebase';
import { DEMO_REPORTS } from '../data/demoData';

export const isDemoMode = () => {
  return localStorage.getItem('urbanoracle_demo_mode') === 'true';
};

export const enableDemoMode = () => {
  localStorage.setItem('urbanoracle_demo_mode', 'true');
};

export const disableDemoMode = () => {
  localStorage.removeItem('urbanoracle_demo_mode');
};

export const loadDemoData = async () => {
  try {
    // Check if we already have data
    const existingReports = await getReports();
    
    if (existingReports.length === 0) {
      console.log('📊 Loading demo data...');
      
      // Add demo reports to Firestore
      const promises = DEMO_REPORTS.map(report => 
        addReport({
          ...report,
          timestamp: new Date(report.timestamp.seconds * 1000),
          fixedAt: report.fixedAt ? new Date(report.fixedAt.seconds * 1000) : null
        })
      );
      
      await Promise.all(promises);
      console.log('✅ Demo data loaded successfully!');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error loading demo data:', error);
    return false;
  }
};

// Get demo reports (without Firebase)
export const getDemoReports = () => {
  return DEMO_REPORTS;
};

// Check if should use demo data
export const shouldUseDemoData = async () => {
  try {
    const reports = await getReports();
    return reports.length === 0;
  } catch (error) {
    return true; // Use demo data if Firebase fails
  }
};
