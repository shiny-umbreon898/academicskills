/**
 * src/constants/storageKeys.js
 * 
 * Centralized storage key names used throughout the application.
 * This prevents typos and makes it easy to change key names globally.
 */

const STORAGE_KEYS = {
  // Cookies
  USER_ID: 'user_id',
  PROGRESS: 'progress',
  ACHIEVEMENTS: 'achievements',
  
  // localStorage
  DARK_MODE: 'darkMode',
  PROGRESS_UPDATED_AT: 'progress_updated_at',
  USER_ID_LOCAL: 'user_id',
};

export default STORAGE_KEYS;
