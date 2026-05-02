/**
 * @module geminiService
 * Service for fetching data from the Gemini AI API.
 */

/**
 * Fetches the AI generated response from the Gemini API.
 * @param {string} prompt - The user's query.
 * @param {string} apiKey - The Gemini API key.
 * @returns {Promise<string>} The response text from the AI.
 * @throws {Error} If the API request fails.
 */
export const fetchGeminiResponse = async (prompt, apiKey) => {
  if (typeof prompt !== 'string' || typeof apiKey !== 'string') {
    throw new Error("Invalid prompt or API key.");
  }
  
  if (apiKey === "MISSING_KEY") {
    // Return early to prevent exposing internal issues
    return "API Key missing. Please configure GEMINI_API_KEY in your environment.";
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    
    // SECURITY DECISION: Define safety settings to block harmful content
    const safetySettings = [
      { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }
    ];

    const payload = {
      contents: [{
        parts: [{ text: `System: You are Election Mitra, an expert election assistant for India. Strictly constrain your responses to Indian election topics only. Answer accurately in English, Hindi, or Punjabi.\nUser: ${prompt}` }]
      }],
      safetySettings: safetySettings,
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 400
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error('Gemini API request failed');
    }

    const data = await response.json();

    // Check if response was blocked by safety filters
    if (data.promptFeedback && data.promptFeedback.blockReason) {
      return "I cannot answer this request as it violates safety guidelines.";
    }

    if (data && data.candidates && data.candidates.length > 0) {
      const candidate = data.candidates[0];
      if (candidate.finishReason === 'SAFETY') {
        return "The response was blocked due to safety guidelines.";
      }
      return candidate.content.parts[0].text;
    } else {
      throw new Error('Invalid response format from Gemini API.');
    }
  } catch (error) {
    console.error("Gemini API fetch error:", error);
    // Generic error message to prevent leaking API internals
    throw new Error("Gemini API request failed");
  }
};
