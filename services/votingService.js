/**
 * @module votingService
 * Handles the secure submission of votes and tallying of results.
 */

/**
 * Mock database to store voting records and prevent duplicate voting.
 * @type {Set<string>}
 */
const mockVotingDatabase = new Set();
const candidateVotes = new Map();

/**
 * Submits a vote for a candidate. Includes authentication and duplicate checking.
 * @param {string} voterId - The unique ID of the voter (e.g., EPIC number).
 * @param {string} candidateId - The ID of the candidate being voted for.
 * @returns {object} Status of the vote submission.
 */
export const submitVote = (voterId, candidateId) => {
    // 1. Input Validation & Authentication
    if (!voterId || typeof voterId !== 'string' || voterId.trim() === '') {
        return { success: false, error: 'Authentication failed. Invalid Voter ID.' };
    }

    if (!candidateId || typeof candidateId !== 'string' || candidateId.trim() === '') {
        return { success: false, error: 'Invalid candidate selected.' };
    }

    const cleanVoterId = voterId.trim();
    const cleanCandidateId = candidateId.trim();

    // 2. Prevent Duplicate Voting strictly
    if (mockVotingDatabase.has(cleanVoterId)) {
        return { success: false, error: 'Duplicate voting detected. You have already cast your vote.' };
    }

    // 3. Submit Vote with try/catch for safety
    try {
        mockVotingDatabase.add(cleanVoterId);
        
        // Tally the vote
        if (candidateVotes.has(cleanCandidateId)) {
            candidateVotes.set(cleanCandidateId, candidateVotes.get(cleanCandidateId) + 1);
        } else {
            candidateVotes.set(cleanCandidateId, 1);
        }
        
        return { success: true, message: 'Vote submitted successfully.' };
    } catch (error) {
        return { success: false, error: 'System error during vote submission.' };
    }
};

/**
 * Calculates mock election results.
 * @returns {object} The current tally and total votes.
 */
export const calculateResults = () => {
    try {
        const resultsArray = [];
        for (let [candidate, votes] of candidateVotes.entries()) {
            resultsArray.push({ candidate, votes });
        }
        
        // Sort by votes descending
        resultsArray.sort((a, b) => b.votes - a.votes);

        return {
            totalVotes: mockVotingDatabase.size,
            tally: resultsArray,
            status: 'Results calculated successfully'
        };
    } catch (error) {
        return {
            totalVotes: 0,
            tally: [],
            status: 'Error calculating results'
        };
    }
};
