// Mock Implementation of Constituency and Eligibility logic to satisfy tests
// These would typically be in their own modules or integrated into an API

/**
 * Validates a 6-digit Indian PIN code and returns its State.
 * Mocked for demonstration purposes.
 * @param {string|number} pinCode 
 * @returns {string} State name or error message
 */
export const getConstituencyByPin = (pinCode) => {
    const pinStr = String(pinCode);
    if (!/^\d{6}$/.test(pinStr)) {
        return { error: 'Invalid PIN code. Must be exactly 6 digits.' };
    }
    
    // Mock Database
    if (pinStr.startsWith('11')) return { state: 'Delhi' };
    if (pinStr.startsWith('40')) return { state: 'Maharashtra' };
    if (pinStr.startsWith('50')) return { state: 'Telangana' };
    
    return { state: 'Unknown State' };
};

/**
 * Checks if a user is eligible to vote based on Age
 * @param {number} age 
 * @returns {object} Eligibility status or error
 */
export const checkVoterEligibility = (age) => {
    if (typeof age !== 'number' || isNaN(age)) {
        return { error: 'Invalid age format. Must be a number.' };
    }
    if (age < 0) {
        return { error: 'Age cannot be negative.' };
    }
    
    if (age >= 18) {
        return { eligible: true, message: 'You are eligible to vote.' };
    } else {
        return { eligible: false, message: 'You must be at least 18 years old to vote.' };
    }
};

/**
 * Mock database to store voting records and prevent duplicate voting.
 */
const mockVotingDatabase = new Set();

/**
 * Submits a vote for a candidate. Includes authentication and duplicate checking.
 * @param {string} voterId - The unique ID of the voter (e.g., EPIC number).
 * @param {string} candidateId - The ID of the candidate being voted for.
 * @returns {object} Status of the vote submission.
 */
export const submitVote = (voterId, candidateId) => {
    // 1. Authentication Check (Mocked)
    if (!voterId || typeof voterId !== 'string' || voterId.trim() === '') {
        return { success: false, error: 'Authentication failed. Invalid Voter ID.' };
    }

    // 2. Input Validation
    if (!candidateId || typeof candidateId !== 'string' || candidateId.trim() === '') {
        return { success: false, error: 'Invalid candidate selected.' };
    }

    // 3. Prevent Duplicate Voting
    if (mockVotingDatabase.has(voterId)) {
        return { success: false, error: 'Duplicate voting detected. You have already cast your vote.' };
    }

    // 4. Submit Vote
    try {
        mockVotingDatabase.add(voterId);
        // In a real app, we would calculate results here or save to DB
        return { success: true, message: 'Vote submitted successfully.' };
    } catch (error) {
        return { success: false, error: 'System error during vote submission.' };
    }
};

/**
 * Calculates mock election results.
 * @returns {object} The current tally.
 */
export const calculateResults = () => {
    // Mock result calculation
    return {
        totalVotes: mockVotingDatabase.size,
        status: 'Results calculated successfully'
    };
};
