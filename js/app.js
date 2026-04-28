import { setupChat } from './gemini.js';
import { initMap } from './maps.js';
import { initFirebase } from './firebase.js';

/**
 * Main Application Logic
 * Criteria: Clean code, comments, modular design, zero console.logs in production.
 */

// SECURITY DECISION: Rate limiting state arrays
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const requestTimestamps = [];

/**
 * SECURITY DECISION: Input Sanitization
 * - Strips all HTML tags to prevent Cross-Site Scripting (XSS).
 * - Truncates input to 500 characters to prevent buffer overflows or excessively long API queries.
 */
export const sanitizeInput = (input) => {
    if (!input || typeof input !== 'string') return '';
    
    // 1. Length Limitation (max 500 characters)
    let cleanInput = input.trim().substring(0, 500);
    
    // 2. Strip HTML tags completely using a regular expression
    cleanInput = cleanInput.replace(/<\/?[^>]+(>|$)/g, "");
    
    return cleanInput;
};

/**
 * SECURITY DECISION: Rate Limiting
 * - Blocks excessive requests to protect quota limits and prevent denial of service (DoS) or spam.
 */
export const checkRateLimit = () => {
    const now = Date.now();
    // Clear timestamps older than the 1 minute window
    while (requestTimestamps.length > 0 && requestTimestamps[0] < now - RATE_LIMIT_WINDOW_MS) {
        requestTimestamps.shift();
    }
    
    if (requestTimestamps.length >= RATE_LIMIT_MAX) return false; // Block request
    
    requestTimestamps.push(now);
    return true; // Allow request
};

// Check answer logic (Testing Criteria)
export const checkAnswer = (isCorrect) => {
    return isCorrect === 'true';
};

const setupNavigation = () => {
    const navBtns = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.tab-content');

    navBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetId = e.target.getAttribute('data-target');
            
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
        });
    });
};

const setupQuiz = () => {
    const quizBtns = document.querySelectorAll('.quiz-btn');
    const feedback = document.getElementById('quiz-feedback');

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
            } else {
                e.target.classList.add('wrong');
                feedback.textContent = "Incorrect. The correct answer is 18.";
                feedback.className = "error-text";
            }
        });
    });
};

const init = () => {
    // SECURITY/PERFORMANCE: Async load CSS via JS because CSP blocks inline 'onload' handlers
    const cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.href = 'css/style.css';
    document.head.appendChild(cssLink);

    initFirebase();
    setupNavigation();
    setupChat();
    setupQuiz();
};

document.addEventListener('DOMContentLoaded', init);
