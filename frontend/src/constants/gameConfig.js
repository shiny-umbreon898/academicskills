/**
 * src/constants/gameConfig.js
 * 
 * Game balance and configuration constants.
 * Adjust these values to change game difficulty, rewards, and progression.
 */

const GAME_CONFIG = {
  // Experience points system
  EXP_PER_LEVEL: 5,  // Base EXP required per level (multiplied by level number)
  
  // Module scores (max points available per module)
  MAX_SCORES: {
    page1: 10,
    page2: 6,
    page3: 5,
  },
  
  // Confetti animation settings
  CONFETTI_PARTICLE_COUNT: {
    correct_answer: 80,
    full_score_completion: 160,
    badge_click: 120,
  },
};

export default GAME_CONFIG;
