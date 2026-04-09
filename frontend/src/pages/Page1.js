import React, { useState, useEffect } from 'react';
import { getCookie, setCookie } from '../utils/cookies';

// H5P content IDs and configuration for each page
// Configure with your actual H5P content IDs from your H5P server
const H5P_CONFIG = {
    page1: {
        contentId: 1, // Replace with your H5P content ID
        url: 'https://h5p.example.com/h5p/embed/1', // Replace with H5P server URL
        thumbnail: null // or path to thumbnail image
    },
    page2: {
        contentId: 2,
        url: 'https://h5p.example.com/h5p/embed/2',
        thumbnail: null
    },
    page3: {
        contentId: 3,
        url: 'https://h5p.example.com/h5p/embed/3',
        thumbnail: null
    }
};

// VideoTemplate is a reusable component used by Page1, Page2 and Page3
// It displays an H5P interactive video and automatically saves partial scores
// and marks the content completed when the score reaches the configured maxScore.
// When content is completed it awards experience (EXP) and updates the achievements
// cookie exactly once per content item using the awardedExp flag stored with the
// content progress.
export function VideoTemplate({ contentId = 'page1', title = 'Video One', maxScore = 10 }) {
    const [score, setScore] = useState(0);
    const [completed, setCompleted] = useState(false);
    const [message, setMessage] = useState('');
    const [h5pReady, setH5pReady] = useState(false);

    // Load existing progress on mount
    useEffect(() => {
        const progress = getCookie('progress') || {};
        const data = progress[contentId];
        if (data) {
            setCompleted(!!data.completed);
            setScore(Number(data.score) || 0);
        }

        // Load H5P library if not already loaded
        loadH5PLibrary();
    }, [contentId]);

    // Helper: Load the H5P library from CDN
    const loadH5PLibrary = () => {
        if (window.H5P) {
            setH5pReady(true);
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://h5p.example.com/h5p/js/h5p-embed.js';
        script.async = true;
        script.onload = () => {
            setH5pReady(true);
        };
        document.body.appendChild(script);
    };

    // Helper: persist progress object back to cookies
    const persistProgress = (progress) => {
        setCookie('progress', progress);
        // also write a small localStorage key to allow other tabs/components to detect an update
        try {
            localStorage.setItem('progress_updated_at', String(Date.now()));
            // dispatch a custom event so same-tab listeners can react immediately
            window.dispatchEvent(new Event('progress_updated'));
        } catch (e) {
            // ignore storage errors
        }
    };

    // Award experience for a completion only once per content item.
    // Stores awardedExp on the progress item to prevent double-awarding.
    const awardExperienceIfNeeded = (progress, awardAmount) => {
        if (!progress) return;
        const existing = progress[contentId] || {};
        const alreadyAwarded = Number(existing.awardedExp || 0);
        const toAward = Math.max(0, Number(awardAmount || 0) - alreadyAwarded);
        if (toAward <= 0) return;

        // Read current achievements, add EXP and increment completedCount if this was not previously completed
        const achievements = getCookie('achievements') || { completedCount: 0, level: 1, totalExp: 0 };
        const prevCompletedCount = Number(achievements.completedCount || 0);
        const newTotalExp = Number(achievements.totalExp || 0) + toAward;
        const newCompletedCount = existing.completed ? prevCompletedCount : prevCompletedCount + 1;
        const newLevel = Math.floor(newCompletedCount / 3) + 1;

        const newAchievements = {
            completedCount: newCompletedCount,
            level: newLevel,
            totalExp: newTotalExp
        };
        setCookie('achievements', newAchievements);

        // mark awardedExp on the progress item
        progress[contentId] = { ...existing, awardedExp: (Number(existing.awardedExp || 0) + toAward) };
        persistProgress(progress);
    };

    // Save progress; if complete==true then handle awarding EXP if not already awarded.
    const saveProgress = (complete = false, newScore = null) => {
        const progress = getCookie('progress') || {};
        const existing = progress[contentId] || {};

        // determine score to persist (use passed newScore if provided)
        let s = newScore !== null ? Number(newScore) : Number(score || 0);
        if (Number.isNaN(s)) s = 0;
        // clamp score
        if (s < 0) s = 0;
        if (s > maxScore) s = maxScore;

        // update progress entry
        progress[contentId] = {
            ...existing,
            completed: !!complete || existing.completed || false,
            score: s,
            timestamp: Date.now(),
            awardedExp: existing.awardedExp || 0 // keep existing awardedExp
        };

        // If marking as complete and not previously recorded as completed, award EXP
        if (complete && !existing.completed) {
            // Award EXP equal to the maxScore for this content (you can change this rule)
            const awardAmount = maxScore;
            awardExperienceIfNeeded(progress, awardAmount);
            setCompleted(true);
            setMessage('Marked complete');
        } else {
            // Persist partial progress only
            persistProgress(progress);
            setCompleted(progress[contentId].completed);
            setMessage('Progress saved');
        }

        // update score in state as well
        setScore(s);
    };

    // Auto-save whenever the score changes; if the new score reaches maxScore mark complete
    const onScoreChange = (value) => {
        let v = Number(value);
        if (Number.isNaN(v)) v = 0;
        if (v < 0) v = 0;
        if (v > maxScore) v = maxScore;
        setScore(v);

        // auto-save partial progress
        saveProgress(false, v);

        // if reaches max, auto-complete and award EXP
        if (v >= maxScore) {
            saveProgress(true, v);
        }
    };

    // Manual reset: remove progress for this content and update achievements accordingly
    const reset = () => {
        const progress = getCookie('progress') || {};
        const existing = progress[contentId] || {};

        // If this item was completed and had awardedExp, reduce achievements.totalExp and completedCount accordingly
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

    const config = H5P_CONFIG[contentId];

    return (
        <div>
            <h1>{title}</h1>

            {/* H5P Interactive Video Container */}
            <div style={{ maxWidth: 900, background: '#fff', padding: 16, borderRadius: 8, marginBottom: 16 }}>
                {h5pReady ? (
                    <div
                        className="h5p-iframe-wrapper"
                        style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}
                    >
                        <iframe
                            src={config?.url}
                            allowFullScreen
                            title={`H5P Interactive Content - ${contentId}`}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                border: 'none',
                                borderRadius: 8
                            }}
                        />
                    </div>
                ) : (
                    <div style={{ padding: 20, textAlign: 'center', color: '#999' }}>
                        <p>Loading H5P content...</p>
                        <p style={{ fontSize: 12 }}>
                            <strong>Note:</strong> Configure H5P_CONFIG with your H5P server URL and content IDs.
                        </p>
                    </div>
                )}
            </div>

            <div style={{ marginTop: 12 }}>
                <label>
                    Score: <input type="number" value={score} onChange={e => onScoreChange(e.target.value)} min={0} max={maxScore} />
                    <span style={{ marginLeft: 8, color: '#666' }}>/ {maxScore}</span>
                </label>
                <button onClick={() => saveProgress(false)} style={{ marginLeft: 8 }}>Save Progress</button>
                <button onClick={() => saveProgress(true)} style={{ marginLeft: 8 }}>Mark Complete</button>
                <button onClick={reset} style={{ marginLeft: 8 }}>Reset</button>
            </div>

            <div style={{ marginTop: 12 }}>
                <strong>Status:</strong> {completed ? 'Completed' : 'Not completed'}
                {message && <div style={{ color: 'green' }}>{message}</div>}
            </div>
        </div>
    );
}

export default function Page1() {
    return <VideoTemplate contentId="page1" title="Video: Introduction" maxScore={10} />;
}
