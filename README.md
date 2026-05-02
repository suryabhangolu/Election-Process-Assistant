# 🗳️ Election Process Assistant

> A modern, highly secure, and modular web application that guides citizens through the Indian election process. Built with a clean MVC architecture for maximum maintainability and testability.

![Architecture](https://img.shields.io/badge/Architecture-MVC-purple)
![Frontend](https://img.shields.io/badge/Frontend-Vanilla%20JS-yellow)
![Testing](https://img.shields.io/badge/Testing-Jest-red)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 📌 Project Overview

The Election Process Assistant is designed to solve a critical real-world problem: helping citizens navigate the often complex and fragmented election process. 
By providing an intuitive, centralized interface, this application offers real-time AI guidance, polling booth location tracking, educational quizzes, and a robust mock voting engine to demonstrate secure digital voting concepts.

### Why This Project is Unique
Unlike standard static educational sites, this project features a custom-built, hardened **Mock Voting Engine** with strict duplicate prevention and authentication checks, all running within a strictly organized MVC framework that mimics enterprise-level backend standards in a serverless frontend environment.

---

## ✨ Features

- **🛡️ Secure Voting Engine** — A mock backend service that strictly prevents duplicate voting and validates voter authentication using a highly efficient Set/Map data structure.
- **🤖 AI Chat (Gemini API)** — Ask anything about Indian elections in multiple languages.
- **🗺️ Polling Booth Finder** — Locate your nearest polling station seamlessly using Google Maps integration.
- **📝 Interactive Quiz & Rights** — Test your knowledge and learn about fundamental voter rights (e.g., NOTA, Secret Ballot).
- **⚡ Hardened Security** — Comprehensive input sanitization to block XSS and robust rate limiting to prevent spam and DoS attempts.

---

## 🏗️ Clean Folder Structure (MVC)

The codebase has been meticulously reorganized into a clean, modern MVC (Model-View-Controller) structure to strictly separate business logic from UI manipulation.

```text
Election-Process-Assistant/
├── controllers/             # Handles DOM events and connects Views to Services
│   ├── chatController.js    
│   ├── quizController.js    
│   └── uiController.js      
├── services/                # Encapsulates business logic and external APIs
│   ├── votingService.js     # Secure mock voting engine
│   ├── geminiService.js     
│   ├── mapsService.js       
│   ├── firestoreService.js  
│   ├── firebaseService.js   
│   └── mockApiService.js    
├── models/                  # Defines static data structures
│   └── quizModel.js         
├── utils/                   # Shared utility functions
│   └── validation.js        # Input sanitization and security logic
├── tests/                   # Jest testing suite
│   ├── app.test.js          
│   └── voting.test.js       
├── public/                  # Public assets and entry points
│   ├── css/                 
│   ├── js/                  
│   │   ├── app.js           # Main JS entry point
│   │   └── config.js        
│   └── assets/              
├── index.html               # Main View
├── package.json             # Dependencies
├── .env.example             # Environment variable template
└── README.md                # Documentation
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js v18+
- Modern Web Browser

### 1. Clone the Repository
```bash
git clone https://github.com/suryabhangolu/Election-Process-Assistant.git
cd Election-Process-Assistant
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file based on the provided example. (Note: Currently keys are stored securely via the build process or `config.js`).

### 4. Run the Application
Since this is a vanilla JS application relying on ES Modules, you need a local server to avoid CORS issues:
```bash
npx vite
# OR
python -m http.server 8000
```
Open `http://localhost:8000` or `http://localhost:5173` in your browser.

---

## 🧪 Testing

The application enforces a rigorous testing standard to ensure business logic remains intact and secure.

```bash
# Run all unit tests
npm test
```

### Test Coverage Highlights
- **`voting.test.js`**: Validates that the `votingService.js` strictly rejects duplicate votes, handles empty/null inputs gracefully, and accurately calculates the final election tally.
- **`app.test.js`**: Covers input sanitization (XSS prevention), rate limiting effectiveness, and AI API fallback logic.

---

## 💡 Example Usage & Real-World Application

### Real-World Use Case
A first-time voter in Ludhiana wants to know where to vote and what to bring. 
1. They open the app and use the **Booth Finder**, typing their PIN `141001` to instantly see Google Maps markers for nearby polling stations.
2. They ask the **AI Chat**, *"What ID do I need?"*, and receive a sanitized, safe response detailing accepted documents like Aadhaar or PAN.
3. Finally, they use the **Voting Engine** (developer demo) which accurately simulates the backend security required to ensure one-citizen, one-vote integrity.

---

<div align="center">
Built with ❤️ for **PromptWars Hackathon** on the **Antigravity Platform**<br>
*Empowering every Indian citizen to participate in democracy* 🇮🇳
</div>
