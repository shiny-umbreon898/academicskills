/**
 * src/components/ScoreControls.js
 * 
 * Reusable component for managing quiz progress.
 * Provides buttons for saving, marking complete, and resetting progress.
 * 
 * This is a controlled component - all state is managed by parent.
 * 
 * Props:
 *   @param {number} score - Current score (required)
 *   @param {Function} setScore - Function to update score (required)
 *   @param {number} maxScore - Maximum possible score (default: 5)
 *   @param {Function} onSave - Callback: onSave(isComplete, newScore) (required)
 *   @param {Function} onReset - Callback: onReset() (required)
 *   @param {boolean} completed - Whether module is completed (default: false)
 *   @param {string} message - Status message to display (default: '')
 */

import React from 'react';

function ScoreControls({ 
  score, 
  setScore, 
  maxScore = 5, 
  onSave, 
  onReset, 
  completed = false, 
  message = '' 
}) {
  /**
   * Handle score input change
   * Validates input and clamps to valid range
   * @param {Event} e - Input change event
   */
  const handleChange = (e) => {
    const v = Number(e.target.value);
    if (Number.isNaN(v)) return setScore(0);
    // Clamp score between 0 and maxScore
    setScore(Math.max(0, Math.min(maxScore, v)));
  };

  return (
    <div style={{ marginTop: 12 }}>
      {/* Score input field */}
      <label>
        Score: <input 
          type="number" 
          value={score} 
          onChange={handleChange} 
          min={0} 
          max={maxScore} 
        />
        <span style={{ marginLeft: 8, color: '#666' }}>/ {maxScore}</span>
      </label>

      {/* Action buttons */}
      <button onClick={() => onSave(false, score)} style={{ marginLeft: 8 }}>
        Save Progress
      </button>
      <button onClick={() => onSave(true, score)} style={{ marginLeft: 8 }}>
        Mark Complete
      </button>
      <button onClick={onReset} style={{ marginLeft: 8 }}>
        Reset
      </button>

      {/* Status display */}
      <div style={{ marginTop: 12 }}>
        <strong>Status:</strong> {completed ? 'Completed' : 'Not completed'}
        {message && <div style={{ color: '#4CAF50', fontWeight: 600, marginTop: 8 }}>{message}</div>}
      </div>
    </div>
  );
}

export default ScoreControls;
