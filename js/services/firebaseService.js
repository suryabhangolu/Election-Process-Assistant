import { CONFIG } from '../config.js';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

export let app, analytics, db;

/**
 * Initializes Firebase App, Analytics, and Firestore instances using configuration.
 * Sets the module-level exports to the initialized instances.
 */
export const initFirebase = () => {
    try {
        const firebaseConfig = CONFIG.FIREBASE_CONFIG;

        if (!firebaseConfig || typeof firebaseConfig !== 'object') {
            console.warn("Firebase config is missing or invalid in environment variables.");
            return;
        }

        app = initializeApp(firebaseConfig);
        analytics = getAnalytics(app);
        db = getFirestore(app);
    } catch (error) {
        console.error("Firebase initialization error:", error);
    }
};
