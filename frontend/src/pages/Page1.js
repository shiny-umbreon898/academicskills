import React, { useState, useEffect } from 'react';
import { getCookie, setCookie } from '../utils/cookies';

export function VideoTemplate({ contentId = 'page1', title = 'Video One', maxScore = 10 }) {
    const [score, setScore] = useState(0);
    const [completed, setCompleted] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const progress = getCookie('progress') || {};
        const data = progress[contentId];
        if (data) {
            setCompleted(!!data.completed);
            setScore(Number(data.score) || 0);
        }
    }, [contentId]);

    const saveProgress = (complete = false) => {
        // clamp score to allowed range
        let s = Number(score) || 0;
        if (s < 0) s = 0;
        if (s > maxScore) s = maxScore;

        const progress = getCookie('progress') || {};
        progress[contentId] = { completed: !!complete, score: s, timestamp: Date.now() };
        setCookie('progress', progress);

        // recompute achievements
        const all = getCookie('progress') || {};
        const completedCount = Object.values(all).filter(v => v && v.completed).length;
        const summary = { completedCount, level: Math.floor(completedCount / 3) + 1 };
        setCookie('achievements', summary);

        setCompleted(!!complete);
        setScore(s);
        setMessage(complete ? 'Marked complete' : 'Progress saved');

        // trigger confetti if completing
        if (complete && !completed) {
            triggerConfetti();
        }
    };

    const triggerConfetti = () => {
        if (typeof window !== 'undefined' && window.document) {
            const canvas = document.createElement('canvas');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            canvas.style.position = 'fixed';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.pointerEvents = 'none';
            canvas.style.zIndex = '9999';
            document.body.appendChild(canvas);

            const ctx = canvas.getContext('2d');
            const particles = [];

            for (let i = 0; i < 100; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: -10,
                    vx: (Math.random() - 0.5) * 8,
                    vy: Math.random() * 5 + 3,
                    color: ['#dc143c', '#FFD700', '#4CAF50', '#2196F3'][Math.floor(Math.random() * 4)],
                    size: Math.random() * 4 + 2,
                });
            }

            const animate = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                let hasParticles = false;

                particles.forEach(p => {
                    if (p.y < canvas.height) {
                        p.y += p.vy;
                        p.x += p.vx;
                        p.vy += 0.1; // gravity
                        ctx.fillStyle = p.color;
                        ctx.fillRect(p.x, p.y, p.size, p.size);
                        hasParticles = true;
                    }
                });

                if (hasParticles) {
                    requestAnimationFrame(animate);
                } else {
                    document.body.removeChild(canvas);
                }
            };

            animate();
        }
    };

    const markComplete = () => {
        saveProgress(true);
    };

    const savePartial = () => {
        saveProgress(false);
    };

    const reset = () => {
        const progress = getCookie('progress') || {};
        delete progress[contentId];
        setCookie('progress', progress);

        const all = getCookie('progress') || {};
        const completedCount = Object.values(all).filter(v => v && v.completed).length;
        const summary = { completedCount, level: Math.floor(completedCount / 3) + 1 };
        setCookie('achievements', summary);

        setCompleted(false);
        setScore(0);
        setMessage('Progress reset');
    };

    return (
        <div>
            <h1>{title}</h1>
            <div style={{ maxWidth: 800, background: '#111', color: '#fff', padding: 10, borderRadius: 8 }}>
                {/* video placeholder - user can replace src with real URL */}
                <video style={{ width: '100%' }} controls>
                    <source src="" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>

            <div style={{ marginTop: 12 }}>
                <label>
                    Score: <input type="number" value={score} onChange={e => setScore(e.target.value)} min={0} max={maxScore} />
                    <span style={{ marginLeft: 8, color: '#666' }}>/ {maxScore}</span>
                </label>
                <button onClick={savePartial} style={{ marginLeft: 8 }}>Save Progress</button>
                <button onClick={markComplete} style={{ marginLeft: 8 }}>Mark Complete</button>
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
