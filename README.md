# 🗳️ Election Process Assistant

> A modular, secure, and AI-powered web application designed to guide Indian citizens through the complete election process using Gemini AI, Firebase, and Google Maps.

![Firebase](https://img.shields.io/badge/Firebase-Hosting%20%7C%20Firestore%20%7C%20Analytics-orange)
![Gemini AI](https://img.shields.io/badge/Google-Gemini%20AI-blue)
![Maps](https://img.shields.io/badge/Google-Maps%20API-green)
![Architecture](https://img.shields.io/badge/Architecture-MVC-purple)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 📌 Problem Statement

Navigating the Indian election process can be overwhelming for many citizens due to complex registration procedures, dispersed information regarding polling locations, and a lack of accessible resources. The Election Process Assistant solves this by providing a unified, AI-driven platform that offers real-time, multilingual guidance, booth finding, and civic education.

## ✨ Features

- **🤖 AI Chat (Gemini 2.0 Flash)** — Ask anything about Indian elections in English, Hindi, or Punjabi. Includes robust input sanitization and rate limiting.
- **📋 Registration Guide** — Step-by-step voter registration walkthrough.
- **🗺️ Booth Finder** — Locate your nearest polling station with integrated Google Maps.
- **📝 Interactive Quiz** — Test your knowledge about the election process with immediate feedback.
- **⚖️ Voter Rights** — Interactive, accessible cards detailing fundamental voter rights.
- **🔒 Secure Architecture** — Clean MVC structure with rigorous input validation to prevent XSS and DoS attacks.
- **⚡ High Performance** — ES Modules, lazy loading, and critical CSS extraction.

---

## 🏗️ System Architecture

The project has been fully refactored into a modern **MVC (Model-View-Controller) architecture** to ensure maximum scalability and maintainability.

```text
Election-Process-Assistant/
├── index.html                   # View: Main UI
├── css/
│   └── style.css                # View: Styling
├── js/
│   ├── app.js                   # Application Entry Point
│   ├── controllers/             # Controllers: Handle UI events & logic
│   │   ├── chatController.js    
│   │   ├── quizController.js    
│   │   └── uiController.js      
│   ├── models/                  # Models: Data structures
│   │   └── quizModel.js         
│   ├── services/                # Services: API & backend integrations
│   │   ├── analyticsService.js  
│   │   ├── firebaseService.js   
│   │   ├── firestoreService.js  
│   │   ├── geminiService.js     
│   │   ├── mapsService.js       
│   │   └── mockApiService.js    
│   └── utils/                   # Utils: Shared helpers
│       └── validation.js        # Input sanitization & rate limiting
├── tests/
│   └── app.test.js              # Unit and Integration Tests (Jest)
├── firebase.json                # Firebase Configuration
└── package.json                 # Project Dependencies
```

### Explanation of Layers
1. **Controllers**: Act as the intermediary between the View (HTML) and Services/Models. They attach event listeners and manipulate the DOM based on user interaction.
2. **Services**: Encapsulate all external API calls (Firebase, Google Maps, Gemini AI). This abstracts complexity away from the UI.
3. **Models**: Contain structured static data (like the Quiz data).
4. **Utils**: House pure functions for security (sanitization) and validation, ensuring code reuse.

---

## 🛠️ Tech Stack

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6 Modules)
- **AI Engine**: Google Cloud Vertex / Gemini API
- **Backend/DB**: Firebase (Hosting, Firestore, Analytics)
- **Mapping**: Google Maps API
- **Testing**: Jest, JSDOM

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js v18+
- Firebase account
- Google Cloud account (for Gemini AI + Maps API)

### 1. Clone the Repository
```bash
git clone https://github.com/suryabhangolu/Election-Process-Assistant.git
cd Election-Process-Assistant
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory and add your keys:
```
GEMINI_API_KEY=your_gemini_api_key_here
FIREBASE_API_KEY=your_firebase_api_key_here
FIREBASE_PROJECT_ID=your_project_id_here
MAPS_API_KEY=your_maps_api_key_here
```
*(Note: As this is a frontend-only app hosted on Firebase, keys are injected into `config.js` via the build process or GitHub Actions CI/CD).*

### 4. Run Locally
We recommend using Vite or any static file server:
```bash
npx vite
# OR
python -m http.server 8000
```

---

## 🧪 Testing

The project includes a robust test suite covering security protocols, API error handling, and business logic using Jest.

```bash
# Run unit tests
npm test

# Run tests with coverage report
npm run test:coverage
```

### Test Coverage Includes:
- **Security**: XSS prevention (sanitization), Rate limiting logic.
- **API Reliability**: Gemini AI fallback scenarios, safety filter blocks, missing keys.
- **Business Logic**: Voter eligibility validation, mock constituency routing, quiz scoring.

---

## 💬 Usage Guide & Example Outputs

1. **Ask AI Chat**: 
   - *Input*: "What is Form 6?"
   - *Output*: The AI will securely process the input, display a loading indicator, and return the official use case for Form 6 (New Voter Registration).
2. **Find a Booth**:
   - Navigate to **Booth Finder**.
   - *Input*: "141001"
   - *Output*: Interactive Google Map with markers for polling stations in Ludhiana.
3. **Take the Quiz**:
   - Navigate to **Quiz**. Select answers and receive immediate, screen-reader friendly feedback indicating Correct/Incorrect status.

---

## 🔮 Future Improvements

- **User Authentication**: Implement Firebase Auth to allow users to save their polling booth and track their registration status across devices.
- **Backend API Layer**: Migrate direct Firebase calls to a Node.js/Express backend for enhanced API key security.
- **Real-Time Queue Data**: Integrate IoT or crowd-sourced data to show wait times at polling booths.
- **PWA Support**: Add a Service Worker and manifest to allow offline access to fundamental voter rights and forms.

---

<div align="center">
Built with ❤️ for **PromptWars Hackathon** on the **Antigravity Platform**<br>
*Empowering every Indian citizen to participate in democracy* 🇮🇳
</div>
