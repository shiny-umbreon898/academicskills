# Academic Skills - Interactive Learning Dashboard

This README explains the Academic Skills app: what it does, how it is organised, and how to extend the quiz content so non-developers can update questions and answers.

## Table of contents

- [Introduction](#introduction)
- [Installation and Quickstart](#installation-and-quickstart)
- [Issues](#issues)
- [Further Development](#further-development)
- [Contact and License](#contact-and-license)

## Introduction

See [`GETTING_STARTED.md`](#./docs/GETTING_STARTED.md) for a quick start guide by role (developer, content creator, etc.))

See [`FEATURES.md`](#./docs/Features.md) for a detailed list of features and design decisions

See [`INDEX.md`](#./docs/INDEX.md) for a full index of documentation)

See [`PROJECT_SUMMARY.md`](#./docs/PROJECT_SUMMARY.md) for a final summary of the project and next steps)]

Presents a simple, engaging way for students to learn and track their progress in academic skills topics
The modular design allows for easy addition of new content and question types
Each page is designed as a reusable template for different topics, with the quiz content defined in a simple data structure that can be updated by non-developers
Allows user to complete modules learning modules at their own pace, with progress saved locally and no sign-in required 
The Dashboard provides a visual overview of achievements and encourages continued learning through gamification elements like XP and badges.

### How the App Works

1. On first use the app generates a lightweight user id and stores it in a cookie.
2. The Dashboard reads progress and achievements from cookies and renders the current state.
3. On Page 2 the HTML5 video plays. When playback reaches a question timestamp the app pauses the video and shows a modal quiz overlay.
4. When the user selects an answer the app saves that answer immediately, updates the score, and shows feedback.
5. When all questions for a module are answered the module is marked complete, XP is awarded, and the Dashboard updates.

### Structure of the Interactive Quiz

- The quiz questions live in src/pages/Page2.js in a GRAMMAR_TIPS array. Each entry contains id, title, time (seconds), a quiz object (question, options array, correct answer index) and optional feedback text.
- Page2 listens to the video timeupdate event and shows a question overlay when the currentTime is close to a tip's time.
- Answers are saved to the progress cookie and persisted immediately so the last question is not lost.

### Client-side storage

This project is designed to be easy to run locally: no backend, no sign in. If you need multi-user persistence, move progress saving into a backend API and database.

## Installation and Quickstart

1. Install Node.js (v14 or later) and npm.
2. Open a terminal and move into the frontend folder.

   ```cd frontend```

3. Install dependencies:

   ```npm install```

4. Start the development server:

   ```npm start```

   The app will be available at http://localhost:3000

5. Create a production build:

   ```npm run build```

## Issues

- Mobile UI: Dashboard progress cards do not stack to single column on small screens; needs responsive redesign.
- H5P content served from other origins may require CORS or a proxy.
- Captions (VTT) are available in resources but must be manually attached to the video element via track tags if needed.
- Progress is stored in the browser; clearing cookies/localStorage will remove saved progress.

## Further development

Priority fixes and improvements:

- Responsive mobile design for Dashboard (single column layout on small screens).
- Externalize quiz content to JSON/CSV for easier content updates.
- Refactor Page.js to serve as a true base template for reusable quiz modules.
- Make scoring, progression, and interactive questions modular across pages.
- Support different question types (multiple choice, true/false, short answer).
- Add H5P standalone integration with xAPI event tracking for scoring as alternate architecture
- Add icons and unique visual badges for each topic.
- Add search and filtering for content.
- Add more accessibility options (WCAG compliance).
- Add background images and improve overall visual design (e.g. napier logo img in files to go in header)
- Add more learning modules and content.
- Add js animations.

## Contact and License

If you need clarification or a backup of the repo, contact previous owner @shiny-umbreon898 on github or email aaronghafoor5@gmail.com 
The code in this repository is licensed under the GNU General Public License v3.

Last updated: April 2026
Version: 1.3.0







