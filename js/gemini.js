import { sanitizeInput, checkRateLimit } from './app.js';
import { CONFIG } from './config.js';
import { saveUserQuery } from './firestore.js';

/**
 * @module gemini
 * Gemini API Integration for AI Chat.
 */

/**
 * Appends a message to the chat log UI.
 * @param {string} text - The text to display.
 * @param {string} className - The CSS class for the message bubble.
 * @param {boolean} isAriaLive - Whether the message should trigger an aria-live announcement.
 * @param {HTMLElement} chatLog - The chat log container element.
 * @returns {string} The auto-generated ID of the message element.
 */
const appendMessage = (text, className, isAriaLive, chatLog) => {
  try {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${className}`;
    msgDiv.innerHTML = text; // Safe here because `text` has already passed through `sanitizeInput`
    msgDiv.tabIndex = 0; 
    
    const id = 'msg-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    msgDiv.id = id;

    if (isAriaLive) {
      msgDiv.setAttribute('aria-live', 'assertive');
    }

    chatLog.appendChild(msgDiv);
    chatLog.scrollTop = chatLog.scrollHeight;
    return id;
  } catch (error) {
    console.error("Error appending message:", error);
    return '';
  }
};

/**
 * Updates the text content of an existing message.
 * @param {string} id - The ID of the message element.
 * @param {string} text - The new sanitized text to display.
 * @returns {void}
 */
const updateMessage = (id, text) => {
  if (!id || typeof id !== 'string') return;
  try {
    const el = document.getElementById(id);
    if (el) {
      el.innerHTML = text;
      el.removeAttribute('aria-live'); 
    }
  } catch (error) {
    console.error("Error updating message:", error);
  }
};

/**
 * Handles the submit event for the chat form.
 * @param {Event} e - The form submission event.
 * @param {HTMLInputElement} chatInput - The input element.
 * @param {HTMLElement} chatLog - The chat log container.
 * @param {string} apiKey - The API key.
 * @returns {Promise<void>}
 */
const handleChatSubmit = async (e, chatInput, chatLog, apiKey) => {
  e.preventDefault();
  
  let loadingId = null;
  try {
    // SECURITY DECISION: Rate Limiting validation before processing
    if (!checkRateLimit()) {
      appendMessage("You are sending messages too quickly. Max 10 per minute allowed. Please wait.", 'ai-message', true, chatLog);
      return;
    }

    const rawMessage = chatInput.value;
    if (!rawMessage || typeof rawMessage !== 'string' || !rawMessage.trim()) return;

    // SECURITY DECISION: Sanitize user input immediately
    const cleanMessage = sanitizeInput(rawMessage);
    
    appendMessage(cleanMessage, 'user-message', false, chatLog);
    chatInput.value = '';

    loadingId = appendMessage('...', 'ai-message', true, chatLog);
    chatLog.setAttribute('aria-busy', 'true'); // Accessibility: Announce loading

    const responseText = await fetchGeminiResponse(cleanMessage, apiKey);
    updateMessage(loadingId, sanitizeInput(responseText)); 
    saveUserQuery(cleanMessage, responseText);
  } catch (error) {
    console.error("Chat processing error:", error);
    if (loadingId) {
      updateMessage(loadingId, 'Sorry, I am unable to connect to the AI model right now.');
    }
    const errorDiv = document.getElementById('chat-error');
    if (errorDiv) {
      errorDiv.textContent = 'Failed to fetch AI response.';
      errorDiv.classList.remove('sr-only');
    }
  } finally {
    chatLog.setAttribute('aria-busy', 'false');
  }
};

/**
 * Initializes the AI Chat UI events and handles user submissions.
 * @returns {void}
 */
export const setupChat = () => {
  try {
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatLog = document.getElementById('chat-log');
    const suggestionChips = document.querySelectorAll('.suggestion-chip');

    if (!chatForm || !chatInput || !chatLog) return;

    // Security: Fetch API key safely from config module
    const apiKey = CONFIG.GEMINI_API_KEY || "MISSING_KEY";

    // Add event listeners for the new floating suggestion chips
    suggestionChips.forEach(chip => {
      chip.addEventListener('click', () => {
        chatInput.value = chip.textContent;
        // Trigger form submission securely
        chatForm.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      });
    });

    chatForm.addEventListener('submit', (e) => handleChatSubmit(e, chatInput, chatLog, apiKey));
  } catch (error) {
    console.error("Setup chat error:", error);
  }
};

/**
 * Generates a predefined fallback response based on user keywords when the AI API fails.
 * @param {string} prompt - The user's sanitized query.
 * @returns {string} The predefined answer.
 */
const getFallbackResponse = (prompt) => {
  const lowerPrompt = prompt.toLowerCase();
  
  if (lowerPrompt.includes("age") || lowerPrompt.includes("how old") || lowerPrompt.includes("umar")) {
    return "The minimum voting age in India is 18 years. You must be 18 on or before January 1st of the year the electoral roll is revised.";
  }
  if (lowerPrompt.includes("register") || lowerPrompt.includes("apply") || lowerPrompt.includes("form 6")) {
    return "To register as a new voter, you need to fill out Form 6. You can do this online through the Voter's Service Portal (voters.eci.gov.in) or offline at your local ERO office.";
  }
  if (lowerPrompt.includes("document") || lowerPrompt.includes("proof") || lowerPrompt.includes("id")) {
    return "Valid documents for voter registration include: Aadhaar Card, PAN Card, Driving License, Indian Passport, or a recent utility bill for address proof.";
  }
  if (lowerPrompt.includes("nri") || lowerPrompt.includes("overseas")) {
    return "NRI voters can register using Form 6A. However, to cast your vote, you currently must be physically present at your designated polling booth in India.";
  }
  if (lowerPrompt.includes("booth") || lowerPrompt.includes("where to vote")) {
    return "You can find your polling booth using the 'Booth Finder' tab on this app, or by checking the Voter Helpline App/ECI portal with your EPIC number.";
  }
  if (lowerPrompt.includes("nota")) {
    return "NOTA stands for 'None of the Above'. It allows voters to express their disapproval of all candidates. However, it does not affect the election outcome; the candidate with the most valid votes still wins.";
  }

  return "I am currently operating in offline fallback mode. While I cannot answer complex queries right now, I can help you with basic information regarding voting age, registration, documents, or NOTA. Please ask about these topics!";
};

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
