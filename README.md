# 🌏 Astute Abroad
## 📌 Project Plan Overview
This project is a **language learning app** that integrates Google speech-to-text, Google translate, real-time AI-powered feedback, and a database of language-learning questions categorized by purpose (e.g., Travel, Business, Casual Conversations). It is built using **React, Node.js, PostgreSQL, and Puppeteer for web scraping**.

<img width="539" alt="Screenshot 2025-04-04 at 2 46 40 PM" src="https://github.com/user-attachments/assets/2a99d537-4aec-4105-9890-6d33aeb42205" />

### Wireframes & User Flow: [Excalidraw Link](https://excalidraw.com/#json=2USlxZb2PUqsiiwcGuAsY,XBxkbA8oNODtfJpEYjBRww)

---


## 🖥️ Tech Stack

| **Category**  | **Tech**  |
|--------------|----------|
| **Frontend**  | React (Vite) |
| **Backend**  | Node.js (Express) |
| **Database**  | PostgreSQL (Render) |
| **Auth**  | Firebase |
| **AI APIs**  | OpenAI (analysis & feedback), Google Speech API |
| **Web Scraping**  | Puppeteer (Node.js) |
| **Hosting**  | Vercel (frontend), Render (backend), Firebase |

---

## 📂 Database Schema

### **Users Table** (for authentication & saved questions)
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    firebase_uid TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```
### **Questions Table** (stores scraped questions categorized by purpose)
```sql
CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    question_text TEXT NOT NULL,
    answer_text TEXT NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (
        category IN ('Travel', 'Business', 'Casual', 'Academic', 'Technical', 'Other')
    ),
    difficulty VARCHAR(20) DEFAULT 'Intermediate' CHECK (
        difficulty IN ('Beginner', 'Intermediate', 'Advanced')
    ),
    source_url TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### **Saved Questions Table** (users can save favorite questions)
```sql
CREATE TABLE saved_questions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
    saved_at TIMESTAMP DEFAULT NOW()
);
```

### ***Practice Attempts Table** (Records each time a user practices a question)
```sql
CREATE TABLE practice_attempts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
    spoken_text TEXT NOT NULL,
    transcription_confidence NUMERIC(4,3), -- e.g., 0.923
    ai_feedback TEXT, -- summary of what was correct/incorrect
    content_score INTEGER CHECK (content_score BETWEEN 0 AND 100),
    pronunciation_score INTEGER CHECK (pronunciation_score BETWEEN 0 AND 100),
    attempted_at TIMESTAMP DEFAULT NOW()
);
```
---

# 📡 API Endpoints

---

### 🔍 Web Scraping Endpoint (Fetch & Store Questions)
```http
POST /api/scrape-questions
```
**Description:** Scrapes language-learning questions, categorizes them, and stores them in the database.  
**Request Body (optional):**
```json
{
  "url": "https://example.com/source"
}
```

---

### 📥 Fetch Questions by Category / Difficulty
```http
GET /api/questions?category=Travel&difficulty=Beginner
```
**Description:** Returns questions filtered by category and/or difficulty.  
**Response:**
```json
[
  {
    "id": 1,
    "question_text": "Where is the bathroom?",
    "answer_text": "Where is the bathroom?",
    "category": "Travel",
    "difficulty": "Beginner"
  }
]
```

---

### 🔐 User Authentication (Firebase Auth)
```http
POST /api/users/login
```
**Description:** Accepts Firebase token, verifies, and creates user in DB if new.  
**Request Body:**
```json
{
  "firebase_uid": "abc123",
  "email": "user@example.com"
}
```

---

### ⭐ Save a Question to Favorites
```http
POST /api/users/save-question
```
**Request Body:**
```json
{
  "question_id": 1
}
```

---

### 📚 Get User's Saved Questions
```http
GET /api/users/saved-questions
```
**Response:**
```json
[
  {
    "id": 1,
    "question_text": "Where is the bathroom?",
    "category": "Travel",
    "difficulty": "Beginner"
  }
]
```

---

### 🎙️ Submit a Practice Attempt (Audio Transcription & AI Feedback)
```http
POST /api/practice/attempt
```
**Request Body:**
```json
{
  "question_id": 1,
  "spoken_text": "Where's the restroom?",
  "transcription_confidence": 0.926,
  "content_score": 88,
  "pronunciation_score": 75,
  "ai_feedback": "Good job! Slight variation in phrasing but meaning was correct."
}
```

