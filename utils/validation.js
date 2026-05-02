/**
 * @module validation
 * Utility functions for input validation, sanitization, and security.
 */

const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const requestTimestamps = [];

/**
 * Sanitizes user input to prevent Cross-Site Scripting (XSS).
 * Strips HTML tags and limits the length to 500 characters.
 * @param {string} input - The raw user input.
 * @returns {string} The sanitized input string.
 */
export const sanitizeInput = (input) => {
  if (!input || typeof input !== 'string') return '';
  try {
    let cleanInput = input.trim().substring(0, 500);
    // Security: Basic regex to remove common HTML tags
    cleanInput = cleanInput.replace(/<\/?[^>]+(>|$)/g, "");
    return cleanInput;
  } catch (error) {
    console.error("Error sanitizing input:", error);
    return '';
  }
};

/**
 * Checks if the current request is within the allowed rate limit.
 * Used to prevent DoS or spam attacks.
 * @returns {boolean} True if the request is allowed, false otherwise.
 */
export const checkRateLimit = () => {
  try {
    const now = Date.now();
    // Maintain a sliding window of timestamps to track request frequency
    while (requestTimestamps.length > 0 && requestTimestamps[0] < now - RATE_LIMIT_WINDOW_MS) {
      requestTimestamps.shift();
    }
    
    if (requestTimestamps.length >= RATE_LIMIT_MAX) return false;
    
    requestTimestamps.push(now);
    return true;
  } catch (error) {
    console.error("Error in rate limiting:", error);
    return false; // Fail secure
  }
};

/**
 * Validates whether the provided answer is correct.
 * @param {string} isCorrect - String representation of a boolean ('true' or 'false').
 * @returns {boolean} True if the answer is correct.
 */
export const checkAnswer = (isCorrect) => {
  return isCorrect === 'true';
};
