# 🗳️ Election Process Assistant

> An AI-powered assistant that helps Indian citizens understand and navigate the complete election process — built with Google Gemini AI, Firebase, and Google Maps.

![Evaluation Score](https://img.shields.io/badge/AI%20Evaluation-92.37%25-blue)
![Firebase](https://img.shields.io/badge/Firebase-Hosting%20%7C%20Firestore%20%7C%20Analytics-orange)
![Gemini AI](https://img.shields.io/badge/Google-Gemini%20AI-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 🚀 Live Demo

🌐 **[election-process-assistant.web.app](https://election-process-assistant.web.app)**

---

## ✨ Features

- 🤖 **Gemini AI Powered Q&A** — Ask anything about the Indian election process in Hindi or English
- 🗺️ **Google Maps Integration** — Find your nearest polling station by location
- 🔥 **Firebase Firestore** — Stores user queries and responses in real-time
- 📊 **Firebase Analytics** — Tracks user interactions and page views
- 🔐 **Secure Configuration** — Environment-based API key management
- 🌐 **Bilingual Support** — Responds in Hindi and English
- ♿ **Accessible Design** — Built with inclusive interaction patterns
- ⚡ **Optimized Performance** — Fast load times with efficient resource usage

---

## 🛠️ Tech Stack

| Technology | Usage |
|---|---|
| Google Gemini AI | Natural language Q&A engine |
| Firebase Firestore | Real-time database for query storage |
| Firebase Analytics | User behavior tracking |
| Firebase Hosting | Production deployment |
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
│       └── ci.yml          # GitHub Actions CI/CD
├── assets/
│   └── idle.json           # Lottie animation
├── css/
│   └── style.css           # Main stylesheet
├── js/
│   ├── app.js              # Main application logic
│   ├── analytics.js        # Firebase Analytics tracking
│   ├── config.js           # Configuration management
│   ├── firebase.js         # Firebase initialization
│   ├── firestore.js        # Firestore database operations
│   ├── gemini.js           # Gemini AI integration
│   ├── maps.js             # Google Maps integration
│   └── mockApi.js          # Mock API for testing
├── tests/
│   ├── app.test.js         # App logic tests
│   ├── firebase.test.js    # Firebase tests
│   ├── gemini.test.js      # Gemini AI tests
│   └── maps.test.js        # Maps tests
├── .env.example            # Environment variables template
├── firebase.json           # Firebase configuration
├── index.html              # Main HTML file
├── package.json            # Dependencies and scripts
└── README.md               # Project documentation
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- Firebase account
- Google Cloud account (for Gemini AI + Maps API)

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/Election-Process-Assistant.git
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
```env
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

# Run tests with coverage report
npm run test:coverage

# Watch mode (auto re-run on file changes)
npm run test:watch
```

### Test Coverage Goals
| Module | Coverage |
|---|---|
| app.js | 85%+ |
| gemini.js | 90%+ |
| firestore.js | 85%+ |
| maps.js | 80%+ |

---

## 🚀 Deployment

### Deploy to Firebase Hosting
```bash
# Build and deploy
firebase deploy

# Preview before deploying
firebase hosting:channel:deploy preview
```

### CI/CD Pipeline
Every push to `main` branch automatically:
1. Installs dependencies
2. Runs all tests
3. Checks code linting
4. Deploys to Firebase (on success)

---

## 🗣️ How to Use

1. **Open the app** in your browser
2. **Type your question** in Hindi or English, for example:
   - *"मतदाता पहचान पत्र कैसे बनवाएं?"*
   - *"How do I register to vote in India?"*
   - *"What is Form 6 for voter registration?"*
3. **Find polling station** — click the map icon and allow location access
4. **Get instant AI answers** powered by Google Gemini

---

## 📊 AI Evaluation Scores

| Category | Score |
|---|---|
| Efficiency | 100% |
| Accessibility | 98.75% |
| Problem Statement Alignment | 98% |
| Security | 97.5% |
| Code Quality | 86.25% |
| Testing | 82.5% |
| Google Services | 75% |
| **Overall** | **92.37%** |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

Built for **PromptWars Hackathon** on the **Antigravity Platform**

---

*Empowering every Indian citizen to participate in democracy* 🇮🇳
