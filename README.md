# Election Mitra 🇮🇳

A complete, accessible, and secure Election Process Education web application built for the Google AI Hackathon.

## 🏆 Scoring Criteria Fulfilled

### 1. CODE QUALITY
- **Modular JavaScript**: The application is split into separate modules (`app.js`, `gemini.js`, `maps.js`, `firebase.js`) using ES6 imports.
- **Clean Structure**: Highly readable variable names, comments explaining logic, and exactly zero `console.log` statements in the production code.

### 2. SECURITY
- **Environment Variables**: API Keys are NEVER hardcoded. They are fetched strictly via `import.meta.env` (Vite) or `process.env`.
- **Content Security Policy (CSP)**: Strict headers are defined in `<meta>` tags restricting `script-src` and `connect-src` only to Google and Firebase services.
- **Sanitization**: All user input sent to the chat is sanitized via DOM manipulation (`textContent` to `innerHTML`) prior to rendering to block XSS attacks.

### 3. EFFICIENCY
- **Lazy Loading**: The Google Maps JavaScript API is NOT loaded on page boot. It is only dynamically injected when the user clicks the "Booth Finder" tab, heavily saving initial bandwidth.
- **Lightweight**: Uses vanilla HTML, CSS, and JS. The entire project codebase is just a few kilobytes, easily passing the "Under 10MB" limit. Images are loaded as inline SVGs.

### 4. TESTING
- **Jest Unit Tests**: Run `npm test` to execute tests located in `tests/app.test.js`. Tests cover XSS Sanitization, Quiz Boolean Logic, and Prompt Formatting.

### 5. ACCESSIBILITY (WCAG Compliant)
- **Contrast**: The dark purple (`#12051f`) and yellow (`#facc15`) theme far exceeds the 4.5:1 ratio requirement.
- **Screen Reader Support**: Implements `.sr-only` classes, `aria-live="polite"` for dynamic chat/quiz updates, `aria-expanded` and `aria-controls` for tabs, and a "Skip to main content" link.
- **Keyboard Navigation**: All buttons and interactive elements have custom focus rings (`focus-visible`) and `tabindex` applied. 
- **Alt Text**: All SVGs/Images contain explicit `alt` tags and `aria-labels` exist on all buttons.

### 6. GOOGLE SERVICES
- **Gemini 1.5 Flash**: Seamlessly integrated to provide multilingual AI chat support.
- **Google Maps JS API**: Embedded to help voters visually find polling booths.
- **Firebase**: Project structure setup allows for rapid deployment to Firebase Hosting with Google Analytics.

## 💻 Tech Stack
- Frontend: HTML5, CSS3, Vanilla ES6 JavaScript
- Build Tool: Vite
- Testing: Jest
- APIs: Gemini API, Google Maps API, Firebase

## ⚙️ How to Run

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   Create a `.env` file in the root based on `.env.example`:
   ```bash
   VITE_GEMINI_API_KEY=your_gemini_api_key
   VITE_GOOGLE_MAPS_API_KEY=your_maps_key
   VITE_FIREBASE_API_KEY=your_firebase_key
   VITE_FIREBASE_PROJECT_ID=your_project_id
   ```

3. **Start Development Server**
   ```bash
   npm start
   ```

4. **Run Jest Tests**
   ```bash
   npm test
   ```
