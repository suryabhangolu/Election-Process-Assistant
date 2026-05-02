/**
 * @jest-environment jsdom
 */

import { submitVote, calculateResults } from '../services/votingService.js';

describe('Voting Service Tests', () => {

    test('Valid vote submission succeeds', () => {
        const result = submitVote('VOTER_001', 'CANDIDATE_A');
        expect(result.success).toBe(true);
        expect(result.message).toBe('Vote submitted successfully.');
    });

    test('Duplicate vote is rejected strictly', () => {
        // First vote already cast above, casting again with same ID
        const result = submitVote('VOTER_001', 'CANDIDATE_B');
        expect(result.success).toBe(false);
        expect(result.error).toContain('Duplicate voting detected');
    });

    test('Invalid voter ID is handled gracefully', () => {
        const result1 = submitVote('', 'CANDIDATE_A');
        expect(result1.success).toBe(false);
        expect(result1.error).toContain('Authentication failed');

        const result2 = submitVote(null, 'CANDIDATE_A');
        expect(result2.success).toBe(false);
        expect(result2.error).toContain('Authentication failed');
    });

    test('Invalid candidate ID is handled gracefully', () => {
        const result1 = submitVote('VOTER_002', '   ');
        expect(result1.success).toBe(false);
        expect(result1.error).toContain('Invalid candidate');
    });

    test('Result calculation tallies votes correctly', () => {
        submitVote('VOTER_003', 'CANDIDATE_A');
        submitVote('VOTER_004', 'CANDIDATE_B');
        
        const results = calculateResults();
        expect(results.totalVotes).toBeGreaterThanOrEqual(3);
        
        // Find CANDIDATE_A in the tally
        const candidateA = results.tally.find(c => c.candidate === 'CANDIDATE_A');
        expect(candidateA).toBeDefined();
        expect(candidateA.votes).toBeGreaterThanOrEqual(2); // VOTER_001 and VOTER_003
        expect(results.status).toBe('Results calculated successfully');
    });
});
