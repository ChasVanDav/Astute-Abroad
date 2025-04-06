# Requirements Implementation Mapping

## Local database with at least 2 tables

- **April 7 (Day 1)**: Set up the local PostgreSQL database and confirm it connects properly with the backend.
- **April 9 (Day 3)**: Design and implement the schema with at least four related tables: `users`, `questions`, `saved_questions`, and `practice_attempts`. Include necessary relationships (e.g., foreign keys between users and their saved questions).
- Add seed data to test table relationships and run simple queries to verify everything works as expected.

## Connection to at least 1 external API with 3+ calls

- **April 7 (Day 1)**: Connect to the OpenAI API. Test three different types of prompt calls (e.g., generating a new question, providing feedback on an answer, generating follow-up content).
- **April 15 (Day 6)**: Integrate Google Speech-to-Text. Record audio, send it to the API, and return a transcript. Test edge cases like silence or background noise.
- **April 21 (Day 9)**: Use Firebase Authentication as an external service to manage login and user sessions.

## At least 1 test per component

- **April 30 (Day 15)**: Write unit tests for reusable functions and components (e.g., text analysis, speech handling).
- **May 1 (Day 16)**: Add integration tests for larger features like the practice flow, form validation, and saving data.
- Focus on testing core user interactions, API calls, and handling unexpected input or failures.

## Well-documented README

- Update the README continuously to reflect changes in the setup, tech stack, and app structure.
- **May 2 (Day 17)**: Final pass to include instructions for cloning the repo, setting up the environment, running the app, and testing it. Mention any known bugs or areas for future improvement.

## 50+ commits & 3+ branches weekly

- Start new branches for individual features, bug fixes, or testing.
- Merge branches with clear, descriptive commit messages.
- Aim for small commits tied to single tasks (e.g., “Add speech-to-text handler” or “Fix date formatting bug”).

## Implementation of RegEx, datetime handling, objects, arrays, functions, conditionals, and iteration

- **April 9–10 (Days 3–4)**: Use RegEx and iteration while processing scraped data (e.g., cleaning up and filtering content).
- **April 14 (Day 5)**: Handle session durations using datetime logic (e.g., to show how long a user practiced). Use functions to modularize repeated tasks and conditional logic to guide app flow.

## Data fetch calls with error handling

- **April 14 (Day 5)**: Set up API calls to the backend and external APIs. Include try/catch blocks to display helpful error messages and retry failed calls where possible.
- **May 1 (Day 16)**: Review and standardize error handling across the codebase.

## All CRUD operations

- **April 14 (Day 5)**: Create routes for submitting new practice attempts and retrieving question data.
- **April 21 (Day 9)**: Extend CRUD to cover user-saved questions and allow users to update or delete them from their saved list.

## Search feature(s) functionality

- **April 22 (Day 10)**: Add a search bar that lets users filter questions based on keywords or categories. Connect this to a backend search route that returns results from the database.

## Web accessibility considerations

- **April 29 (Day 14)**: Make sure interactive elements are reachable with keyboard navigation. Add ARIA roles, labels for screen readers, and ensure color contrast meets accessibility standards.

## Two AI features

- **April 16 (Day 7)**: Use AI to provide content-related feedback—e.g., compare the user’s answer to a model answer and return a summary of similarities/differences.
- **April 17 (Day 8)**: Implement AI-powered pronunciation support by analyzing Google Speech-to-Text results and identifying pronunciation gaps.

## Web scraping and local storage in a SQL-related database

- **April 9–10 (Days 3–4)**: Use Puppeteer to scrape questions from language learning sources. Store relevant information in the PostgreSQL database for search and practice sessions.

## Login authentication

- **April 21 (Day 9)**: Enable login/logout functionality using Firebase Authentication. Ensure each user session is tracked and secure. Test invalid logins and auto-timeouts.

## Handle rate limiting and anti-bot measures

- **May 1 (Day 16)**: Add delay logic and retry limits to external API calls and scraping scripts. Track failed or blocked requests and ensure the app does not overload any services.

## Implement client-side form validation

- **April 29 (Day 14)**: Add validation to all input forms—check for required fields, limit character length, and validate input formats. Show inline error messages to users for clarity.

## Create forms for user input (search queries or data selection)

- **April 15–16 (Days 6–7)**: Build forms for users to start a new practice session, choose categories, and submit spoken responses.
- **April 22 (Day 10)**: Add a separate search form to allow filtering and browsing question prompts.

## Write 80% test coverage (unit and integration tests for core functions)

- **April 30 (Day 15)**: Run a code coverage report after writing unit tests.
- **May 1 (Day 16)**: Fill in gaps in test coverage, especially for important features like API responses, form handling, and user feedback components.

## Implement proper error handling and logging

- **April 10 (Day 4)**: Add logging for the web scraping process—track scraped URLs, timestamps, and errors.
- **April 14 (Day 5)**: Add backend logging for failed API calls and user actions that result in errors (e.g., failed login attempts).
- **May 1 (Day 16)**: Review logs for consistency and check that all critical paths are covered.

## Create comprehensive error outputs for user-facing errors

- **May 1 (Day 16)**: Write clear, understandable messages for common issues—e.g., “Speech not recognized,” “Please try again,” or “Login session expired.” Avoid technical jargon.

## Implement pagination for separating small-large chunks of data

- **April 24 (Day 12)**: Break up long question lists and saved history using pagination. Load only a limited number of items at a time and allow users to navigate between pages.

## Display a simple data visualization

- **April 28 (Day 13)**: Create a dashboard feature showing practice activity over time using a chart. Pull data from completed sessions and display trends.

