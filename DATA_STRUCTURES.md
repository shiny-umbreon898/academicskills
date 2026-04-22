# Data Structures and Flow

This document lists the key data shapes used across the app. 
Use it when you write or read data from cookies or external files.

## PROGRESS COOKIE FORMAT

Cookie name: `progress`

Shape: object keyed by page id

Example:

```json
{
  "page1": {
    "score": 8,
    "completed": false,
    "timestamp": 1645000000000,
    "quizAnswers": {
      "q1": 2,
      "q2": 0
    },
    "awardedExp": 0
  },
  "page2": {
    "score": 6,
    "completed": true,
    "quizAnswers": {
      "tip1": 1,
      "tip2": 2,
      "tip3": 1,
      "tip4": 1,
      "tip5": 1,
      "tip6": 3
    },
    "awardedExp": 6
  },
  "page3": {
    "score": 0,
    "completed": false,
    "timestamp": null,
    "quizAnswers": {},
    "awardedExp": 0
  }
}
```

### FIELDS

- `score`: number, 0..maxScore for the module.
- `completed`: boolean.
- `timestamp`: ms since epoch.
- `quizAnswers`: object mapping question id to selected option index.
- `awardedExp`: number of XP already granted for this module.

## ACHIEVEMENTS COOKIE


Cookie name: `achievements`

Shape example:

```json
{ "completedCount": 1, "level": 1, "totalExp": 6 }
```

### DERIVED VALUES

- Level is `floor(completedCount / 3) + 1`.
- Level progress uses `EXP_PER_LEVEL` from `gameConfig.js`.

## QUESTION OBJECT (USED IN PAGE2 OR EXTERNAL JSON)

Shape example:

```json
{
  "id": "tip1",
  "title": "Long Sentences",
  "time": 207,
  "question": "Why avoid long sentences?",
  "options": ["A", "B", "C", "D"],
  "correctIndex": 1,
  "feedback": "..."
}
```

## FIELDS

- `id`: string, unique.
- `time`: number, seconds into the video.
- `options`: array of strings (2..4 items).
- `correctIndex`: 0-based index of correct option.

## H5P MAPPING

- `h5pConfig.js` holds per-module `maxScore` and URL.
- When H5P emits xAPI, use `statement.result.score.scaled` or `raw` to compute
  app score.
- Save app score into progress cookie as above.

## EXTERNAL JSON FORMAT

- Place files in `public/resources/`.
- Example: `public/resources/questions_page2.json`
  ```json
  { "tips": [ <question objects> ] }
  ```
- Validate with `validationUtils.validateQuestions` before using.

## CSV FORMAT

- Headers: `id,title,time,question,option1,option2,option3,option4,correctIndex,feedback`
- Parse and map to the question object shape.

## EVENTS IN DATA FLOW

- After saving progress: dispatch `progress_updated` event.
- To trigger confetti: dispatch `fireConfetti` CustomEvent with detail.

## KEEP FORMATS STABLE

If you change a structure, update `DATA_STRUCTURES.md` and code that parses
or writes the data. Keep backward compatibility where possible.
