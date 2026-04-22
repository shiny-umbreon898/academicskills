# CODEBASE ARCHITECTURE

This file explains how the code is organized. 
It also states conventions to follow when you add code

## TOP LEVEL LAYOUT

frontend/src/
- App.js            App shell, routing, dark mode
- components/       Reusable UI components
	- Confetti.js       Canvas confetti animation
	- ScoreControls.js   Save, mark-complete and reset controls
- pages/            Page components and modules
	- Dashboard.js     Main hub showing progress and badges
	- Page.js          Generic page template (for H5P or custom)
	- Page2.js         Interactive video lesson with quizzes
- utils/            Pure utility functions
	- cookies.js        Get and set progress in cookies
	- progressUtils.js  Compute scores, levels and badges
	- validationUtils.js Validate external content formats
- constants/        Central configuration values
	- gameConfig.js     Game settings like XP and max scores
	- storageKeys.js    Names for cookies and localStorage keys
- resources/        Static assets and sample files

## DESIGN PRINCIPLES

- Keep logic out of UI files and place pure functions into utils
- Values should be constants and not hardcoded in.
- Make each component small and focused.
- Document code with JSDoc and short inline comments

## COMPONENT RULES

- One purpose per component.
- Receive data and callbacks via props
- No direct cookie access in most components; use utils or hooks
- Write small helper functions in utils and call them from pages

## UTILITY RULES

- Utilities must be pure where possible
- No DOM access in utils
- Export small functions that do one thing
- Unit test utilities when possible

## CONSTANTS

- Put keys in src/constants
- Use storageKeys.js for cookie and localStorage keys
- Use gameConfig.js for scores, XP and similar settings

## DATA FLOW

- App.js initializes user id and theme.
- Pages read and write progress via cookies utils
- Dashboard uses progressUtils to compute totals and levels
- Page2 saves answers per question and notifies other pages via events

## EVENTS

- fireConfetti: play confetti animation. Event detail: { x, y, count }
- progress_updated: indicates that progress changed and views should refresh

## ADDING A MODULE

1. Add config to h5pConfig.js if using H5P
2. Create a new page in src/pages/. Use Page.js as template
3. Add the module to Dashboard.js view
4. Update gameConfig.MAX_SCORES for module max score
5. Document any new constants

## VALIDATION GUIDELINES

- Use validationUtils.validateQuestions when loading external content
- Check times are numeric and within video duration
- Check correctIndex bounds

## STYLE NOTES AND CONVENTIONS

- Use short sentences and clear variable names
- Use camelCase for variables and functions
- Use PascalCase for React components

## WHERE TO READ NEXT

- COMPONENT_LIBRARY.md for component usage.
- EXTERNAL_CONTENT_GUIDE.md for adding JSON or CSV content.
- DATA_STRUCTURES.md for exact data formats.
