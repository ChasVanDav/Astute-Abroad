# Astute Abroad ✈️🌏

**Built by Vanessa Davis**

Astute Abroad is a web app designed to help users practice and improve their spoken Korean with real-time AI feedback.  
**Currently focused on Korean**, but with plans to expand to **more languages** as the platform grows.  
Inspired by Vanessa\'s experience living overseas in Korea as an expat, Astute Abroad is the first step in helping learners gain the confidence to travel, connect, and speak freely.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Developer Guide](#developer-guide)
- [User Guide](#user-guide)
- [API Documentation](#api-documentation)
- [Component Breakdown](#component-breakdown)
- [Reflection](#reflection)
- [Future Roadmap](#future-roadmap)
- [Screenshots](#screenshots)

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
- **Database**: PostgreSQL (Dockerized)
- **Containerization**: Docker & Docker Compose
- **Environment**: dotenv for managing secrets

---

## Project Structure

```
/AstuteAbroad
├── client         # React frontend
│   ├── src
│   │   ├── pages
│   │   │   ├── Dashboard.jsx
│   │   │   ├── QuestionDetail.jsx
│   │   │   ├── QuestionList.jsx
│   │   │   └── ...
│   │   └── components
│   └── vite.config.js
├── server         # Express backend
│   ├── routes
│   ├── db.js
│   ├── server.js
│   └── ...
├── docker-compose.yaml
└── .env
```

---

## Setup Instructions

1. **Clone Repo**:
   ```bash
   git clone https://github.com/ChasVanDav/AstuteAbroad.git
   cd AstuteAbroad
   ```
2. **Environment Variables**:
   - Client `.env`:
     ```env
     VITE_RECAPTCHA_SITE_KEY=your_site_key
     VITE_RECAPTCHA_SECRET_KEY=your_secret_key
     ```
   - Server `.env`:
     ```env
     OPENAI_API_KEY=your-openai-key
     GOOGLE_STT_API_KEY={JSON_CREDENTIALS}
     DATABASE_URL=postgresql://user:pass@db:5432/astuteabroad
     ```
3. **Docker Compose**:

   ```bash
   docker-compose up --build
   ```

   Visit http://localhost:5173 (frontend) and http://localhost:5000 (API).

4. **Local Dev without Docker**:
   - Backend: `cd server && npm install && npm run dev`
   - Frontend: `cd client && npm install && npm run dev`

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
4. **Completion**: Practice ends when you've answered all questions in the set.
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

---

## Component Breakdown

- **Dashboard.jsx**: Manages user state, fetches question data, tracks progress, and renders `QuestionList` and `QuestionDetail`.
- **QuestionList.jsx**: Displays searchable, paginated list of questions with favorite star indicators.
- **QuestionDetail.jsx**: Handles question expansion, audio recording with `LiveTranscription`, AI feedback submission, and displays scores and comments.
- **LiveTranscription.jsx**: Streams audio via WebSocket to backend, receives interim and final transcriptions, and passes data back.

---

## Reflection

Building Astute Abroad deepened my skills in:

- Real-time audio processing and WebSockets
- Prompt engineering for AI feedback
- Secure authentication flows with Firebase and reCAPTCHA
- Designing responsive, animated UIs with Framer Motion
- Dockerization of full-stack apps

---

## Future Roadmap

- **Multi-language support** (Spanish, Japanese, French)
- **Gamification**: leaderboards, badges
- **Mobile app** using React Native
- **CI/CD pipelines** with GitHub Actions
- **Production deployment** on AWS EKS/ECS

---

## Screenshots

- Dashboard View
- Live Practice Session
- AI Feedback Display

---

_Thank you for exploring Astute Abroad!_
