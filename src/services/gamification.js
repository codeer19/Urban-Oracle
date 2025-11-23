// Gamification system - points, badges, leaderboards
import { db } from '../firebase';
import { doc, getDoc, setDoc, updateDoc, increment, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

// Point values for actions
const POINTS = {
  REPORT_SUBMITTED: 10,
  VOTE_CAST: 5,
  ISSUE_FIXED: 50,
  FIRST_REPORT: 25,
  STREAK_BONUS: 20
};

// Badge definitions
export const BADGES = {
  FIRST_REPORTER: {
    id: 'first_reporter',
    name: 'First Reporter',
    icon: '🎯',
    description: 'Submitted your first report',
    requirement: 1
  },
  COMMUNITY_HERO: {
    id: 'community_hero',
    name: 'Community Hero',
    icon: '🦸',
    description: 'Submitted 10 reports',
    requirement: 10
  },
  POTHOLE_HUNTER: {
    id: 'pothole_hunter',
    name: 'Pothole Hunter',
    icon: '🕳️',
    description: 'Reported 5 potholes',
    requirement: 5
  },
  VOTING_CHAMPION: {
    id: 'voting_champion',
    name: 'Voting Champion',
    icon: '🗳️',
    description: 'Cast 20 votes',
    requirement: 20
  },
  IMPACT_MAKER: {
    id: 'impact_maker',
    name: 'Impact Maker',
    icon: '💎',
    description: 'Your reports saved $10,000+',
    requirement: 10000
  }
};

// Get user stats
export async function getUserStats(userId) {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      // Initialize new user
      const initialStats = {
        points: 0,
        reportsSubmitted: 0,
        votesCast: 0,
        issuesFixed: 0,
        badges: [],
        totalImpact: 0,
        level: 1,
        joinedAt: new Date()
      };
      await setDoc(userRef, initialStats);
      return initialStats;
    }
  } catch (error) {
    console.error('Error getting user stats:', error);
    return null;
  }
}

// Award points
export async function awardPoints(userId, action, amount = null) {
  const points = amount || POINTS[action] || 0;
  
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      points: increment(points)
    });
    
    // Check for level up
    const stats = await getUserStats(userId);
    const newLevel = Math.floor(stats.points / 100) + 1;
    
    if (newLevel > stats.level) {
      await updateDoc(userRef, { level: newLevel });
      return { points, levelUp: true, newLevel };
    }
    
    return { points, levelUp: false };
  } catch (error) {
    console.error('Error awarding points:', error);
    return null;
  }
}

// Check and award badges
export async function checkBadges(userId) {
  try {
    const stats = await getUserStats(userId);
    const newBadges = [];
    
    // Check each badge requirement
    if (stats.reportsSubmitted >= 1 && !stats.badges.includes('first_reporter')) {
      newBadges.push(BADGES.FIRST_REPORTER);
    }
    
    if (stats.reportsSubmitted >= 10 && !stats.badges.includes('community_hero')) {
      newBadges.push(BADGES.COMMUNITY_HERO);
    }
    
    if (stats.votesCast >= 20 && !stats.badges.includes('voting_champion')) {
      newBadges.push(BADGES.VOTING_CHAMPION);
    }
    
    if (stats.totalImpact >= 10000 && !stats.badges.includes('impact_maker')) {
      newBadges.push(BADGES.IMPACT_MAKER);
    }
    
    // Award new badges
    if (newBadges.length > 0) {
      const userRef = doc(db, 'users', userId);
      const badgeIds = newBadges.map(b => b.id);
      await updateDoc(userRef, {
        badges: [...stats.badges, ...badgeIds]
      });
    }
    
    return newBadges;
  } catch (error) {
    console.error('Error checking badges:', error);
    return [];
  }
}

// Get leaderboard
export async function getLeaderboard(limitCount = 10) {
  try {
    const q = query(
      collection(db, 'users'),
      orderBy('points', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc, index) => ({
      id: doc.id,
      rank: index + 1,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    return [];
  }
}

// Calculate impact (money saved)
export function calculateImpact(reports) {
  return reports.reduce((total, report) => {
    if (report.status === 'fixed') {
      // Estimate cost savings based on severity
      const savings = {
        minor: 500,
        moderate: 2000,
        severe: 5000
      };
      return total + (savings[report.severity] || 1000);
    }
    return total;
  }, 0);
}

// Track report submission
export async function trackReportSubmission(userId) {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      reportsSubmitted: increment(1)
    });
    
    const result = await awardPoints(userId, 'REPORT_SUBMITTED');
    const badges = await checkBadges(userId);
    
    return { ...result, badges };
  } catch (error) {
    console.error('Error tracking report:', error);
    return null;
  }
}

// Track vote cast
export async function trackVoteCast(userId) {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      votesCast: increment(1)
    });
    
    const result = await awardPoints(userId, 'VOTE_CAST');
    const badges = await checkBadges(userId);
    
    return { ...result, badges };
  } catch (error) {
    console.error('Error tracking vote:', error);
    return null;
  }
}
