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
| **Hosting**  | Render (frontend + backend), Firebase |

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
    category VARCHAR(50) NOT NULL CHECK (
        category IN ('Travel', 'Business', 'Casual', 'Academic', 'Technical', 'Other')
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

### **Chats Table** (stores user chat history)
```sql
CREATE TABLE chats (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_user BOOLEAN NOT NULL, -- TRUE for user messages, FALSE for AI responses
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 📡 API Endpoints

### **Web Scraping Endpoint (Fetch & Store Questions)**
```http
POST /api/scrape-questions
```

### **Fetch Questions by Category**
```http
GET /api/questions?category=Travel
```
**Response:**
```json
[
  { "id": 1, "question_text": "Where is the bathroom?", "category": "Travel" },
  { "id": 2, "question_text": "How much is this?", "category": "Travel" }
]
```

### **User Authentication & Saving Questions**
```http
POST /api/users/login
POST /api/users/save-question
GET /api/users/saved-questions
```

### **Chat Storage and Retrieval**
```http
POST /api/chats/send-message
GET /api/chats/0402205
```

---

<img src="https://github.com/user-attachments/assets/3cc52ef8-e239-4c5b-b6a8-61c59c058892" width="150" height="250" alt="Young woman on top of the world">

## 📅 Week-by-Week Plan

### **Week 1: Core Setup, Chat Interface, and Web Scraping**
- ✅ Set up **React frontend + Node.js backend** 
- ✅ Set up **PostgreSQL on Render** for storing questions
- ✅ Build **chat UI**
- ✅ **Connect OpenAI API**
- ✅ **Web Scraping (Puppeteer)**: Fetch language-learning questions
- ✅ Store **questions in PostgreSQL**, categorized by **purpose**
- ✅ Build an API endpoint to **fetch questions by category**
- ✅ Add **error handling & logging for web scraping**

---

### **Week 2: Speech Recognition & Question Search System**
- ✅ Implement **Google Speech-to-Text API** for voice input
- ✅ AI provides **pronunciation feedback**
- ✅ Add **login authentication (Firebase)**
- ✅ Implement **search functionality** (find stored questions by category)
- ✅ AI **suggests questions** based on user conversation

---

### **Week 3: Pagination, Web Accessibility, and Enhancements**
- ✅ Add **pagination for chat history & questions**
- ✅ Implement **rate limiting to prevent API abuse**
- ✅ Improve **web accessibility (ARIA labels, keyboard navigation, color contrast fixes)**
- ✅ Add **client-side form validation**
- ✅ Allow **users to favorite & save questions** for later

---

### **Week 4: Testing, Data Visualization & Final Deployment**
- ✅ Write **unit & integration tests (80% coverage)**
- ✅ Add **progress chart**
- ✅ Improve **error handling (better user-facing error messages)**
- ✅ Final **testing & deployment on Render**

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

| **Risk** | **Likelihood** | **Impact** | **Mitigation Strategy** |  
|----------|--------------|----------|--------------------|  
| **API Rate Limits** (OpenAI, Google Speech-to-Text) | Medium | High | Implement caching & exponential backoff for API calls. Use alternative APIs if necessary. |  
| **Web Scraping Blocks** | Medium | High | Store scraped data locally to reduce frequent requests. |  
| **Authentication Issues** | Low | High | Use Firebase authentication with proper session management and token expiration handling. |   
| **Performance Bottlenecks** (Large chat histories, API calls) | Medium | Medium | Implement pagination & optimize queries for fetching chat history. Use indexed DB fields for faster lookups. |
| **Project Scope Creep** | Medium | Medium | Stick to MVP features, prioritize critical features, and defer enhancements to a later phase. |  


