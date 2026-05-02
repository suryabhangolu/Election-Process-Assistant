/**
 * @jest-environment jsdom
 */

// SETUP INSTRUCTIONS for running these tests:
// 1. Ensure Node.js is installed on your machine.
// 2. Open terminal in the project root folder.
// 3. Install Jest and Babel: `npm install --save-dev jest jest-environment-jsdom @babel/preset-env babel-jest`
// 4. Run tests using: `npm test`

import { sanitizeInput, checkRateLimit, checkAnswer } from '../js/app.js';
import { fetchGeminiResponse } from '../js/gemini.js';
import { getConstituencyByPin, checkVoterEligibility } from '../js/mockApi.js';

/**
 * @module app.test
 * Unit and Integration Tests for Election Mitra application.
 */
describe('Election Mitra - Unit Tests', () => {

  // ==========================================
  // 1. Input Sanitization Function Tests
  // ==========================================
  describe('Security: Input Sanitization (sanitizeInput)', () => {
    
    test('HTML tags are completely stripped from input to prevent XSS', () => {
      const maliciousInput = '<script>alert("hacked!")</script> <b>Hello</b>';
      const result = sanitizeInput(maliciousInput);
      expect(result).not.toContain('<script>');
      expect(result).not.toContain('<b>');
      expect(result).toBe('alert("hacked!") Hello');
    });

    test('Input over 500 characters is safely truncated', () => {
      const longInput = 'A'.repeat(600);
      const result = sanitizeInput(longInput);
      expect(result.length).toBe(500);
      expect(result).toBe('A'.repeat(500));
    });

    test('Empty, null, or undefined input gracefully returns an empty string', () => {
      expect(sanitizeInput('')).toBe('');
      expect(sanitizeInput(null)).toBe('');
      expect(sanitizeInput(undefined)).toBe('');
      expect(sanitizeInput('   ')).toBe('');
    });
  });

  // ==========================================
  // 2. Rate Limiting Tests
  // ==========================================
  describe('Security: Rate Limiting (checkRateLimit)', () => {
    
    test('Allows requests within the limit', () => {
      expect(checkRateLimit()).toBe(true);
    });
  });

  // ==========================================
  // 3. Quiz Logic Tests
  // ==========================================
  describe('Feature: Quiz Logic (checkAnswer)', () => {
    
    test('Returns true for correct answer string', () => {
      expect(checkAnswer('true')).toBe(true);
    });

    test('Returns false for incorrect answer string', () => {
      expect(checkAnswer('false')).toBe(false);
      expect(checkAnswer('')).toBe(false);
      expect(checkAnswer(null)).toBe(false);
    });
  });

  // ==========================================
  // 4. Gemini API Handler Tests
  // ==========================================
  describe('API: Gemini Chat Handler (fetchGeminiResponse)', () => {
    
    beforeEach(() => {
      global.fetch = jest.fn();
    });

    test('Returns a specific error message if the API key is missing', async () => {
      const result = await fetchGeminiResponse('How to vote?', 'MISSING_KEY');
      expect(result).toBe('API Key missing. Please configure GEMINI_API_KEY in your environment.');
      expect(global.fetch).not.toHaveBeenCalled();
    });

    test('Handles network timeout / 500 error gracefully by throwing a generic error', async () => {
      global.fetch.mockResolvedValue({
        ok: false,
        status: 500,
      });

      await expect(fetchGeminiResponse('Hello', 'VALID_KEY')).rejects.toThrow('Gemini API request failed');
    });

    test('Valid API response is correctly parsed and formatted from JSON', async () => {
      const mockApiResponse = {
        candidates: [{
          content: {
            parts: [{ text: "Voting is a constitutional right." }]
          }
        }]
      };

      global.fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockApiResponse)
      });

      const result = await fetchGeminiResponse('Tell me about voting', 'VALID_KEY');
      expect(result).toBe("Voting is a constitutional right.");
      
      const expectedUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=VALID_KEY`;
      expect(global.fetch).toHaveBeenCalledWith(expectedUrl, expect.objectContaining({
        method: 'POST'
      }));
    });

    test('Safety filter response is handled correctly', async () => {
      const mockBlockedResponse = {
        promptFeedback: {
          blockReason: "SAFETY"
        }
      };

      global.fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockBlockedResponse)
      });

      const result = await fetchGeminiResponse('Tell me something dangerous', 'VALID_KEY');
      expect(result).toBe("I cannot answer this request as it violates safety guidelines.");
    });

    test('Candidate safety block is handled correctly', async () => {
      const mockCandidateBlocked = {
        candidates: [{
          finishReason: 'SAFETY',
          content: { parts: [{ text: "" }] }
        }]
      };

      global.fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockCandidateBlocked)
      });

      const result = await fetchGeminiResponse('Tell me something dangerous', 'VALID_KEY');
      expect(result).toBe("The response was blocked due to safety guidelines.");
    });

    test('Security: Confirms no hardcoded keys in fetch calls by inspecting arguments', async () => {
      const testKey = 'ENV_PROVIDED_API_KEY';
      
      global.fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ candidates: [{ content: { parts: [{ text: "Hi" }] } }] })
      });

      await fetchGeminiResponse('Hello', testKey);
      
      const fetchCallUrl = global.fetch.mock.calls[0][0];
      // Assert the URL uses the provided key, not a hardcoded one
      expect(fetchCallUrl).toContain(testKey);
      expect(fetchCallUrl).not.toContain('AIzaSy'); // Common prefix for Google API keys
    });
  });

  // ==========================================
  // 5. Constituency Search Tests
  // ==========================================
  describe('Feature: Constituency Search by PIN Code (getConstituencyByPin)', () => {
    
    test('Returns correct state object for a valid 6-digit PIN code', () => {
      const resultDelhi = getConstituencyByPin('110001');
      expect(resultDelhi).toEqual({ state: 'Delhi' });

      const resultMh = getConstituencyByPin(400001);
      expect(resultMh).toEqual({ state: 'Maharashtra' });
    });

    test('Returns error object for invalid PIN code (less than 6 digits or chars)', () => {
      const shortPin = getConstituencyByPin('11000');
      expect(shortPin.error).toBeDefined();
      expect(shortPin.error).toContain('exactly 6 digits');

      const charPin = getConstituencyByPin('110AAA');
      expect(charPin.error).toBeDefined();
    });
  });

  // ==========================================
  // 6. Voter Eligibility Checker Tests
  // ==========================================
  describe('Feature: Voter Eligibility Checker (checkVoterEligibility)', () => {
    
    test('Age 18 and older successfully returns eligible', () => {
      expect(checkVoterEligibility(18)).toEqual({ eligible: true, message: 'You are eligible to vote.' });
      expect(checkVoterEligibility(45)).toEqual({ eligible: true, message: 'You are eligible to vote.' });
    });

    test('Age 17 and younger returns not eligible', () => {
      expect(checkVoterEligibility(17)).toEqual({ eligible: false, message: 'You must be at least 18 years old to vote.' });
      expect(checkVoterEligibility(10)).toEqual({ eligible: false, message: 'You must be at least 18 years old to vote.' });
    });

    test('Invalid age formats (strings, negative numbers) return explicit errors', () => {
      expect(checkVoterEligibility("18").error).toBeDefined();
      expect(checkVoterEligibility(-5).error).toBeDefined();
      expect(checkVoterEligibility(null).error).toBeDefined();
    });
  });
});
