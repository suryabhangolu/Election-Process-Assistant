# 🇮🇳 Election Mitra — AI-Powered Election Education Platform

> **Aapka Apna Native Election Assistant** | Built for the Google AI Hackathon

[![Gemini AI](https://img.shields.io/badge/Gemini_1.5_Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![Firebase](https://img.shields.io/badge/Firebase_Hosting-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Google Maps](https://img.shields.io/badge/Google_Maps_API-34A853?style=for-the-badge&logo=google-maps&logoColor=white)](https://developers.google.com/maps)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Jest](https://img.shields.io/badge/Jest_Tested-C21325?style=for-the-badge&logo=jest&logoColor=white)](https://jestjs.io/)
[![WCAG 2.1 AA](https://img.shields.io/badge/WCAG_2.1_AA-Compliant-2E8B57?style=for-the-badge)](https://www.w3.org/WAI/WCAG21/quickref/)

---

## 🎯 Problem Statement

India has **96.8 crore registered voters** — yet millions remain uninformed about:
- How to register / verify their name on voter rolls
- Where their polling booth is located
- What their voting rights actually are
- Election processes in their own regional language

**Election Mitra** solves this with an AI-powered, fully accessible, multilingual web app — bringing civic education to every citizen, on any device, in any language.

---

## ✨ Live Demo

🔗 **[election-mitra.web.app](https://election-mitra.web.app)** *(Firebase Hosted)*

---

## 🏆 Hackathon Scoring — All 6 Criteria Fulfilled

### 1. 🧹 Code Quality

| Practice | Implementation |
|---|---|
| Modular Architecture | Separate ES6 modules: `app.js`, `gemini.js`, `maps.js`, `firebase.js` |
| Clean Code | Descriptive variable names, JSDoc comments, zero `console.log` in production |
| Separation of Concerns | UI logic, API calls, and analytics are fully decoupled |
| Build Tool | Vite for fast HMR dev + optimized production builds |

### 2. 🔐 Security

| Threat | Mitigation |
|---|---|
| API Key Exposure | Keys loaded exclusively via `import.meta.env` (Vite) — never hardcoded |
| XSS Attacks | User input rendered via `textContent` before `innerHTML` conversion — DOM-safe |
| Content Security Policy | Strict CSP `<meta>` tags: `script-src` and `connect-src` restricted to Google/Firebase origins only |
| Secret Leak Prevention | `.env` is in `.gitignore`; only `.env.example` (with empty values) is committed |

### 3. ⚡ Efficiency

| Optimization | Details |
|---|---|
| Lazy Loading | Google Maps JS API is **not** loaded on boot — injected dynamically only when "Booth Finder" tab is clicked |
| Zero Dependencies | Pure Vanilla HTML, CSS, JS — no jQuery, no Bootstrap, no bloat |
| Tiny Bundle | Entire codebase is a few KB — far under the 10MB limit |
| Inline SVGs | All icons/images are inline SVGs — zero HTTP requests for assets |
| Deferred Scripts | Non-critical JS uses `defer` attribute |

### 4. 🧪 Testing

Unit tests written with **Jest**, covering the most critical application logic:

```bash
npm test
```

| Test Suite | What It Covers |
|---|---|
| XSS Sanitization | Verifies malicious HTML tags are stripped from chat input |
| Quiz Boolean Logic | Validates correct/incorrect answer evaluation |
| Prompt Formatting | Ensures Gemini prompt is correctly structured before API call |

> Tests located in `tests/app.test.js`

### 5. ♿ Accessibility (WCAG 2.1 AA Compliant)

Full compliance — verified against WCAG 2.1 Level AA guidelines:

- **Color Contrast** — Dark purple (`#12051f`) + Yellow (`#facc15`) theme exceeds the minimum 4.5:1 ratio
- **Screen Reader Support** — `aria-live="polite"` on chat/quiz containers so dynamic updates are announced automatically
- **Keyboard Navigation** — All interactive elements reachable via Tab; custom `focus-visible` rings on every button
- **Skip Link** — "Skip to main content" is the very first element in the DOM
- **ARIA Attributes** — `aria-expanded`, `aria-controls` on all tabs; `aria-label` on all icon buttons
- **Alt Text** — Every SVG has a descriptive `aria-label`; decorative SVGs have `aria-hidden="true"`
- **SR-Only Content** — `.sr-only` class used for context that is visually implied but needs to be spoken

### 6. 🟦 Google Services Integration

| Service | How It's Used |
|---|---|
| **Gemini 1.5 Flash** | Powers the multilingual AI chat — answers voter questions in Hindi, English, and regional languages |
| **Google Maps JS API** | Interactive map in the Booth Finder tab — shows nearest polling stations with markers |
| **Firebase Hosting** | Production deployment with global CDN, custom domain, and HTTPS |
| **Firebase Analytics** | Tracks feature usage (which questions are asked most, which tabs are used) |

---

## 🌟 Key Features

### 🤖 AI Smart Assistant (Gemini Powered)
Ask anything in **Hindi, English, Punjabi, or any Indian language**. The assistant answers questions about voter registration, EPIC cards, booth locations, election dates, voting rights, and more — in a friendly, conversational Hinglish tone.

### 🗺️ Polling Booth Finder (Google Maps)
Enter your **Pin Code** → instantly see your nearest polling booths on an interactive Google Map with address and timing details.

### 📋 Step-by-Step Voter Registration Guide
Visual, numbered guide walking first-time voters through Form 6, the Voter Helpline App, and online registration at `voters.eci.gov.in`.

### 🧠 Election Quiz
Gamified quiz to test and improve knowledge of Indian election law, voting procedures, and voter rights. Includes instant feedback and score tracking.

### 📜 Voting Rights & EVM Information
Clear, card-based information on voter rights, EVM/VVPAT process, election code of conduct, and how to report violations.

---

## 💻 Tech Stack

```
Frontend     → HTML5, CSS3, Vanilla ES6 JavaScript
Build Tool   → Vite
AI           → Google Gemini 1.5 Flash API
Maps         → Google Maps JavaScript API
Hosting      → Firebase Hosting
Analytics    → Firebase Analytics
Testing      → Jest
```

---

## ⚙️ How to Run Locally

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/election-mitra.git
cd election-mitra
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root based on `.env.example`:

```bash
cp .env.example .env
```

Fill in your keys:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_GOOGLE_MAPS_API_KEY=your_maps_key_here
VITE_FIREBASE_API_KEY=your_firebase_key_here
VITE_FIREBASE_PROJECT_ID=your_project_id_here
```

> ⚠️ **Never commit your `.env` file.** It is already in `.gitignore`.

### 4. Start Development Server
```bash
npm start
```
App runs at `http://localhost:5173`

### 5. Run Tests
```bash
npm test
```

### 6. Build for Production
```bash
npm run build
```

### 7. Deploy to Firebase
```bash
npm run build
firebase deploy
```

---

## 📁 Project Structure

```
election-mitra/
├── index.html              # Main HTML — semantic, accessible markup
├── .env.example            # Template for required environment variables
├── .gitignore              # Excludes .env and node_modules
├── vite.config.js          # Vite build configuration
├── package.json            # Dependencies and npm scripts
├── firebase.json           # Firebase hosting config with cache headers
│
├── css/
│   └── style.css           # Mobile-first responsive styles
│
├── js/
│   ├── app.js              # Main app logic, tab navigation, UI state
│   ├── gemini.js           # Gemini API integration, prompt formatting
│   ├── maps.js             # Google Maps lazy loader, booth marker logic
│   └── firebase.js         # Firebase init, analytics event logging
│
└── tests/
    └── app.test.js         # Jest unit tests
```

---

## 🔒 Security Notes

- API keys are **never** present in the committed codebase
- Content Security Policy is enforced via `<meta http-equiv="Content-Security-Policy">` restricting all external connections to Google-owned domains
- All user input to Gemini is sanitized to prevent XSS before rendering
- Firebase security rules are configured to allow only read access on public data

---

## 🌐 Accessibility Statement

Election Mitra is built for **every Indian citizen**, including those using assistive technologies. It meets **WCAG 2.1 Level AA** standards and has been tested for:

- VoiceOver (macOS/iOS)
- NVDA (Windows)
- Keyboard-only navigation

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change. Make sure all `npm test` tests pass before submitting a PR.

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

## 👨‍💻 Built With ❤️ for Bharat

*Election Mitra — Har vote ki awaaz, AI ki zubaani.*
