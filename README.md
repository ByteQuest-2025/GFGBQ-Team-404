# 🛡️ Sentinel - Real-Time Audio Fraud Prevention

> **Sentinel** is an intelligent, real-time audio analysis platform designed to protect vulnerable populations such as the elderly and first-time internet users from the rising tide of voice-based scams. Unlike traditional systems that analyze fraud after a transaction is complete, Sentinel identifies malicious intent during the live conversation.

## 🚀 Hackathon Submission - ByteQuest 2025

### 🔗 **Live Demo**
🌐 **Deployed Application:** 

### 🎥 **Video Demonstration**
📹 **Demo Video:** https://drive.google.com/file/d/1MA9mIha2QagzHtgVGWOk0l_Fq8oL44Wp/view?usp=sharing

### 📊 **Presentation**
📄 **Project Presentation (PPT):** https://drive.google.com/file/d/1MA9mIha2QagzHtgVGWOk0l_Fq8oL44Wp/view?usp=sharing

### 👥 **Team 404**
- Naga Gayathri Upadhyayula
- Harshitha B.
---

## 🎯 Problem Statement

### **Targeting the Vulnerable**
Fraudsters exploit elderly and digitally unaware users through phone calls, taking advantage of their trust and limited digital literacy.

### **Psychological Pressure**
Scams use urgency, fear, and emotional manipulation which are difficult for users to identify in the heat of the moment.

### **Protection Gap**
Most current tools offer post-transaction analysis, which works after the damage is done, leaving users unprotected during the actual call.

## 💡 Solution Overview

Sentinel is an AI-powered, browser-based application that monitors phone calls in real-time and alerts users to potential scams before they fall victim.

## ✨ Key Features

### 🎤 **Real-Time Transcription**
- Converts speech to text instantly using Web Speech API
- Live microphone capture using Web APIs
- Continuous listening with no recording or data storage
- 100% privacy-focused - conversations never leave your device

### 🧠 **AI-Powered Detection**
- Identifies scam patterns using pattern matching & optional AI (Google Gemini)
- **7 Detection Categories:**
  - 👮 Authority Impersonation (IRS, Police, Banks, RBI)
  - 🔐 Credential Requests (OTP, PIN, CVV)
  - ⚠️ Financial Threats (Account suspension, legal action)
  - 💳 Payment Requests (Gift cards, wire transfers)
  - 🖥️ Remote Access Attempts (AnyDesk, TeamViewer)
  - ⏰ Urgency Pressure Tactics
  - 🤫 Secrecy Demands

### 📊 **Visual Risk Meter**
- Shows threat level from 0-100% with color coding
- Real-time risk scoring that updates as conversation progresses
- Three-tier verdict system: Low Risk (Green) | Suspicious (Yellow) | High Risk (Red)
- Dangerous combination detection (Authority + Urgency + Credentials)

### 🚨 **Instant Alerts**
- Displays specific warnings with confidence scores
- Real-time transcript display
- Animated alerts for detected threats
- Clear, actionable warnings in simple language

### 🆘 **Emergency Protection**
- One-click "Stop Detection" button to end monitoring
- Immediate threat notifications
- Color-coded risk indicators that are impossible to miss

### 📚 **Educational Sidebar**
- Teaches users about common scam tactics
- Interactive architecture diagram showing detection process
- Real-time explanations of what's being analyzed
- Helps users understand why alerts are triggered

### 📄 **Call Analysis Report**
- Live transcript visible during conversation
- Shows detected patterns and risk factors
- Downloadable summary (coming soon)
- Complete breakdown of threat indicators

### 👴 **Elder-Friendly UI**
- Large fonts and clear button labels
- Simple, intuitive interface with minimal complexity
- Clear visual warnings with emojis for easy recognition
- High contrast colors for better visibility
- No technical jargon - plain language explanations

## 🔒 Privacy-First Design

