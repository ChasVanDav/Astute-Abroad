# 🌏 Astute Abroad
This project is a **language learning app** that integrates Google speech-to-text, Google translate, real-time AI-powered feedback, and a database of language-learning questions categorized by purpose (e.g., Travel, Business, Casual Conversations). It is built using **React, Node.js, PostgreSQL, and Puppeteer for web scraping**.

<img width="539" alt="Screenshot 2025-04-04 at 2 46 40 PM" src="https://github.com/user-attachments/assets/2a99d537-4aec-4105-9890-6d33aeb42205" />

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

## 🌳 Branching Strategy
- **main**: Stable production-ready branch
- **develop**: Active development branch (merged into `main` upon feature completion)
- **feature/[feature-name]**: Individual feature branches (e.g., `feature/chat-ui`)
- **bugfix/[bug-name]**: Fixes for specific bugs (e.g., `bugfix/api-timeout`)

## 👩🏽‍💻 Workflow
1. Developers create feature branches from `develop`.
2. Once a feature or bugfix is complete, a **pull request (PR)** is made to merge into `develop`.
3. After testing and approval, `develop` is merged into `main`.


