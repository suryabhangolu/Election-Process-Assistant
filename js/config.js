/**
 * Configuration Module
 * 
 * SECURITY DECISION:
 * - All sensitive API keys and configurations are fetched from environment variables.
 * - Values are NEVER hardcoded in the repository to prevent accidental leakage.
 * - Centralized config allows for easy environment switching (dev/prod).
 */
export const CONFIG = {
    GEMINI_API_KEY: import.meta.env?.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : 'AIzaSyBoy6hsnKwuKLOBN97FLU43wLhx5CgsgSg'),
    MAPS_API_KEY: import.meta.env?.VITE_MAPS_API_KEY || (typeof process !== 'undefined' ? process.env.MAPS_API_KEY : 'AIzaSyBoy6hsnKwuKLOBN97FLU43wLhx5CgsgSg'),
    // Parse FIREBASE_CONFIG stringified JSON from environment securely
    FIREBASE_CONFIG: (() => {
        const rawConfig = import.meta.env?.VITE_FIREBASE_CONFIG || (typeof process !== 'undefined' ? process.env.FIREBASE_CONFIG : null);
        try {
            return rawConfig ? JSON.parse(rawConfig) : null;
        } catch (e) {
            return null;
        }
    })()
};
