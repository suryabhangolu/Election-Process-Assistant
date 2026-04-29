# 🗳️ Election Mitra IN

> An AI-powered assistant that helps every Indian citizen understand and navigate the complete election process — in Hindi and English.

![Firebase](https://img.shields.io/badge/Firebase-Hosting%20%7C%20Firestore%20%7C%20Analytics-orange)
![Gemini AI](https://img.shields.io/badge/Google-Gemini%20AI-blue)
![Maps](https://img.shields.io/badge/Google-Maps%20API-green)
![License](https://img.shields.io/badge/License-MIT-yellow)
![CI](https://img.shields.io/badge/CI-GitHub%20Actions-brightgreen)

---

## 🌐 Live Demo

👉 **[election-process-494716.web.app](https://election-process-494716.web.app)**

---

## ✨ Features

- 🤖 **AI Chat** — Ask anything about Indian elections powered by Google Gemini AI
- 📋 **Registration Guide** — Step-by-step voter registration walkthrough
- 🗺️ **Booth Finder** — Locate your nearest polling station with Google Maps
- 📝 **Election Quiz** — Test your knowledge about the election process
- ⚖️ **Voter Rights** — Know your rights as an Indian voter
- 🌐 **Bilingual Support** — Fully supports Hindi and English
- ♿ **Accessible Design** — Inclusive interaction patterns for all users
- 🔐 **Secure** — Environment-based API key management
- ⚡ **Fast Performance** — Optimized load times and efficient resource usage

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Google Gemini AI | Natural language Q&A engine |
| Firebase Hosting | Live production deployment |
| Firebase Firestore | Real-time database for query storage |
| Firebase Analytics | User behavior and event tracking |
| Google Maps API | Polling station finder |
| Vanilla JavaScript | Frontend logic |
| Jest | Unit and integration testing |
| GitHub Actions | CI/CD pipeline |

---

## 📁 Project Structure

```
Election-Process-Assistant/
├── .github/
│   └── workflows/
│       └── ci.yml           # GitHub Actions CI/CD
├── assets/
│   └── idle.json            # Lottie animation
├── css/
│   └── style.css            # Main stylesheet
├── js/
│   ├── app.js               # Main application logic
│   ├── analytics.js         # Firebase Analytics tracking
│   ├── config.js            # Configuration management
│   ├── firebase.js          # Firebase initialization
│   ├── firestore.js         # Firestore database operations
│   ├── gemini.js            # Gemini AI integration
│   ├── maps.js              # Google Maps integration
│   └── mockApi.js           # Mock API for testing
├── tests/
│   ├── app.test.js          # App logic tests
│   ├── firebase.test.js     # Firebase tests
│   ├── gemini.test.js       # Gemini AI tests
│   └── maps.test.js         # Maps tests
├── .env.example             # Environment variables template
├── firebase.json            # Firebase configuration
├── index.html               # Main HTML file
├── package.json             # Dependencies and scripts
└── README.md                # Project documentation
```

---

## ⚙️ Setup & Installation

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
```bash
cp .env.example .env
```

Edit `.env` and add your API keys:
```
GEMINI_API_KEY=your_gemini_api_key_here
FIREBASE_API_KEY=your_firebase_api_key_here
FIREBASE_PROJECT_ID=your_project_id_here
MAPS_API_KEY=your_maps_api_key_here
```

### 4. Firebase Setup
```bash
npm install -g firebase-tools
firebase login
firebase init
```

---

## 🧪 Running Tests

```bash
# Run all tests
npm test

# Run with coverage report
npm run test:coverage

# Watch mode
npm run test:watch
```

---

## 🚀 Deployment

```bash
# Deploy to Firebase Hosting
firebase deploy

# Preview before deploying
firebase hosting:channel:deploy preview
```

### CI/CD Pipeline
Every push to `main` branch automatically:
1. Installs dependencies
2. Runs all tests
3. Checks code linting
4. Reports results

---

## 💬 How to Use

1. Open the **live link** above
2. Click **AI Chat** tab
3. Type your question in Hindi or English:
   - *"मतदाता पहचान पत्र कैसे बनवाएं?"*
   - *"How do I register to vote in India?"*
   - *"What is NOTA?"*
   - *"What is Form 6?"*
4. Use **Booth Finder** to locate your nearest polling station
5. Take the **Quiz** to test your election knowledge

---

## 🤝 Contributing

1. Fork the repository
2. Create your branch: `git checkout -b feature/AmazingFeature`
3. Commit changes: `git commit -m 'Add AmazingFeature'`
4. Push: `git push origin feature/AmazingFeature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">

Built with ❤️ for **PromptWars Hackathon** on the **Antigravity Platform**

*Empowering every Indian citizen to participate in democracy* 🇮🇳

</div>
