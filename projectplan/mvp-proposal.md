# MVP Proposal and Technical Specification

---

## MVP Proposal

### One-Sentence Pitch
A web application that enables users to practice speaking a foreign language using AI-driven feedback on both content accuracy and pronunciation.

### Problem Statement  
Many language learners struggle to practice speaking skills due to limited opportunities for real-time, personalized feedback—especially regarding pronunciation and content accuracy. Additionally, many learners feel too shy or self-conscious to practice speaking publicly or with native speakers, which significantly hinders their progress and confidence.

### Target Users
- Language learners (from beginners to intermediate users)
- Individuals seeking conversational practice
- Students and professionals preparing for language exams or travel

### Core Features
- **Voice Input Practice:** Users speak responses to language-learning questions.
- **AI Feedback:** Integration with OpenAI to analyze and provide feedback on content and pronunciation.
- **Web Scraping:** Automatic fetching and categorization of language-learning questions.
- **User Dashboard:** Progress tracking with data visualization (charts, stats).
- **Search & Favorites:** Functionality to search questions by category/difficulty and save favorites.
- **Authentication:** User login and registration via Firebase.

### Technical Stack
- **Frontend:** React, with a styling framework (Tailwind CSS)
- **Backend:** Node.js with Express
- **Database:** PostgreSQL hosted on Render
- **APIs:** 
  - OpenAI API for AI feedback
  - Google Speech-to-Text for voice transcription
  - Firebase for authentication
- **Web Scraping:** Puppeteer for extracting language questions

### Preliminary Wireframes or Sketches
- **Landing Page:** Simple introduction with demo video, and login/sign-up options.
- **Practice Page:** Displays a question, audio recording button, and a text area for feedback.
- **Dashboard:** Visual progress charts, practice history, and saved questions.
- **Search Interface:** Search bar with filtering options.
- [Excalidraw Link](https://excalidraw.com/#json=2USlxZb2PUqsiiwcGuAsY,XBxkbA8oNODtfJpEYjBRww)


---

## Technical Specification

### Detailed Feature List with Prioritization
1. **Core Infrastructure**
   - **Database Setup:** (High Priority) Create PostgreSQL instance and define schema.
   - **Backend & API Endpoints:** (High Priority) Set up Node.js server and create RESTful endpoints.
   - **Frontend Bootstrap:** (High Priority) Initial React setup with basic routing and UI components.
2. **Web Scraping**
   - **Scraper Development:** (High Priority) Puppeteer script to fetch questions.
   - **Data Processing & Storage:** (High Priority) Parse and save questions in SQL database.
3. **Voice Input & AI Feedback**
   - **Google Speech-to-Text Integration:** (High Priority) Record and transcribe user audio.
   - **OpenAI Integration:** (High Priority) Analyze transcriptions and generate feedback.
4. **User Authentication and Session Management**
   - **Firebase Integration:** (High Priority) Set up authentication for user management.
5. **User Experience Enhancements**
   - **Search and Favorites:** (Medium Priority) Enable question filtering and saving.
   - **Accessibility & Form Validation:** (Medium Priority) Ensure ARIA labels, keyboard navigation, and client-side validation.
   - **Pagination:** (Medium Priority) Implement for lists of questions and saved items.
6. **Testing and Deployment**
   - **Unit/Integration Testing:** (High Priority) 80% test coverage for core functionalities.
   - **Error Handling & Logging:** (High Priority) Robust error outputs and logging.
   - **Data Visualization:** (Medium Priority) Build dashboard with progress charts.

### User Flows and Wireframes
- **User Sign-Up / Login Flow:** User registers or logs in using Firebase authentication, then is directed to the dashboard.
- **Practice Flow:** User selects a question, records an answer, receives AI feedback, and views their progress.
- **Search Flow:** User searches for questions by category/difficulty, views results, and can save favorite questions.
- [Excalidraw Link](https://excalidraw.com/#json=2USlxZb2PUqsiiwcGuAsY,XBxkbA8oNODtfJpEYjBRww)

### Database Schema
- **Users Table:** Stores user authentication details.
- **Questions Table:** Stores scraped questions along with category, difficulty, and correct answer.
- **Saved Questions Table:** Maps users to their favorited questions.
- **Practice Attempts Table:** Records user attempts, transcriptions, AI feedback, and scores.
- [Database Schema Link](https://dbdiagram.io/d/Language-Practice-App-Database-Schema-67f1be844f7afba1847bd93a)

### API Endpoints and Integration Plans
- **Web Scraping Endpoint:** `POST /api/scrape-questions` to fetch and store questions.
- **Question Retrieval:** `GET /api/questions` with query parameters for category and difficulty.
- **User Authentication:** `POST /api/users/login` to authenticate using Firebase.
- **Saved Questions:** `POST /api/users/save-question` and `GET /api/users/saved-questions`.
- **Practice Attempts:** `POST /api/practice/attempt` to submit voice inputs and receive AI feedback.
- **User Progress:** `GET /api/users/progress` for dashboard metrics.
- Integration plans include setting up middleware for error handling, authentication, and rate limiting.

### Component Breakdown
- **Frontend Components:**
  - **App Shell:** Navigation, routing, and layout.
  - **Practice Component:** Handles voice input, displays questions, and shows AI feedback.
  - **Dashboard Component:** Displays progress charts and practice history.
  - **Search Component:** Provides search and filter functionalities.
  - **Authentication Components:** Login, registration, and session management.
- **Backend Components:**
  - **API Routes:** CRUD operations for questions, users, and practice attempts.
  - **Scraping Module:** Puppeteer scripts with error handling and logging.
  - **Integration Modules:** Modules for OpenAI, Google Speech-to-Text, and Firebase interactions.

### Testing Strategy
- **Unit Tests:** For individual functions (e.g., data parsing, API calls) using Jest.
- **Integration Tests:** For API endpoints and overall user flows (e.g., login, practice session) using Supertest.
- **Coverage Target:** Aim for at least 80% coverage on core functionalities.
- **Manual Testing:** Conduct cross-browser and accessibility testing.

### Deployment Plan
- **Backend Deployment:** Deploy Node.js API and PostgreSQL database on Render.
- **Frontend Deployment:** Deploy React application on Vercel or Netlify.
- **CI/CD:** Utilize GitHub Actions or similar for automated testing and deployment pipelines.
- **Final Deployment Date:** May 2, with a thorough QA cycle before going live.

### Risk Assessment
- **API Rate Limits:** Implement caching and exponential backoff.
- **Web Scraping Blocks:** Use local caching and schedule scraping during off-peak hours.
- **Authentication & Security:** Employ Firebase best practices and secure session management.
- **Performance Bottlenecks:** Optimize database queries and API responses with pagination and indexing.
- **Scope Creep:** Maintain a strict MVP focus and postpone non-critical features.

---
