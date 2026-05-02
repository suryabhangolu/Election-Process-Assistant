import { setupChat } from '../../controllers/chatController.js?v=3';
import { setupQuiz } from '../../controllers/quizController.js?v=3';
import { setupNavigation, setupRightsCards } from '../../controllers/uiController.js?v=3';
import { initMap } from '../../services/mapsService.js?v=3';
import { initFirebase } from '../../services/firebaseService.js?v=3';
import { trackPageView } from '../../services/analyticsService.js?v=3';

/**
 * @module app
 * Main Application Entry Point
 * Initializes services and controllers on DOMContentLoaded.
 */

/**
 * Dynamically loads external CSS files to comply with CSP.
 * @returns {void}
 */
const loadStyles = () => {
  const cssLink = document.createElement('link');
  cssLink.rel = 'stylesheet';
  cssLink.href = './public/css/style.css';
  document.head.appendChild(cssLink);
};

/**
 * Primary initialization function that bootstraps the app.
 * Integrates controllers and services.
 * @returns {void}
 */
const init = () => {
  try {
    loadStyles();
    initFirebase();
    trackPageView("home");
    
    // Initialize Controllers
    setupNavigation();
    setupChat();
    setupQuiz();
    setupRightsCards();
  } catch (error) {
    console.error("Application initialization error:", error);
  }
};

document.addEventListener('DOMContentLoaded', init);
