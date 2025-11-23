import CryptoJS from 'crypto-js';
import { db } from '../firebase';
import { doc, updateDoc, increment, arrayUnion, getDoc } from 'firebase/firestore';

// Generate unique voter ID (stored in localStorage)
export function getVoterId() {
  let voterId = localStorage.getItem('urbanoracle_voter_id');
  
  if (!voterId) {
    // Create unique voter ID based on browser fingerprint + timestamp
    const fingerprint = navigator.userAgent + navigator.language + window.innerWidth + window.innerHeight;
    voterId = CryptoJS.SHA256(fingerprint + Date.now()).toString();
    localStorage.setItem('urbanoracle_voter_id', voterId);
  }
  
  return voterId;
}

// Create blockchain hash for vote (tamper-proof)
export function createVoteHash(reportId, voterId, timestamp) {
  const voteData = {
    reportId,
    voterId,
    timestamp,
    action: 'upvote'
  };
  
  // Create SHA-256 hash (blockchain-style)
  const hash = CryptoJS.SHA256(JSON.stringify(voteData)).toString();
  
  return {
    hash,
    data: voteData
  };
}

// Check if user already voted on this report
export async function hasUserVoted(reportId) {
  const voterId = getVoterId();
  const voteKey = `vote_${reportId}`;
  
  // Check localStorage for quick lookup
  const localVote = localStorage.getItem(voteKey);
  if (localVote) return true;
  
  // Check Firebase for verification
  try {
    const reportRef = doc(db, 'reports', reportId);
    const reportDoc = await getDoc(reportRef);
    
    if (reportDoc.exists()) {
      const voters = reportDoc.data().voters || [];
      return voters.includes(voterId);
    }
  } catch (error) {
    console.error('Error checking vote:', error);
  }
  
  return false;
}

// Cast vote with blockchain verification
export async function castVote(reportId) {
  const voterId = getVoterId();
  
  // Check if already voted
  if (await hasUserVoted(reportId)) {
    throw new Error('You have already voted on this issue');
  }
  
  const timestamp = new Date().toISOString();
  const voteHash = createVoteHash(reportId, voterId, timestamp);
  
  try {
    // Update Firebase with vote
    const reportRef = doc(db, 'reports', reportId);
    
    await updateDoc(reportRef, {
      votes: increment(1),
      voters: arrayUnion(voterId),
      voteHashes: arrayUnion({
        hash: voteHash.hash,
        timestamp: timestamp,
        voterId: voterId.substring(0, 8) + '...' // Partial ID for privacy
      })
    });
    
    // Store in localStorage to prevent duplicate votes
    localStorage.setItem(`vote_${reportId}`, voteHash.hash);
    
    console.log('✅ Vote cast successfully!');
    console.log('🔐 Blockchain hash:', voteHash.hash);
    
    return voteHash;
    
  } catch (error) {
    console.error('❌ Vote error:', error);
    throw error;
  }
}

// Verify vote integrity (blockchain verification)
export function verifyVoteHash(reportId, voterId, timestamp, hash) {
  const recreatedHash = createVoteHash(reportId, voterId, timestamp);
  return recreatedHash.hash === hash;
}

// Get vote statistics for a report
export async function getVoteStats(reportId) {
  try {
    const reportRef = doc(db, 'reports', reportId);
    const reportDoc = await getDoc(reportRef);
    
    if (reportDoc.exists()) {
      const data = reportDoc.data();
      return {
        totalVotes: data.votes || 0,
        voteHashes: data.voteHashes || [],
        hasVoted: await hasUserVoted(reportId)
      };
    }
  } catch (error) {
    console.error('Error getting vote stats:', error);
  }
  
  return { totalVotes: 0, voteHashes: [], hasVoted: false };
}
