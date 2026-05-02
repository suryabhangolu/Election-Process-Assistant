/**
 * @module config
 * Configuration Module
 * 
 * SECURITY DECISION:
 * - All sensitive API keys and configurations are fetched from environment variables.
 * - Values are NEVER hardcoded in the repository to prevent accidental leakage.
 * - Centralized config allows for easy environment switching (dev/prod).
 */

/**
 * Validates and retrieves the configuration object.
 * @returns {Object} The application configuration object containing API keys and settings.
 */
const loadConfig = () => {
    try {
        const geminiKey = import.meta.env?.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : 'MISSING_KEY');
        const mapsKey = import.meta.env?.VITE_MAPS_API_KEY || (typeof process !== 'undefined' ? process.env.MAPS_API_KEY : 'MISSING_KEY');
        
        let firebaseConfig = null;
        const rawConfig = import.meta.env?.VITE_FIREBASE_CONFIG || (typeof process !== 'undefined' ? process.env.FIREBASE_CONFIG : null);
        
        if (rawConfig) {
            try {
                firebaseConfig = JSON.parse(rawConfig);
            } catch (e) {
                console.warn("Failed to parse FIREBASE_CONFIG JSON:", e);
            }
        }
        
        return {
            GEMINI_API_KEY: geminiKey,
            MAPS_API_KEY: mapsKey,
            FIREBASE_CONFIG: firebaseConfig
        };
    } catch (error) {
        console.error("Configuration load error:", error);
        return { GEMINI_API_KEY: null, MAPS_API_KEY: null, FIREBASE_CONFIG: null };
    }
};

export const CONFIG = loadConfig();
