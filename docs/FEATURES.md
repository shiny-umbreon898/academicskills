# Features

Overview of key features and design decisions in the Academic Skills interactive learning dashboard

### Interactive Video with Embedded Quizzes

- Six grammar questions trigger at specific video timestamps (3:27, 4:42, 6:22, 8:03, 9:02, 11:18)
- Video automatically pauses when a question appears, showing a centered overlay modal
- Custom timeline progress bar with visual markers showing question locations
- Timeline markers change color (white to green) when questions are answered
- Click timeline to seek to any position in the video
- Continue button resumes video after answering

### Quiz and Scoring

- Multiple-choice questions with four options each
- Immediate feedback and detailed explanations for each question
- Score displays as number of correct answers (e.g., 4/6)
- Final score is marked as "complete" when all questions are answered
- Progress is saved after every answer (prevents data loss on last question)

### Progress Tracking and Persistence

- Unique user ID auto-generated on first visit (no login required)
- All progress stored in browser cookies and localStorage
- Cross-tab synchronization: progress updates visible in all open tabs
- Users can resume lessons exactly where they left off

### Gamification and Rewards

- XP (experience points) awarded for completing modules
- Level system with progress bar showing advancement to next level
- Achievement badges for each completed module
- Confetti animations trigger on:
  - Selecting a correct answer during quiz
  - Completing a video module with full score
  - Clicking a completed badge on Dashboard

### Dashboard Analytics

- Level display with current level and XP bar
- Circular progress indicator showing overall completion (0-100%)
- Individual module cards showing:
  - Thumbnail image (blank placeholder right now)
  - Current status (Not Started, In Progress, Completed)
  - Linear progress bar
  - Current score and percentage
  - Start / Continue / Completed button
- Badge collection display (visual badges for each module)
- Per-module progress breakdown


## BUGS

1. Last question answer not saving
   File: frontend/src/pages/Page2.js
   Solution: Modified saveProgress() to persist all answers
   Status: FIXED

2. Score showing 5 instead of 6
   File: frontend/src/constants/gameConfig.js, Dashboard.js
   Solution: Updated MAX_SCORES to 6, fixed auto-complete logic
   Status: FIXED

3. Badge confetti not displaying
   File: frontend/src/pages/Dashboard.js
   Solution: Wrapped confetti dispatch in setTimeout
   Status: FIXED