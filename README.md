# Academic Skills - Interactive Learning Dashboard

This README explains the Academic Skills app: what it does, how it is organised, and how to extend the quiz content so non-developers can update questions and answers.

## Table of contents

- What this app does
- Features
- Codebase overview
- How it works
- Installation and quickstart
- Structure of the interactive quiz (Page 2)
- Letting non-coders update questions (JSON and CSV options)
- Known bugs and limitations
- Further development
- Contact and license


## What this app does

- Presents short learning modules accessible from a Dashboard.
- Page 2 is an interactive video lesson with six grammar questions that appear as overlays at specific timestamps.
- Answers and progress are saved to browser cookies and localStorage so users can resume later without signing in.
- Users earn points (XP) and badges. The Dashboard displays progress, badges, and level information.
- Includes celebratory confetti animations on key events (implemented but bugged)


## Features

### Interactive Video with Embedded Quizzes

- Six grammar questions trigger at specific video timestamps (3:27, 4:42, 6:22, 8:03, 9:02, 11:18).
- Video automatically pauses when a question appears, showing a centered overlay modal.
- Custom timeline progress bar with visual markers showing question locations.
- Timeline markers change color (white to green) when questions are answered.
- Click timeline to seek to any position in the video.
- Continue button resumes video after answering.

### Quiz and Scoring

- Multiple-choice questions with four options each.
- Immediate feedback and detailed explanations for each question.
- Score displays as number of correct answers (e.g., 4/6).
- Final score is marked as "complete" when all questions are answered.
- Progress is saved after every answer (prevents data loss on last question).

### Progress Tracking and Persistence

- Unique user ID auto-generated on first visit (no login required).
- All progress stored in browser cookies and localStorage.
- Cross-tab synchronization: progress updates visible in all open tabs.
- Users can resume lessons exactly where they left off.

### Gamification and Rewards

- XP (experience points) awarded for completing modules.
- Level system with progress bar showing advancement to next level.
- Achievement badges for each completed module (1/3, 2/3, 3/3).
- Confetti animations trigger on:
  - Selecting a correct answer during quiz.
  - Completing a video module with full score.
  - Clicking a completed badge on Dashboard.

### Dashboard Analytics

- Level display with current level and XP bar.
- Circular progress indicator showing overall completion (0-100%).
- Individual module cards showing:
  - Thumbnail image placeholder.
  - Current status (Not Started, In Progress, Completed).
  - Linear progress bar.
  - Current score and percentage.
  - Start / Continue / Completed button.
- Badge collection display (visual badges for each module).
- Per-module progress breakdown.

### Dark Mode Support

- Toggle dark mode from navigation bar.
- Preference persists across sessions using localStorage.
- CSS class-based styling (dark-mode) applied to document root.



## Codebase overview

Key files and purpose:

- src/App.js - App shell and simple navigation.
- src/pages/Dashboard.js - Dashboard: page cards, badges, overall progress, level display.
- src/pages/Page2.js - Interactive video lesson and overlay quizzes (timestamps, timeline markers, progress saving).
- src/pages/Page.js - Generic page template that supports H5P when configured.
- src/components/Confetti.js - Canvas-based confetti animation that listens for a fireConfetti event.
- src/components/ScoreControls.js - Save, mark-complete and reset controls.
- src/utils/cookies.js - Small helper functions for reading and writing cookies.
- public/resources/ - Static assets such as captions and optional question files.
- src/resources/ - Backups for easier editing during development.

## How it works - short flow

1. On first use the app generates a lightweight user id and stores it in a cookie.
2. The Dashboard reads progress and achievements from cookies and renders the current state.
3. On Page 2 the HTML5 video plays. When playback reaches a question timestamp the app pauses the video and shows a modal quiz overlay.
4. When the user selects an answer the app saves that answer immediately, updates the score, and shows feedback.
5. When all questions for a module are answered the module is marked complete, XP is awarded, and the Dashboard updates.

### Client-side storage

This project is designed to be easy to run locally: no backend, no sign in. If you need multi-user persistence, move progress saving into a backend API and database.

## Installation and quickstart

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

## Structure of the interactive quiz (Page 2)

- The quiz questions live in src/pages/Page2.js in a GRAMMAR_TIPS array. Each entry contains id, title, time (seconds), a quiz object (question, options array, correct answer index) and optional feedback text.
- Page2 listens to the video timeupdate event and shows a question overlay when the currentTime is close to a tip's time.
- Answers are saved to the progress cookie and persisted immediately so the last question is not lost.

## Allowing non-devs to update questions and answers

Next steps for adding content is to refactor code to keep content separate from logic and allow loading questions from an external file. 
This way, editors who are not developers can update quiz content without editing JavaScript by providing the questions in a simple JSON or CSV file placed in the public/resources folder. 
Both approaches could be supported; JSON is recommended for minimal code changes but option B will be more user friendly for editors.

### Option A - JSON (recommended for devs)

1. Create a file public/resources/questions_page2.json with this structure:

```
{
  "tips": [
    {
      "id": "tip1",
      "title": "Long Sentences",
      "time": 207,
      "question": "Why should very long sentences be avoided in academic writing?",
      "options": [
        "They always use the wrong tense",
        "They can make the meaning hard to follow",
        "They contain too many verbs",
        "They are too formal"
      ],
      "correctIndex": 1,
      "feedback": "Long sentences can be difficult for readers to follow."
    }
  ]
}
```

2. Modify src/pages/Page2.js to fetch that file at runtime and map it to the GRAMMAR_TIPS structure the component uses. The public folder is served statically, so the file will be available at /resources/questions_page2.json.
3. Editors can update the JSON with a plain text editor or a JSON editor and then deploy the updated file to the public/resources path.

### Option B - CSV (spreadsheet friendly)

1. Create a CSV file public/resources/questions_page2.csv with columns:
   id,title,time,question,option1,option2,option3,option4,correctIndex,feedback
2. Add a simple CSV loader in Page2.js (either a tiny parser or a small library) that converts each row to an object like the JSON example.
3. Editors can use Excel or Google Sheets and export to CSV. Deploy the CSV to public/resources.

##Validation and safety checks

When loading external data, add simple validation:

- Ensure time is numeric and within the video duration (skip or flag otherwise).
- Ensure correctIndex is an integer and within the options array bounds.
- If rows or objects are malformed, ignore them and log a warning instead of crashing the page.

Operational options if editors cannot edit public/ directly

- Add a small admin UI to the app that lets an editor edit the JSON and saves to localStorage. This is a lightweight option that does not require a backend.
- Host the JSON on a simple storage service or CMS and fetch from that URL. If hosted on another origin add CORS headers.

## Known bugs and limitations

### Bugs (from earlier versions)

- Last question answer not saving: Modified saveProgress() to accept answers parameter.
- Page 2 score showing 5 instead of 6: Updated MAX_SCORES and auto-complete logic.
- Dashboard badge confetti not displaying: Wrapped confetti dispatch in setTimeout.

### Other Issues

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

## Contact and license

If you need help or clarification, contact previous repo owner @shiny-umbreon898 on github or email aaronghafoor@gmail.com 
The code in this repository is licensed under the GNU General Public License v3.

Last updated: April 2026
Version: 0.3.0





## Notes for updating README:

Identify bugs
How code can be refactored to allow external question files (JSON or CSV) 
Refactor to have all code logic for pages in base page.js
Keep scoring, progression, interactive questions modular and reusable across pages
before adding external question loading, code can be refactored to allow different types of questions
Or can add in H5P standalone content for built in options (H5P is heavy, will require conversion using xAPI events to integrate with scoring and progression)









