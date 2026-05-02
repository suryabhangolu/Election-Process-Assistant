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

/**
 * Toggles visibility of tab sections based on the clicked target.
 * @param {string} targetId - The ID of the section to show.
 * @returns {void}
 */
const toggleSections = (targetId) => {
  const sections = document.querySelectorAll('.tab-content');
  sections.forEach(sec => {
    if (sec.id === targetId) {
      sec.classList.add('active');
      sec.classList.remove('hidden');
    } else {
      sec.classList.remove('active');
      sec.classList.add('hidden');
    }
  });
};

/**
 * Updates the navigation buttons' aria-expanded attributes.
 * @param {EventTarget} clickedBtn - The button that was clicked.
 * @returns {void}
 */
const updateNavButtons = (clickedBtn) => {
  const navBtns = document.querySelectorAll('.nav-btn');
  navBtns.forEach(b => b.setAttribute('aria-expanded', 'false'));
  clickedBtn.setAttribute('aria-expanded', 'true');
};

/**
 * Sets up tab navigation events for the application.
 * Highlights the active tab and switches visible sections.
 * @returns {void}
 */
const setupNavigation = () => {
  try {
    const navBtns = document.querySelectorAll('.nav-btn');

    if (!navBtns.length) return;

    navBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetId = e.target.getAttribute('data-target');
        if (!targetId) return;
        
        updateNavButtons(e.target);
        toggleSections(targetId);

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

const quizData = [
  { question: "What is the minimum voting age in India?", options: [{text: "16", correct: false}, {text: "18", correct: true}, {text: "21", correct: false}] },
  { question: "What does EVM stand for?", options: [{text: "Electronic Voting Machine", correct: true}, {text: "Election Voting Method", correct: false}, {text: "Early Voting Machine", correct: false}] },
  { question: "Who conducts the national elections in India?", options: [{text: "Supreme Court", correct: false}, {text: "Election Commission of India", correct: true}, {text: "President", correct: false}] },
  { question: "What is NOTA?", options: [{text: "National Organization for Transparency", correct: false}, {text: "None of the Above", correct: true}, {text: "New Order of Tax Authority", correct: false}] },
  { question: "How often are general elections held in India?", options: [{text: "Every 4 years", correct: false}, {text: "Every 5 years", correct: true}, {text: "Every 6 years", correct: false}] }
];

let currentQuestionIndex = 0;
let score = 0;

/**
 * Handles user interaction when an option is selected in the quiz.
 * @param {Event} e - The click event object.
 * @returns {void}
 */
const handleQuizAnswer = (e) => {
  const isCorrect = checkAnswer(e.target.getAttribute('data-correct'));
  const quizBtns = document.querySelectorAll('.quiz-btn');
  const feedback = document.getElementById('quiz-feedback');
  const nextBtn = document.getElementById('quiz-next-btn');

  // Disable all options
  quizBtns.forEach(b => {
    b.disabled = true;
    b.classList.remove('correct', 'wrong');
  });

  feedback.classList.remove('sr-only');
  
  if (isCorrect) {
    e.target.classList.add('correct');
    feedback.textContent = "Correct!";
    feedback.className = "quiz-feedback success-text mt-4 font-bold text-accent";
    score++;
    trackUserAction("quiz_answer", { result: "correct" });
  } else {
    e.target.classList.add('wrong');
    feedback.textContent = "Incorrect. Try again next time!";
    feedback.className = "quiz-feedback error-text mt-4 font-bold text-accent";
    trackUserAction("quiz_answer", { result: "incorrect" });
  }

  // Show Next button if more questions exist
  if (currentQuestionIndex < quizData.length - 1) {
    nextBtn.classList.remove('hidden');
  } else {
    nextBtn.textContent = "Quiz Completed";
    nextBtn.classList.remove('hidden');
    nextBtn.disabled = true;
    const scoreEl = document.getElementById('quiz-score');
    if (scoreEl) {
      scoreEl.textContent = `You scored ${score} out of ${quizData.length}!`;
    }
  }
};

/**
 * Renders the current quiz question and its options.
 * @returns {void}
 */
const renderQuizQuestion = () => {
  const questionEl = document.getElementById('quiz-question');
  const optionsContainer = document.getElementById('quiz-options');
  const feedback = document.getElementById('quiz-feedback');
  const nextBtn = document.getElementById('quiz-next-btn');

  if (!questionEl || !optionsContainer || !feedback || !nextBtn) return;

  const currentQ = quizData[currentQuestionIndex];
  questionEl.textContent = currentQ.question;
  optionsContainer.innerHTML = '';
  
  feedback.classList.add('sr-only');
  feedback.textContent = '';
  nextBtn.classList.add('hidden');

  currentQ.options.forEach((opt) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-btn';
    btn.setAttribute('aria-label', `Option ${opt.text}`);
    btn.setAttribute('data-correct', opt.correct.toString());
    btn.textContent = opt.text;
    
    // Attach click listener for answering
    btn.addEventListener('click', handleQuizAnswer);
    optionsContainer.appendChild(btn);
  });
};

/**
 * Initializes quiz interaction logic and feedback display.
 * @returns {void}
 */
const setupQuiz = () => {
  try {
    const nextBtn = document.getElementById('quiz-next-btn');
    if (!nextBtn) return;
    
    nextBtn.addEventListener('click', () => {
      if (currentQuestionIndex < quizData.length - 1) {
        currentQuestionIndex++;
        renderQuizQuestion();
      }
    });

    renderQuizQuestion();
  } catch (error) {
    console.error("Error setting up quiz:", error);
  }
};

/**
 * Sets up the Rights cards interaction, replacing inline HTML handlers.
 * @returns {void}
 */
const setupRightsCards = () => {
  try {
    const rightCards = document.querySelectorAll('article.card[data-card]');
    rightCards.forEach(card => {
      card.addEventListener('click', () => {
        card.classList.toggle('highlight');
        const isExpanded = card.classList.contains('highlight');
        card.setAttribute('aria-expanded', isExpanded.toString());
      });
      // Replace deprecated onkeypress with keydown
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault(); // Prevent default scroll on space
          card.click();
        }
      });
    });
  } catch (error) {
    console.error("Error setting up rights cards:", error);
  }
};

/**
 * Dynamically loads external CSS files to comply with CSP.
 * @returns {void}
 */
const loadStyles = () => {
  const cssLink = document.createElement('link');
  cssLink.rel = 'stylesheet';
  cssLink.href = './css/style.css';
  document.head.appendChild(cssLink);
};

/**
 * Primary initialization function that bootstraps the app.
 * @returns {void}
 */
const init = () => {
  try {
    loadStyles();
    initFirebase();
    trackPageView("home");
    setupNavigation();
    setupChat();
    setupQuiz();
    setupRightsCards();
  } catch (error) {
    console.error("Application initialization error:", error);
  }
};

document.addEventListener('DOMContentLoaded', init);
