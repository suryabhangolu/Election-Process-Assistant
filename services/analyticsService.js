import { logEvent } from "firebase/analytics";
import { analytics } from "./firebaseService.js";

/**
 * Tracks a custom user action event in Firebase Analytics.
 * @param {string} action - The name of the action to track.
 * @param {Object} [details={}] - Additional details/parameters for the event.
 */
export const trackUserAction = (action, details = {}) => {
    if (!action || typeof action !== 'string') {
        console.warn("trackUserAction requires a valid action string.");
        return;
    }
    
    if (!analytics) return;

    try {
        logEvent(analytics, action, details);
    } catch (error) {
        console.error("Analytics tracking error:", error);
    }
};

/**
 * Tracks a search event with the provided query string.
 * @param {string} query - The search query term.
 */
export const trackSearch = (query) => {
    if (!query || typeof query !== 'string') return;
    trackUserAction("search", { search_term: query });
};

/**
 * Tracks a page view event.
 * @param {string} page - The name or path of the page viewed.
 */
export const trackPageView = (page) => {
    if (!page || typeof page !== 'string') return;
    trackUserAction("page_view", { page_path: page });
};
