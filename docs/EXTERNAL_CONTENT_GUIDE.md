## External Content Guide

This file explains two related topics.
1. How to implement loading questions from JSON or CSV files.
2. How to add H5P interactive content and map H5P scores to the app.

## Loading questions from JSON (for quick content)

1. Put a JSON file in public/resources/. Example:
   public/resources/questions_page2.json

   ```json
   {
     "tips": [
       { "id": "tip1", "title": "Long Sentences", "time": 207,
         "question": "Why avoid long sentences?",
         "options": ["A","B","C","D"], "correctIndex": 1, "feedback": "..." }
     ]
   }
   ```

2. In Page2.js fetch the file on mount. Use `validationUtils.validateQuestions` to
   check the data.
3. If validation fails, fall back to hardcoded GRAMMAR_TIPS.
4. Use the loaded data for timeline markers and initial question state.

## Loading questions from CSV (spreadsheet friendly)

1. Create public/resources/questions_page2.csv with headers:
   `id,title,time,question,option1,option2,option3,option4,correctIndex,feedback`
2. Implement a small CSV parser in the page component or use a tiny library.
3. Convert rows to the same object shape used by JSON.
4. Validate and use the data as above.

## H5P integration and scoring

H5P content emits xAPI events that describe interactions. 
The app be adjusted to listen for those events and translates an H5P score to the app score.

### Steps to add H5P content

1. Add module entry in src/pages/h5pConfig.js with fields:
   - title
   - url
   - maxScore
   - thumbnail (optional)

2. Use Page.js or a new page to embed H5P. Choose one of two options:
   - h5p-standalone when H5P runs in same window (heavy package, but easier to listen for xAPI)
     ```js
     import H5PStandalone from 'h5p-standalone';
     <H5PStandalone url={h5pConfig.url} />
     ```
   - iframe embed and listen to postMessage for xAPI events (from H5P iframe)
     ```js
     <iframe src={h5pConfig.url} />
     ```

3. Listen for xAPI or postMessage events.
   Example for same window:
     ```js
     H5P.externalDispatcher.on('xAPI', function(event) { handleXapiEvent(event.data.statement, pageId); });
     ```

   Example for iframe postMessage:
     ```js
     window.addEventListener('message', function(e) { /* inspect e.data */ });
     ```

4. Map xAPI score to module score
   - If xAPI provides scaled (0..1): `score = Math.round(scaled * maxScore)`
   - If raw and max provided: `score = Math.round((raw / max) * maxScore)`
   - Save the score in cookies under `progress[pageId].score`
   - Set `progress[pageId].completed = (score >= maxScore)`

5. Notify the app that progress changed:
   ```js
   window.dispatchEvent(new Event('progress_updated'))
   ```

## Editor workflow for H5P metadata

- Keep a simple JSON alongside H5P packages that maps H5P question ids to
  friendly labels and timestamps. Editors can update that JSON.
- Example location: public/resources/h5p/page4_questions.json
- Load that JSON at runtime and use it to render timeline markers and labels.

## Security and Validation


- For postMessage, check the origin to avoid accepting messages from unknown
  sources.
- Validate all external data with `validationUtils` before using it.

## Summary

- Use JSON files for non-dev editors. CSV is fine for spreadsheet workflows.
- For H5P, listen for xAPI or postMessage events. Map H5P scores to the app
  model using h5pConfig.js maxScore.
- Keep external JSON small and validated. Fall back to hardcoded data if needed.
