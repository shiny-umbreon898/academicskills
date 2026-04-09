// Dashboard page: shows levels, achievements, overall and per-page progress
import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import { getCookie } from '../utils/cookies';

// Max scores per content item
const MAX_SCORES = { page1: 10, page2: 5, page3: 5 };
// Compute total possible score from MAX_SCORES to keep values consistent
const TOTAL_MAX_SCORE = Object.values(MAX_SCORES).reduce((a, b) => a + b, 0);
const EXP_PER_LEVEL = 5; // base experience required per level (scaled by level)

function Dashboard({ navigate }) {
    // achievements holds completedCount, level and totalExp (total experience earned)
    const [achievements, setAchievements] = useState({ completedCount: 0, level: 1, totalExp: 0 });
    const [progressItems, setProgressItems] = useState({});

    // Load stored state from cookies
    const refreshState = () => {
        const a = getCookie('achievements') || { completedCount: 0, level: 1, totalExp: 0 };
        setAchievements(a);
        const p = getCookie('progress') || {};
        setProgressItems(p);
    };

    useEffect(() => {
        refreshState();

        // Listen for storage events (other tabs) and a custom in-page event for same-tab updates
        const onStorage = (e) => {
            if (e.key === 'progress_updated_at' || e.key === 'achievements') {
                refreshState();
            }
        };
        const onCustom = () => refreshState();

        window.addEventListener('storage', onStorage);
        window.addEventListener('progress_updated', onCustom);

        return () => {
            window.removeEventListener('storage', onStorage);
            window.removeEventListener('progress_updated', onCustom);
        };
    }, []);

    // Calculate overall progress as percent of total score
    const calculateOverallProgress = () => {
        const totalScore = Object.keys(MAX_SCORES).reduce((sum, id) => {
            const item = progressItems[id];
            return sum + (item ? Number(item.score || 0) : 0);
        }, 0);
        if (TOTAL_MAX_SCORE === 0) return 0;
        return Math.round((totalScore / TOTAL_MAX_SCORE) * 100);
    };

    // Calculate how much EXP is needed to reach the next level
    const calculateExpForNextLevel = () => {
        const totalExp = Number(achievements.totalExp || 0);
        const currentLevel = Math.max(1, Number(achievements.level || 1));
        const expRequiredThisLevel = currentLevel * EXP_PER_LEVEL;
        // How much EXP has been accumulated into the current level
        const expInCurrentLevel = totalExp % expRequiredThisLevel;
        const expNeeded = expRequiredThisLevel - expInCurrentLevel;
        return expNeeded;
    };

    const overallProgress = calculateOverallProgress();
    const expForNext = calculateExpForNextLevel();

    // SVG circle math
    const RADIUS = 52;
    const circumference = 2 * Math.PI * RADIUS;
    const strokeDashoffset = circumference - (overallProgress / 100) * circumference;

    // Render a single page card (status, linear progress, score, action button)
    const renderPageCard = (contentId, title) => {
        const item = progressItems[contentId];
        const isCompleted = item && item.completed;
        const max = MAX_SCORES[contentId] || 10;
        const percent = item ? Math.round((Number(item.score || 0) / max) * 100) : 0;

        const getButtonLabel = () => {
            if (!item) return 'Start';
            if (item.completed) return 'Completed';
            return 'Continue';
        };

        const getButtonClass = () => {
            if (!item) return 'btn-start';
            if (item.completed) return 'btn-completed';
            return 'btn-continue';
        };

        return (
            <div key={contentId} className="page-card" onClick={() => navigate(`/${contentId}`)}>
                <h3>{title}</h3>

                {/* status line */}
                <div className={`page-card-status ${isCompleted ? 'status-completed' : item ? 'status-in-progress' : 'status-not-started'}`}>
                    {isCompleted && 'Completed'}
                    {item && !isCompleted && 'In Progress'}
                    {!item && 'Not Started'}
                </div>

                {/* linear progress bar: red fill that turns grey when completed */}
                <div className="page-progress-bar">
                    <div 
                        className={`page-progress-fill ${isCompleted ? 'Completed' : ''}`}
                        style={{ width: `${percent}%` }}
                    />
                </div>

                <div className="page-card-score">Score: {item ? item.score : 0} / {max} ({percent}%)</div>

                <button
                    className={`page-card-button ${getButtonClass()}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/${contentId}`);
                    }}
                >
                    {getButtonLabel()}
                </button>
            </div>
        );
    };

    return (
        <div>
            <h1>Dashboard</h1>

            {/* Progress elements organized into 4 subdivs: level, badges, overall, pages */}
            <div className="progress-elements-wrapper">
                {/* 1) Level & Experience */}
                <div className="progress-element level-section">
                    <h3>Level & Experience</h3>
                    <div className="level-display">Level {achievements.level}</div>

                    {/* EXP bar shows progress inside the current level */}
                    <div className="exp-info">
                        <div className="exp-bar-container">
                            {/* guard against division by zero */}
                            <div
                                className="exp-bar-fill"
                                style={{
                                    width: `${( (Number(achievements.totalExp || 0) % (Number(achievements.level || 1) * EXP_PER_LEVEL)) / (Number(achievements.level || 1) * EXP_PER_LEVEL) ) * 100}%`
                                }}
                            />
                        </div>
                        <div className="exp-text">EXP: {Number(achievements.totalExp || 0) % (Number(achievements.level || 1) * EXP_PER_LEVEL)} / {Number(achievements.level || 1) * EXP_PER_LEVEL}</div>
                        <div className="exp-next">Next Level: {expForNext} EXP needed</div>
                    </div>
                </div>

                {/* 2) Achievements / Badges */}
                <div className="progress-element badges-section">
                    <h3>Achievements</h3>
                    <div style={{ textAlign: 'center', fontSize: '14px', color: '#666', marginBottom: '12px' }}>
                        Completed: {achievements.completedCount}/3
                    </div>
                    <div className="achievements-badges">
                        {['page1', 'page2', 'page3'].map(id => (
                            <span
                                key={id}
                                className={`badge ${progressItems[id]?.completed ? 'completed' : 'incomplete'}`}
                            >
                                {progressItems[id]?.completed ? '' : ''}
                            </span>
                        ))}
                    </div>
                </div>

                {/* 3) Overall Progress (circular) */}
                <div className="progress-element overall-section">
                    <h3>Overall Progress</h3>
                    <div className="circular-progress">
                        <svg viewBox="0 0 120 120">
                            <circle
                                className="circular-progress-circle circular-progress-bg"
                                cx="60"
                                cy="60"
                                r={RADIUS}
                            />
                            <circle
                                className="circular-progress-circle circular-progress-fill"
                                cx="60"
                                cy="60"
                                r={RADIUS}
                                style={{ strokeDasharray: circumference, strokeDashoffset }}
                            />
                        </svg>
                        <div className="circular-progress-text">{overallProgress}%</div>
                    </div>
                </div>

                {/* 4) Page Progress List */}
                <div className="progress-element pages-section">
                    <h3>Page Progress</h3>
                    <ul className="progress-list">
                        {['page1', 'page2', 'page3'].map(id => {
                            const item = progressItems[id];
                            const max = MAX_SCORES[id] || 10;
                            const pct = item ? Math.round((Number(item.score || 0) / max) * 100) : 0;
                            return (
                                <li key={id}>
                                    <strong>{id}:</strong> {`${pct}% complete`}  
                                    {/* <strong>{id}:</strong> {item && item.completed ? `Completedd (${item.score})` : `${pct}% complete`} */   /* old progress checker */}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>

            {/* Page cards below the progress elements */}
            <div className="page-cards-container">
                {renderPageCard('page1', 'Page One')}
                {renderPageCard('page2', 'Page Two')}
                {renderPageCard('page3', 'Page Three')}
            </div>
        </div>
    );
}

export default Dashboard;