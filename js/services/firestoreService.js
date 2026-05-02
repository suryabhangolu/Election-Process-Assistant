import { collection, addDoc, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "./firebaseService.js";

/**
 * Saves a user query and its AI response to Firestore.
 * @param {string} userQuery - The question asked by the user.
 * @param {string} aiResponse - The AI generated response.
 * @returns {Promise<void>}
 */
export const saveUserQuery = async (userQuery, aiResponse) => {
    if (!userQuery || !aiResponse || typeof userQuery !== 'string' || typeof aiResponse !== 'string') {
        console.warn("saveUserQuery requires valid string inputs.");
        return;
    }

    if (!db) return;

    try {
        await addDoc(collection(db, "user_queries"), {
            query: userQuery,
            response: aiResponse,
            timestamp: new Date()
        });
    } catch (error) {
        console.error("Firestore save error:", error);
    }
};

/**
 * Retrieves the most recent user queries from Firestore.
 * @param {number} [limitNum=10] - The maximum number of queries to fetch.
 * @returns {Promise<Array<Object>>} An array of recent query objects.
 */
export const getRecentQueries = async (limitNum = 10) => {
    if (typeof limitNum !== 'number' || limitNum <= 0) {
        console.warn("getRecentQueries requires a positive number limit.");
        return [];
    }

    if (!db) return [];

    try {
        const q = query(collection(db, "user_queries"), orderBy("timestamp", "desc"), limit(limitNum));
        const querySnapshot = await getDocs(q);
        const results = [];
        querySnapshot.forEach((doc) => {
            results.push({ id: doc.id, ...doc.data() });
        });
        return results;
    } catch (error) {
        console.error("Firestore get error:", error);
        return [];
    }
};