- **Zero Data Persistence** - Nothing is stored or saved
- **No Backend Servers** - All processing happens in your browser
- **No Database Storage** - No cloud uploads or remote storage
- **No localStorage or Cookies** - No tracking of any kind
- **All Processing In-Browser** - Your data never leaves your device
- **Temporary State Only** - All data cleared when you stop detection
- **No Recording** - Audio is analyzed in real-time, never recorded
- **Open Source** - Fully transparent and auditable code

## 🌟 Why Sentinel?

### **Real-Time Protection, Not Post-Mortem Analysis**
Traditional fraud detection systems analyze transactions after they happen. Sentinel protects you **during** the call, when you can still prevent the damage.

### **Built for Everyone, Especially the Vulnerable**
- **No Technical Knowledge Required** - Simple one-click operation
- **Visual Feedback** - Clear color-coded warnings anyone can understand
- **Plain Language** - No confusing technical terms or jargon
- **Large UI Elements** - Designed for elderly users with vision challenges

### **Complete Privacy**
Your conversations are sacred. Sentinel analyzes everything locally in your browser with zero data collection, storage, or transmission.

### **Free & Accessible**
No subscriptions, no premium features locked away. Full protection available to everyone, regardless of economic status.
## 📖 Usage
## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│  Step 1: Audio Capture                                  │
│  navigator.mediaDevices.getUserMedia()                  │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│  Step 2: Speech-to-Text                                 │
│  Web Speech API (webkitSpeechRecognition)               │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│  Step 3: Scam Detection                                 │
│  Pattern Matching + Optional AI Analysis                │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│  Step 4: Display Alerts                                 │
│  Real-time UI updates with threat warnings              │
└─────────────────────────────────────────────────────────┘
```

## 🛠️ Tech Stack

### Frontend

- HTML5 + CSS3 + JavaScript (ES6+)
- Single-file architecture (~25KB)
- Zero dependencies, instant deployment

### Browser APIs (Free)

- Web Speech API - Real-time transcription
- MediaDevices API - Microphone access
- Fetch API - Async operations

### Pattern Matching 

- 20 scam categories
- 350+ weighted keywords
- <2ms detection speed

### AI Enhancement

- Google Gemini 1.5 Flash
- Free tier: 60 req/min
- JSON structured output
- Risk score override capability

## 📊 Detection Algorithm

### Pattern Matching Engine
```javascript
// Example: Authority Impersonation Detection
keywords: ['rbi', 'police', 'irs', 'bank manager', 'customs']
weight: 30 points
trigger: "👮 Authority Impersonation Detected"
```

### Risk Scoring
- **0-34%** → Low Risk (Green)
- **35-69%** → Suspicious (Yellow)
- **70-100%** → High Risk (Red)

### Combo Detection
- Authority + Urgency + Credentials = **+20 bonus points**
- Example: "IRS calling, need your SSN immediately" → 85% High Risk

## 🎓 How It Works

1. **Audio Capture**: Microphone captures live audio
2. **Transcription**: Web Speech API converts speech to text
3. **Analysis**: Pattern matching scans for scam indicators
4. **Scoring**: Risk score calculated based on detected patterns
5. **Alerts**: UI displays warnings in real-time

## 🔐 Security & Privacy

- **No Data Collection**: Nothing is stored or transmitted
- **No Backend**: All processing happens client-side
- **No Tracking**: No analytics, cookies, or localStorage
- **Open Source**: Fully transparent and auditable
- **Local Processing**: Your conversations never leave your device

## 📦 Build for Production

```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

Deploy the `dist/` folder to any static hosting service.

## 🌟 Key Highlights

- **100% Frontend** - No server, database, or backend needed
- **Privacy-First** - Zero data persistence or tracking
- **Real-Time** - Instant detection as conversation happens
- **Explainable** - Every alert shows exactly what was detected
- **Fast** - <2ms detection time per transcript update
- **Free** - No API costs with Web Speech API

## 🎯 Use Cases

- **Personal Protection**: Detect phone scams during calls
- **Education**: Teach users about vishing tactics
- **Research**: Study scam patterns and language
- **Demo**: Showcase real-time ML/AI capabilities