---

### 📈 Get User Progress Data (for dashboard)
```http
GET /api/users/progress
```
**Response:**
```json
{
  "total_attempts": 42,
  "average_content_score": 82,
  "average_pronunciation_score": 78,
  "attempts_by_category": {
    "Travel": 18,
    "Business": 9
  },
  "score_over_time": [
    { "date": "2025-04-01", "content_score": 85, "pronunciation_score": 80 },
    { "date": "2025-04-02", "content_score": 90, "pronunciation_score": 75 }
  ]
}
```

---

<img src="https://github.com/user-attachments/assets/3cc52ef8-e239-4c5b-b6a8-61c59c058892" width="150" height="250" alt="Young woman on top of the world">

## 📅 Week-by-Week Plan

### Week 1: Core Setup, Web Scraping, and Data Pipeline
- Set up React frontend and Node.js backend.
- Configure PostgreSQL on Render and define the database schema (users, questions, saved_questions, practice_attempts).
- Connect the OpenAI API.
- Develop a Puppeteer-based web scraper to fetch language-learning questions.
- Process and store scraped questions in PostgreSQL, categorized by purpose and difficulty.
- Build an API endpoint to fetch questions by category.
- Add error handling and logging for the scraping process.

---

### Week 2: Voice Input, AI Feedback, and Core App Features
- Implement the Google Speech-to-Text API for capturing user voice input.
- Build the practice session UI to display questions and capture audio responses.
- Integrate OpenAI API to compare transcribed input with expected answers, providing text-based content accuracy feedback.
- Develop AI-driven pronunciation feedback using STT confidence scores.
- Set up Firebase authentication for login/signup.
- Create a search functionality to filter stored questions by category and difficulty.
- Integrate basic AI-based question suggestions based on user conversation history.

---

### Week 3: UX Enhancements, Dashboard, and Final Deployment
- Implement functionality for users to favorite and save questions.
- Add pagination support for both the questions list and saved questions.
- Build a user dashboard displaying progress metrics and charts.
- Enhance web accessibility by adding ARIA labels, keyboard navigation, and fixing color contrast issues.
- Implement client-side form validation across the app.
- Write unit and integration tests covering core features.
- Improve error handling to provide clear user-facing messages.
- Conduct final testing and deploy the application on Render.

---


## 🌳 Branching Strategy
- **main**: Stable production-ready branch
- **develop**: Active development branch (merged into `main` upon feature completion)
- **feature/[feature-name]**: Individual feature branches (e.g., `feature/chat-ui`)
- **bugfix/[bug-name]**: Fixes for specific bugs (e.g., `bugfix/api-timeout`)

## 👩🏽‍💻 Workflow
1. Developers create feature branches from `develop`.
2. Once a feature or bugfix is complete, a **pull request (PR)** is made to merge into `develop`.
3. After testing and approval, `develop` is merged into `main`.

---

## ⚠️ Risk Assessment

| **Risk**                                    | **Likelihood** | **Impact** | **Mitigation Strategy**                                                                                                                                  |
|---------------------------------------------|----------------|------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| API Rate Limits (OpenAI, Google Speech-to-Text) | Medium         | High       | Implement caching, exponential backoff, and fallback mechanisms. Monitor API usage and consider alternative providers if needed.                         |
| Web Scraping Blocks                         | Medium         | High       | Maintain a local cache of scraped data; schedule scraping during off-peak times; use proxies if necessary.                                                |
| Inaccurate AI Feedback                      | Medium         | High       | Regularly validate AI output with human review; adjust prompt engineering; implement user feedback loops.                                              |
| Authentication & Security Issues            | Low            | High       | Use Firebase authentication with secure session management; enforce token expiration; apply best practices for API security.                             |
| Performance Bottlenecks (API calls, Database queries) | Medium         | Medium     | Optimize queries, implement pagination, use indexing on critical fields, and consider load balancing as user base grows.                                |
| Data Privacy and Compliance                 | Low            | High       | Ensure compliance with relevant data protection laws; use encryption for sensitive data; maintain clear privacy policies.                                |
| Project Scope Creep                         | Medium         | Medium     | Clearly define MVP features; maintain a prioritized backlog; postpone non-critical features to future phases.                                           |



