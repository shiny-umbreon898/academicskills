# GETTING STARTED WITH ACADEMIC SKILLS

This document helps navigate the Academic Skills codebase

## GETTING STARTED

This short guide tells you where to begin depending on your role.

### If you are a developer:
1. Read `README.md` for project overview.
2. Read `CODEBASE_ARCHITECTURE.md` for structure and rules
3. Read `COMPONENT_LIBRARY.md` for common components
4. Look at `src/pages/Page2.js` to see current quiz handling

### If you are a content editor:
1. Read `EXTERNAL_CONTENT_GUIDE.md`
2. Create questions_page<n>.json under public/resources/
3. Ask a developer to add or confirm loader in Page<n>.js

### If you are a tester:
1. Test utilities in `src/utils/` (pure functions)
2. Test Page saving and Dashboard updates

### If you are a manager
1. Read `QUICK_SUMMARY.md`

## RUNNING THE APP

### Development:
1. cd frontend
2. npm install (first time only)
3. npm start

Opens at: http://localhost:3000
Hot reload: Yes (changes refresh automatically)

### Production:
1. cd frontend
2. npm run build
3. Optimized files in: `frontend/build/`

## WHERE TO FIND HELP

- Use `INDEX.md` to find the right document.
- Read code comments and JSDoc in the source files.


