import { sanitizeInput, checkRateLimit } from './app.js';
import { CONFIG } from './config.js';

/**
 * Gemini API Integration for AI Chat
 */
export const setupChat = () => {
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatLog = document.getElementById('chat-log');

    // Security: Fetch API key safely from config module
    const apiKey = CONFIG.GEMINI_API_KEY || "MISSING_KEY";

    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // SECURITY DECISION: Rate Limiting validation before processing
        if (!checkRateLimit()) {
            appendMessage("You are sending messages too quickly. Max 10 per minute allowed. Please wait.", 'ai-message', true);
            return;
        }

        const rawMessage = chatInput.value;
        if (!rawMessage.trim()) return;

        // SECURITY DECISION: Sanitize user input immediately (strips HTML and limits to 500 chars)
        const cleanMessage = sanitizeInput(rawMessage);
        
        appendMessage(cleanMessage, 'user-message');
        chatInput.value = '';

        const loadingId = appendMessage('...', 'ai-message', true);
        chatLog.setAttribute('aria-busy', 'true'); // Accessibility: Announce loading

        try {
            const responseText = await fetchGeminiResponse(cleanMessage, apiKey);
            updateMessage(loadingId, sanitizeInput(responseText)); 
        } catch (error) {
            updateMessage(loadingId, 'Sorry, I am unable to connect to the AI model right now.');
            const errorDiv = document.getElementById('chat-error');
            if (errorDiv) {
                errorDiv.textContent = 'Failed to fetch AI response.';
                errorDiv.classList.remove('sr-only');
            }
        } finally {
            chatLog.setAttribute('aria-busy', 'false'); // Accessibility: Stop loading announcement
        }
    });

    const appendMessage = (text, className, isAriaLive = false) => {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${className}`;
        msgDiv.innerHTML = text; // Safe here because `text` has already passed through `sanitizeInput`
        msgDiv.tabIndex = 0; 
        
        const id = 'msg-' + Date.now();
        msgDiv.id = id;

        if (isAriaLive) {
            msgDiv.setAttribute('aria-live', 'assertive');
        }

        chatLog.appendChild(msgDiv);
        chatLog.scrollTop = chatLog.scrollHeight;
        return id;
    };

    const updateMessage = (id, text) => {
        const el = document.getElementById(id);
        if (el) {
            el.innerHTML = text;
            el.removeAttribute('aria-live'); 
        }
    };
};

export const fetchGeminiResponse = async (prompt, apiKey) => {
    if (apiKey === "MISSING_KEY") return "API Key missing. Please configure GEMINI_API_KEY in your environment.";

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    
    const payload = {
        contents: [{
            parts: [{ text: `You are Election Mitra, an expert election assistant for India. Answer accurately in English, Hindi, or Punjabi. User says: ${prompt}` }]
        }]
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error('Gemini API request failed');

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
};
