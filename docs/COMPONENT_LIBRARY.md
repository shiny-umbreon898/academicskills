# Component library and utility reference

This document lists the main components and utilities and shows how to use them.

## Components

**Confetti**
- File: `src/components/Confetti.js`
- Purpose: global canvas confetti animation
- Usage: mount once in the app root. Fire events to trigger animation:
  ```
  window.dispatchEvent(new CustomEvent('fireConfetti', { detail: { x: 100, y: 100, count: 80 } }));
  ```

**ScoreControls**
- File: `src/components/ScoreControls.js`
- Purpose: simple controls for saving, marking complete and reset
- Props:
  - `score` (number)
  - `setScore` (function)
  - `maxScore` (number)
  - `onSave` (function)  `onSave(isComplete, newScore)`
  - `onReset` (function)
  - `completed` (boolean)
  - `message` (string)

- Usage: parent keeps state. Pass handlers to save progress.

## Pages

**Page.js**
- Generic H5P page template.
- Use this to embed H5P content and listen for events.

**Page<n>.js**
- Interactive video with timestamped questions.
- Save answers via cookies helpers.
- Use `progressUtils` for score calculation.

**Dashboard.js**
- Shows per-module cards, overall progress and badges.
- Reads cookies and uses `progressUtils` for totals.

## Utilities

**cookies.js**
- `setCookie`, `getCookie`, `deleteCookie`
- Stores JSON values in cookies

**progressUtils.js**
- `calculateTotalScore(progress)`
- `calculateOverallProgress(progress)`
- `calculateLevel(completedCount)`
- `calculateLevelProgress(totalExp, level)`
- Use these for Dashboard calculations

**validationUtils.js**
- `validateQuestion(q)`
- `validateQuestions(list, videoDuration)`
- `validateScore(score, max)`
- Use these when loading external files

## How to add a component

1. Create file in `src/components/` using PascalCase.
2. Document props with a short comment block.
3. Keep internal state minimal
4. If logic is reusable, move it to `src/utils/` and import it.

## Examples

- To save progress from a page, use cookies helpers and then call:
  ```
  window.dispatchEvent(new Event('progress_updated'))
  ```

- To show confetti on a correct answer:
  ```
  window.dispatchEvent(new CustomEvent('fireConfetti', { detail: { count: 80 } }))
  ```

## Testing notes

- Test utilities with unit tests due to being pure functions
- For components, can write small tests for rendering and props handling


