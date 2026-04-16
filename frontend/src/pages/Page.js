import React, { useEffect, useState } from 'react';
import { getCookie, setCookie } from '../utils/cookies';
import H5P_CONFIG from './h5pConfig';
import ScoreControls from '../components/ScoreControls';
import Confetti from '../components/Confetti';

export default function Page({ contentId }) {
  const cfg = H5P_CONFIG[contentId] || {};
  const maxScore = cfg.maxScore || 5;

  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [message, setMessage] = useState('');
  const [h5pReady, setH5pReady] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [showTranscript, setShowTranscript] = useState(false);

  useEffect(() => {
    const progress = getCookie('progress') || {};
    const data = progress[contentId];
    if (data) {
      setCompleted(!!data.completed);
      setScore(Number(data.score) || 0);
    }

    // If H5P required, try load embed script
    if (cfg.type === 'h5p') {
      if (window.H5P) setH5pReady(true);
      else {
        const s = document.createElement('script');
        s.src = 'https://h5p.example.com/h5p/js/h5p-embed.js';
        s.async = true;
        s.onload = () => setH5pReady(true);
        document.body.appendChild(s);
      }
    }

    // Load transcript if provided
    if (cfg.transcript) {
      fetch(cfg.transcript)
        .then(res => res.text())
        .then(txt => setTranscript(txt))
        .catch(() => setTranscript(''));
    }
  }, [contentId]);

  const persistProgress = (progress) => {
    setCookie('progress', progress);
    try {
      localStorage.setItem('progress_updated_at', String(Date.now()));
      window.dispatchEvent(new Event('progress_updated'));
    } catch (e) {}
  };

  const awardExperienceIfNeeded = (progress, awardAmount) => {
    if (!progress) return;
    const existing = progress[contentId] || {};
    const alreadyAwarded = Number(existing.awardedExp || 0);
    const toAward = Math.max(0, Number(awardAmount || 0) - alreadyAwarded);
    if (toAward <= 0) return;

    const achievements = getCookie('achievements') || { completedCount: 0, level: 1, totalExp: 0 };
    const prevCompletedCount = Number(achievements.completedCount || 0);
    const newTotalExp = Number(achievements.totalExp || 0) + toAward;
    const newCompletedCount = existing.completed ? prevCompletedCount : prevCompletedCount + 1;
    const newLevel = Math.floor(newCompletedCount / 3) + 1;

    const newAchievements = { completedCount: newCompletedCount, level: newLevel, totalExp: newTotalExp };
    setCookie('achievements', newAchievements);

    progress[contentId] = { ...existing, awardedExp: (Number(existing.awardedExp || 0) + toAward) };
    persistProgress(progress);
  };

  const saveProgress = (complete = false, newScore = null) => {
    const progress = getCookie('progress') || {};
    const existing = progress[contentId] || {};

    let s = newScore !== null ? Number(newScore) : Number(score || 0);
    if (Number.isNaN(s)) s = 0;
    if (s < 0) s = 0;
    if (s > maxScore) s = maxScore;

    progress[contentId] = {
      ...existing,
      completed: !!complete || existing.completed || false,
      score: s,
      timestamp: Date.now(),
      awardedExp: existing.awardedExp || 0
    };

    if (complete && !existing.completed) {
      const awardAmount = maxScore;
      awardExperienceIfNeeded(progress, awardAmount);
      setCompleted(true);
      setMessage('Marked complete');
      // Confetti when marking complete with full score
      if (s === maxScore) {
        window.dispatchEvent(new CustomEvent('fireConfetti', { detail: { count: 160 } }));
      }
    } else {
      persistProgress(progress);
      setCompleted(progress[contentId].completed);
      setMessage('Progress saved');
    }

    setScore(s);
  };

  const onScoreChange = (value) => {
    let v = Number(value);
    if (Number.isNaN(v)) v = 0;
    if (v < 0) v = 0;
    if (v > maxScore) v = maxScore;
    setScore(v);
    saveProgress(false, v);
    if (v >= maxScore) saveProgress(true, v);
  };

  const reset = () => {
    const progress = getCookie('progress') || {};
    const existing = progress[contentId] || {};
    if (existing.completed && existing.awardedExp) {
      const achievements = getCookie('achievements') || { completedCount: 0, level: 1, totalExp: 0 };
      const newTotalExp = Math.max(0, Number(achievements.totalExp || 0) - Number(existing.awardedExp || 0));
      const newCompletedCount = Math.max(0, Number(achievements.completedCount || 0) - 1);
      const newLevel = Math.floor(newCompletedCount / 3) + 1;
      const newAchievements = { completedCount: newCompletedCount, level: newLevel, totalExp: newTotalExp };
      setCookie('achievements', newAchievements);
    }
    delete progress[contentId];
    persistProgress(progress);
    setCompleted(false);
    setScore(0);
    setMessage('Progress reset');
  };

  return (
    <div>
      <Confetti />
      <h1>{cfg.title || contentId}</h1>

      <div style={{ maxWidth: 900, background: '#fff', padding: 16, borderRadius: 8, marginBottom: 16 }}>
        {cfg.type === 'h5p' ? (
          h5pReady ? (
            <div className="h5p-iframe-wrapper" style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
              <iframe src={cfg.url} allowFullScreen title={`H5P - ${contentId}`} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none', borderRadius: 8 }} />
            </div>
          ) : (
            <div style={{ padding: 20, textAlign: 'center', color: '#999' }}>Loading H5P content...</div>
          )
        ) : (
          <div>
            <video width="100%" controls style={{ borderRadius: 8, backgroundColor: '#000' }}>
              <source src={cfg.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            {transcript && (
              <div style={{ marginTop: 12 }}>
                <button onClick={() => setShowTranscript(!showTranscript)} style={{ marginBottom: 8 }}>
                  {showTranscript ? 'Hide transcript' : 'Show transcript'}
                </button>
                {showTranscript && (
                  <pre style={{ whiteSpace: 'pre-wrap', maxHeight: 320, overflow: 'auto', background: '#f7f7f7', padding: 12, borderRadius: 6 }}>
                    {transcript}
                  </pre>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <ScoreControls score={score} setScore={setScore} maxScore={maxScore} onSave={saveProgress} onReset={reset} completed={completed} message={message} />
    </div>
  );
}
