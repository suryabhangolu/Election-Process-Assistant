# Election Mitra 🇮🇳 - Election Process Assistant

A complete, accessible, and highly secure Election Process Education web application built to guide Indian citizens through the voting process, educate them on their rights, and assist them in finding their polling booths.

## 📖 Project Description

Election Mitra is an interactive platform designed to democratize access to electoral information. By leveraging cutting-edge AI technologies and cloud infrastructure, it provides real-time, multilingual assistance for voter queries, guides users through the registration process, offers interactive quizzes for civic education, and presents a seamlessly integrated map experience to help citizens locate their nearest polling booths.

The project strictly adheres to best practices in performance, accessibility (WCAG AA), security (CSP, input sanitization), and modular software architecture.

## ✨ Features

- **Gemini AI Integration**: Real-time, intelligent, and context-aware multilingual chat support (English, Hindi, Punjabi) powered by the Gemini 2.0 Flash model.
- **Firebase Infrastructure**: 
  - **Firestore**: Securely saves user queries and AI responses to a cloud database for historical analysis and review.
- **Google Maps Integration**: Interactive "Booth Finder" module. Dynamically loads the Maps API to find polling stations based on PIN codes, rendering markers with fallback accessibility options.
- **Firebase Analytics**: Robust event tracking system capturing custom user actions, page views, and specific search queries to help measure application engagement.
- **Secure & Robust**: Implements strict Content Security Policy (CSP), aggressive input sanitization, dynamic API key retrieval from environment variables, and client-side rate limiting.
- **Fully Accessible**: Comprehensive screen-reader support, dynamic ARIA tags (`aria-live`, `aria-busy`), semantic HTML, and high-contrast visuals conforming to WCAG standards.

## 💻 Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla ES6 JavaScript (No heavy frameworks for blazing fast performance).
- **Build Tool**: Vite (for rapid development and optimized production bundling).
- **Testing Framework**: Jest with JSDOM and Code Coverage reporting.
- **Cloud & AI Services**:
  - Google Gemini API (Generative Language)
  - Google Maps JavaScript API
  - Firebase App, Firestore, Analytics (v9 Modular SDK)
- **CI/CD**: GitHub Actions for automated testing and linting.

## ⚙️ Setup Instructions

Follow these steps to set up the project locally:

1. **Clone the Repository**
   ```bash
   git clone <your-repository-url>
   cd Election-Process-Assistant
   ```

2. **Install Dependencies**
   Ensure you have Node.js v18+ installed, then run:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory (you can use `.env.example` as a template) and add your API credentials:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   VITE_MAPS_API_KEY=your_google_maps_api_key_here
   VITE_FIREBASE_CONFIG={"apiKey":"...","authDomain":"...","projectId":"...","storageBucket":"...","messagingSenderId":"...","appId":"...","measurementId":"..."}
   ```
   *Note: Ensure `VITE_FIREBASE_CONFIG` is a valid stringified JSON object containing your Firebase project credentials.*

4. **Start the Development Server**
   ```bash
   npm start
   ```
   This will spin up the Vite development server, usually accessible at `http://localhost:5173`.

## 🧪 How to Run Tests

The application is comprehensively covered by a robust Jest test suite targeting components like the AI assistant, map rendering logic, and Firestore connections.

- **Run Standard Tests:**
  ```bash
  npm test
  ```

- **Run Tests with Code Coverage:**
  ```bash
  npm run test:coverage
  ```
  *Coverage reports are generated in the `coverage/` directory. Open `coverage/lcov-report/index.html` in your browser for detailed insights.*

- **Run Code Linter:**
  ```bash
  npm run lint
  ```

## 🚀 Deployment Steps

The project is optimized for deployment on modern static hosting platforms like Firebase Hosting, Vercel, or Netlify.

### General Build Process
1. Run the build script to generate the optimized production bundle:
   ```bash
   npm run build
   ```
2. The bundled static files will be placed into the `dist/` directory.

### Deploying to Firebase Hosting
1. Install the Firebase CLI globally if you haven't already:
   ```bash
   npm install -g firebase-tools
   ```
2. Login to your Firebase account:
   ```bash
   firebase login
   ```
3. Initialize Firebase in the repository (if not done yet):
   ```bash
   firebase init hosting
   ```
   *Select your project, set the public directory to `dist`, configure as a single-page app (`No`), and set up automatic builds/deploys via GitHub if desired.*
4. Deploy the application:
   ```bash
   firebase deploy --only hosting
   ```

---
*Developed with ❤️ for the Google AI Hackathon.*
