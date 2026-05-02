import { sanitizeInput, checkRateLimit } from '../utils/validation.js';
import { fetchGeminiResponse } from '../services/geminiService.js';
import { CONFIG } from '../public/js/config.js?v=2';
import { saveUserQuery } from '../services/firestoreService.js';

/**
 * @module chatController
 * Controller for AI Chat UI interaction.
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
 * Handles the submit event for the chat.
 * @param {Event} e - The form submission or button click event.
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
    const chatSubmitBtn = document.getElementById('chat-submit-btn');
    const chatInput = document.getElementById('chat-input');
    const chatLog = document.getElementById('chat-log');
    const suggestionChips = document.querySelectorAll('.suggestion-chip');

    if (!chatSubmitBtn || !chatInput || !chatLog) return;

    // Security: Fetch API key safely from config module
    const apiKey = CONFIG.GEMINI_API_KEY || "MISSING_KEY";

    // Add event listeners for the new floating suggestion chips
    suggestionChips.forEach(chip => {
      chip.addEventListener('click', () => {
        chatInput.value = chip.textContent;
        // Trigger submit securely
        chatSubmitBtn.click();
      });
    });

    chatSubmitBtn.addEventListener('click', (e) => handleChatSubmit(e, chatInput, chatLog, apiKey));
    
    // Support enter key in input
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        chatSubmitBtn.click();
      }
    });
  } catch (error) {
    console.error("Setup chat error:", error);
  }
};
