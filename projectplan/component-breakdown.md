 # Component Breakdown

 [Video-Walkthrough-Explanation](https://drive.google.com/file/d/1DS6fqgdcaxjbVDz2PCsXCuCfcCIGeosZ/view?usp=sharing)

## **Frontend Components**

### **App Shell: Navigation, Routing, and Layout**
- **What It Does**: The App Shell controls the layout of the app and handles navigation between different pages (like login, practice, and the dashboard).
- **Props/Data**: No specific props.
- **Function**: Uses `react-router-dom` to handle navigation and display the right page when the user clicks on something.

### **Practice Component: Handles Voice Input and Shows AI Feedback**
- **What It Does**: This component displays a practice question, allows the user to record their answer, and shows AI-generated feedback based on their response. It also manages sequential question progression.
- **Props/Data**:
  - `audioUrl`: The recorded audio of the user’s response.
  - `feedback`: The AI feedback on the content and pronunciation.
  - `question`: The practice question being answered by the user.
- **Functions**:
    - **handleAudioRecord**: Starts recording the user's voice when they speak their answer.
    - **handleSubmit**: Sends the recorded audio to the backend for transcription and AI feedback.
    - **receiveFeedback**: Displays feedback from AI after submission, such as corrections on pronunciation or content.
  - **Displaying the Question**:
    - The question is chosen **sequentially** based on its **ID** and **category**. This way, the difficulty of questions increases as the user progresses.
    - The **Practice Component** first checks the user's **current progress** (the last question answered) from the backend (via `GET /api/users/progress`).
    - Based on that progress, it sends a request to fetch the **next question** in sequence. The request might look like `GET /api/questions/{nextQuestionId}`, where the `nextQuestionId` is determined by the category and the user's current progress.

### **Dashboard Component: Shows User Progress and History**
- **What It Does**: This component shows the user how they’re doing, like a progress tracker with charts and a history of their practice sessions.
- **Props/Data**:
  - `userProgress`: Shows the user’s progress (e.g., how accurate they are, time spent practicing).
  - `practiceHistory`: A list of past practice sessions.
- **Functions**:
    - **fetchUserProgress**: Pulls the user’s progress data from the backend.
    - **renderProgressChart**: Displays the user’s progress in a chart form.
    - **showPracticeHistory**: Displays a history of the user’s past practice attempts.

### **Search Component: Search and Filter Questions**
- **What It Does**: Lets users search for questions by category, difficulty, or keywords. They can also pick which question they want to practice next.
- **Props/Data**:
  - `searchQuery`: What the user types in to search for questions.
  - `filteredQuestions`: The list of questions that match the search/filter criteria.
  - `selectedQuestion`: The question the user selects to practice.
- **Functions**:
    - **handleSearch**: Sends the search query to the backend to find matching questions.
    - **filterQuestions**: Filters questions based on things like category or difficulty.
    - **saveFavorite**: Lets the user save questions they like or want to come back to later.
    - **startPractice**: Starts a practice session with a random or selected question.

### **Authentication Components: Login, Registration, and Session Management**
- **What It Does**: Handles logging users in and registering them for an account, keeping them logged in, and managing sessions.
- **Props/Data**:
  - `user`: Stores the authenticated user’s info, like their email or user ID.
  - `authError`: Stores any error messages if login or registration fails.
- **Functions**:
    - **handleLogin**: Logs the user in using Firebase authentication.
    - **handleRegistration**: Registers a new user account.
    - **manageSession**: Keeps track of whether the user is logged in and manages tokens.

---

## **Backend Components**

### **API Routes: Handle CRUD Operations for Questions, Users, and Practice Attempts**
- **What It Does**: These routes handle all the important data, like fetching, adding, and saving questions, as well as tracking practice attempts and user progress.
- **Props/Data**:
  - **Question Data**: Information about the questions, like the text, category, and difficulty.
  - **User Data**: Authentication details like user ID and tokens.
  - **Practice Attempt Data**: The user’s audio, transcription, and AI feedback.
- **Functions**:
    - **POST /api/questions**: Adds new questions to the database.
    - **GET /api/questions**: Fetches questions based on search or filter criteria.
    - **POST /api/users/login**: Logs the user in and returns a token.
    - **POST /api/practice/attempt**: Sends user audio to the backend for transcription and feedback.
    - **GET /api/users/progress**: Retrieves data about how the user is progressing.

### **Scraping Module: Fetch Questions from External Sources**
- **What It Does**: Scrapes questions from websites and adds them to the database.
- **Props/Data**:
  - **Scraped Question Data**: Includes the text of the questions, categories, and difficulty levels.
- **Functions**:
    - **scrapeQuestions**: Uses Puppeteer to scrape questions from external sources.
    - **errorHandling**: Handles any issues that come up while scraping, like network problems.

### **Integration Modules: Google STT, OpenAI, Firebase**
- **What It Does**: Connects with external services Google for speech-to-text (STT), OpenAI for feedback, and Firebase for user authentication.
- **Props/Data**:
  - **Audio Data**: The user’s recorded answer.
  - **Transcribed Text**: The transcription of the audio using Google STT.
  - **AI Feedback**: Feedback from OpenAI based on the transcribed text.
- **Functions**:
    - **Google STT Integration**: Turns audio into text using Google’s speech-to-text API.
    - **OpenAI Integration**: Sends the transcribed text to OpenAI for feedback on pronunciation and content.
    - **Firebase Authentication**: Handles logging in, registering users, and maintaining their sessions.
