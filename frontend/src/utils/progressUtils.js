/**
 * src/utils/progressUtils.js
 * 
 * Utility functions for calculating score, XP, and level progression.
 * These functions contain the core game logic for rewards and progression.
 */

import GAME_CONFIG from '../constants/gameConfig';

/**
 * Calculate the total score across all completed modules.
 * 
 * @param {Object} progressItems - Object with page IDs as keys and progress data as values
 * @returns {number} Total score earned across all modules
 */
export const calculateTotalScore = (progressItems) => {
  if (!progressItems) return 0;
  
  return Object.keys(GAME_CONFIG.MAX_SCORES).reduce((sum, id) => {
    const item = progressItems[id];
    return sum + (item ? Number(item.score || 0) : 0);
  }, 0);
};

/**
 * Calculate overall progress percentage.
 * 
 * @param {Object} progressItems - Object with page IDs as keys and progress data as values
 * @returns {number} Overall progress as percentage (0-100)
 */
export const calculateOverallProgress = (progressItems) => {
  const totalScore = calculateTotalScore(progressItems);
  const totalMax = Object.values(GAME_CONFIG.MAX_SCORES).reduce((a, b) => a + b, 0);
  
  if (totalMax === 0) return 0;
  return Math.round((totalScore / totalMax) * 100);
};

/**
 * Calculate the number of modules completed.
 * 
 * @param {Object} progressItems - Object with page IDs as keys and progress data as values
 * @returns {number} Number of completed modules
 */
export const calculateCompletedModules = (progressItems) => {
  if (!progressItems) return 0;
  
  return Object.keys(progressItems).filter(id => progressItems[id]?.completed).length;
};

/**
 * Calculate the current level based on completed modules.
 * Level increases every 3 modules completed.
 * 
 * @param {number} completedCount - Number of completed modules
 * @returns {number} Current level (minimum 1)
 */
export const calculateLevel = (completedCount) => {
  return Math.floor(completedCount / 3) + 1;
};

/**
 * Calculate total XP within the current level.
 * 
 * @param {number} totalExp - Total experience points earned
 * @param {number} currentLevel - Current level
 * @returns {number} XP earned within current level
 */
export const calculateXpInLevel = (totalExp, currentLevel) => {
  const expRequired = currentLevel * GAME_CONFIG.EXP_PER_LEVEL;
  return totalExp % expRequired;
};

/**
 * Calculate XP needed to reach next level.
 * 
 * @param {number} totalExp - Total experience points earned
 * @param {number} currentLevel - Current level
 * @returns {number} XP still needed for next level
 */
export const calculateExpForNextLevel = (totalExp, currentLevel) => {
  const expRequiredThisLevel = currentLevel * GAME_CONFIG.EXP_PER_LEVEL;
  const expInCurrentLevel = calculateXpInLevel(totalExp, currentLevel);
  return expRequiredThisLevel - expInCurrentLevel;
};

/**
 * Calculate progress percentage within current level.
 * 
 * @param {number} totalExp - Total experience points earned
 * @param {number} currentLevel - Current level
 * @returns {number} Progress to next level as percentage (0-100)
 */
export const calculateLevelProgress = (totalExp, currentLevel) => {
  const expRequired = currentLevel * GAME_CONFIG.EXP_PER_LEVEL;
  const expInLevel = calculateXpInLevel(totalExp, currentLevel);
  
  if (expRequired === 0) return 0;
  return Math.round((expInLevel / expRequired) * 100);
};
