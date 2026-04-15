import React from 'react';

// Reusable score controls component
// Props:
// - score: number
// - setScore: function(newScore)
// - maxScore: number
// - onSave: function(complete:boolean, newScore:number|null)
// - onReset: function()
// - completed: boolean
// - message: string
export default function ScoreControls({ score, setScore, maxScore = 5, onSave, onReset, completed = false, message = '' }) {
  const handleChange = (e) => {
    const v = Number(e.target.value);
    if (Number.isNaN(v)) return setScore(0);
    setScore(Math.max(0, Math.min(maxScore, v)));
  };

  return (
    <div style={{ marginTop: 12 }}>
      <label>
        Score: <input type="number" value={score} onChange={handleChange} min={0} max={maxScore} />
        <span style={{ marginLeft: 8, color: '#666' }}>/ {maxScore}</span>
      </label>
      <button onClick={() => onSave(false, score)} style={{ marginLeft: 8 }}>Save Progress</button>
      <button onClick={() => onSave(true, score)} style={{ marginLeft: 8 }}>Mark Complete</button>
      <button onClick={onReset} style={{ marginLeft: 8 }}>Reset</button>

      <div style={{ marginTop: 12 }}>
        <strong>Status:</strong> {completed ? 'Completed' : 'Not completed'}
        {message && <div style={{ color: '#4CAF50', fontWeight: 600, marginTop: 8 }}>{message}</div>}
      </div>
    </div>
  );
}
