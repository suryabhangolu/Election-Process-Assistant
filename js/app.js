import { setupChat } from './gemini.js';
import { initMap } from './maps.js';
import { initFirebase } from './firebase.js';
import { trackPageView, trackUserAction } from './analytics.js';

/**
 * @module app
 * Main Application Logic
 * Contains input sanitization, rate limiting, and application initialization.
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

/**
 * Sets up tab navigation events for the application.
 * Highlights the active tab and switches visible sections.
 */
const setupNavigation = () => {
    try {
        const navBtns = document.querySelectorAll('.nav-btn');
        const sections = document.querySelectorAll('.tab-content');

        if (!navBtns.length || !sections.length) return;

        navBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetId = e.target.getAttribute('data-target');
                if (!targetId) return;
                
                navBtns.forEach(b => b.setAttribute('aria-expanded', 'false'));
                e.target.setAttribute('aria-expanded', 'true');

                sections.forEach(sec => {
                    if (sec.id === targetId) {
                        sec.classList.add('active');
                        sec.classList.remove('hidden');
                    } else {
                        sec.classList.remove('active');
                        sec.classList.add('hidden');
                    }
                });

                if (targetId === 'map-section') {
                    initMap();
                }
                trackPageView(targetId);
            });
        });
    } catch (error) {
        console.error("Error setting up navigation:", error);
    }
};

/**
 * Initializes quiz interaction logic and feedback display.
 */
const setupQuiz = () => {
    try {
        const quizBtns = document.querySelectorAll('.quiz-btn');
        const feedback = document.getElementById('quiz-feedback');

        if (!quizBtns.length || !feedback) return;

        quizBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const isCorrect = checkAnswer(e.target.getAttribute('data-correct'));
                
                quizBtns.forEach(b => {
                    b.disabled = true;
                    b.classList.remove('correct', 'wrong');
                });

                feedback.classList.remove('sr-only');
                
                if (isCorrect) {
                    e.target.classList.add('correct');
                    feedback.textContent = "Correct! 18 is the minimum voting age.";
                    feedback.className = "success-text";
                    trackUserAction("quiz_answer", { result: "correct" });
                } else {
                    e.target.classList.add('wrong');
                    feedback.textContent = "Incorrect. The correct answer is 18.";
                    feedback.className = "error-text";
                    trackUserAction("quiz_answer", { result: "incorrect" });
                }
            });
        });
    } catch (error) {
        console.error("Error setting up quiz:", error);
    }
};

/**
 * Primary initialization function that bootstraps the app.
 */
const init = () => {
    try {
        // Load CSS dynamically for CSP compatibility
        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = 'css/style.css';
        document.head.appendChild(cssLink);

        initFirebase();
        trackPageView("home");
        setupNavigation();
        setupChat();
        setupQuiz();
    } catch (error) {
        console.error("Application initialization error:", error);
    }
};

document.addEventListener('DOMContentLoaded', init);
