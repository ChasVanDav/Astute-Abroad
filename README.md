# Astute Abroad ✈️🌏

**Built by Vanessa Davis**

Astute Abroad is a web app designed to help users practice and improve their spoken Korean with real-time AI feedback.  
**Currently focused on Korean**, but with plans to expand to **more languages** as the platform grows.  
Inspired by Vanessa's experience living overseas in Korea as an expat, Astute Abroad is the first step in helping learners gain the confidence to travel, connect, and speak freely.

![Astute Abroad's Dashbooard](DashboardScreenshot.png)

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Setup (Developer)](#-setup-developer)
- [User Guide](#user-guide)
- [API Documentation](#api-documentation)
- [External API Integrations](#external-api-integration)
- [Testing Instructions](#-running-tests)
- [Reflection](#reflection)

---

## Project Overview

Astute Abroad provides a **safe and interactive environment** for users to practice spoken Korean by:

- Speaking answers to practical, everyday questions
- Receiving immediate AI-powered feedback on pronunciation, content relevance, and fluency
- Tracking practice attempts and viewing personalized progress metrics
- Saving favorite questions for targeted practice sessions

---

## Features

- **Real-time Voice Practice**: Live speech-to-text via WebSocket using Google Cloud Speech-to-Text.
- **AI Evaluation**: ChatGPT-powered feedback on pronunciation, content accuracy, and relevance.
- **User Authentication**: Secure login and registration with Firebase Auth and reCAPTCHA.
- **Dashboard**: Interactive progress bar, question search, and practice tracking.
- **Favorites**: Mark and revisit favorite questions.
- **Responsive UI**: Built with React, Tailwind CSS, and Framer Motion for smooth animations.

---

## Technology Stack

- **Frontend**: React, Vite, Tailwind CSS, React Router, Framer Motion
- **Backend**: Node.js, Express.js, WebSocket (ws)
- **Speech Recognition**: Google Cloud Speech-to-Text API
- **AI Feedback**: OpenAI GPT-3.5 Turbo
- **Authentication**: Firebase Authentication, Google reCAPTCHA v2
- **Database**: PostgreSQL
- **Environment**: dotenv for managing secrets

---

## ⚙️ Setup (Developer)

### 1. Clone and install

```bash
git clone https://github.com/ChasVanDav/Astute-Abroad.git
cd Astute-Abroad
```

### 2. Environment variables

#### `client/.env`

```
VITE_RECAPTCHA_SITE_KEY=your_site_key
```

#### `server/.env`

```
OPENAI_API_KEY=your-openai-key
GOOGLE_STT_API_KEY={JSON_CREDENTIALS}
DATABASE_URL=postgresql://user:pass@localhost:5432/astuteabroad
```

### 3. Run locally

```bash
# Backend
cd server
npm install
node server.js

# Frontend
cd client
npm install
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

---

## 🧪 Running Tests

### Client (React)

```bash
cd client
npm run test        # or
npx vitest run --coverage
```

### Server (Node/Express)

```bash
cd server
npm test            # or
npm run test:coverage
```

---

## User Guide

1. **Register/Login** with email, password, and reCAPTCHA.
2. **Access Dashboard** to view your personalized progress bar and question list on the side.
3. **Practice Flow**:
   - Questions are presented one at a time in the main area.
   - Click the record button when you’re ready to speak.
   - Live transcription appears as you speak.
   - Click the stop button when you are complete and your transcription appears.
   - Upon completion, receive AI feedback (transcript, pronunciation score, content score, and comments).
   - The app will automatically advance to the next question.
4. **Completion**: Practice ends when you've answered all questions in the set. You may view your feedback on all completed questions in the completed questions tab.
5. **Save Favorites**: Mark questions you’d like to revisit and access them via the favorites star button.

---

## API Documentation

- **POST /api/register**: Register new user
- **POST /api/login**: Authenticate user
- **GET /questions**: Retrieve all questions
- **GET /favequestions/:uid**: Get user's favorite questions
- **POST /favequestions/:uid**: Add favorite question
- **DELETE /favequestions/:uid/:qid**: Remove favorite
- **POST /practice_attempts**: Submit spoken response for AI evaluation
- **POST /completedquestions/:uid**:
  Add completed questions from practice attempts completed by user
- **GET /completedquestions/:uid**:
  Fetch completed questioons by user

---

## External API Integrations

Astute Abroad relies on the following third-party APIs to deliver real-time speech processing, AI-powered feedback, and secure user authentication:

### 🔊 Google Cloud Speech-to-Text API

- **Purpose**: Converts user audio into live text for evaluation.
- **How it's used**: Streams audio via WebSocket to Google STT for transcription.
- **Setup**:
  - Requires a JSON credentials object in your server `.env` as:
    ```env
    GOOGLE_STT_API_KEY={ ...your JSON credentials... }
    ```
  - Ensure the service account has permission for the Speech-to-Text API.

### 🧠 OpenAI GPT-3.5 API

- **Purpose**: Analyzes spoken responses and provides personalized feedback.
- **How it's used**: The backend sends transcripts and prompts to the API for evaluation.
- **Setup**:
  - Add your API key in the server `.env`:
    ```env
    OPENAI_API_KEY=your-api-key
    ```

### 🔐 Firebase Authentication

- **Purpose**: Handles user registration, login, and authentication state.
- **How it's used**: Frontend uses Firebase SDK to register and sign in users. The backend maps Firebase UID to internal user records.
- **Setup**:

  - Configure Firebase project in your client-side code using:

    ```js
    import { initializeApp } from "firebase/app";

    const firebaseConfig = {
      apiKey: "your-api-key",
      authDomain: "your-app.firebaseapp.com",
      ...
    };

    initializeApp(firebaseConfig);
    ```

### 🛡️ Google reCAPTCHA v2

- **Purpose**: Protects against bot signups and abuse.
- **How it's used**: Shown on the registration/login forms and verified before backend processing.
- **Setup**:
  - Add keys to your client and server `.env` files:
    ```env
    VITE_RECAPTCHA_SITE_KEY=your_site_key
    VITE_RECAPTCHA_SECRET_KEY=your_secret_key
    ```
  - Frontend uses the `react-google-recaptcha` package for integration.

---

## Reflection

Building Astute Abroad deepened my skills in:

- Real-time audio processing and WebSockets
- Prompt engineering for AI feedback
- Secure authentication flows with Firebase and reCAPTCHA
- Designing responsive, animated UIs with Framer Motion
- Structuring and deploying full-stack applications

Lessons learned:

- The importance of clear API documentation and test coverage
- Balancing user experience with security measures like rate limiting and reCAPTCHA

I truly enjoyed building this app, which felt like a labor of love. Astute Abroad combines my passion for travel, language learning (particularly Korean), and my budding talent in software engineering. Thank you for taking a look into a project I am super proud of.

With Gratitude,
Vanessa

---

