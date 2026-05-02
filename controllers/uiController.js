import { initMap } from '../services/mapsService.js?v=3';
import { trackPageView } from '../services/analyticsService.js';

/**
 * @module uiController
 * Controls the main UI elements like navigation and right cards.
 */

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
export const setupNavigation = () => {
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

/**
 * Sets up the Rights cards interaction, replacing inline HTML handlers.
 * @returns {void}
 */
export const setupRightsCards = () => {
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
