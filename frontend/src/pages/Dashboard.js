// react hook for managing form state
import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import { getCookie } from '../utils/cookies';

// mapping for max scores per content
const MAX_SCORES = { page1: 10, page2: 5, page3: 5 };

function Dashboard({ navigate }) {
    const [achievements, setAchievements] = useState({ completedCount: 0, level: 1 });
    const [progressItems, setProgressItems] = useState({});

    useEffect(() => {
        const a = getCookie('achievements') || { completedCount: 0, level: 1 };
        setAchievements(a);
        const p = getCookie('progress') || {};
        setProgressItems(p);
    }, []);

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
                <div className={`page-card-status ${isCompleted ? 'status-completed' : item ? 'status-in-progress' : 'status-not-started'}`}>
                    {isCompleted && 'Completed'}
                    {item && !isCompleted && 'In Progress'}
                    {!item && 'Not Started'}
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
            <h1>Dashboard A</h1>

            <div className="dashboard-header">
                <div className="dashboard-panel">
                    <h3>Level & Achievements</h3>
                    <div className="level-display">Level {achievements.level}</div>
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

                <div className="dashboard-panel">
                    <h3>Progress</h3>
                    <ul className="progress-list">
                        {['page1', 'page2', 'page3'].map(id => {
                            const item = progressItems[id];
                            const max = MAX_SCORES[id] || 10;
                            const pct = item ? Math.round((Number(item.score || 0) / max) * 100) : 0;
                            return (
                                <li key={id}>
                                    <strong>{id}:</strong> {item && item.completed ? `Completed (${item.score})` : `${pct}% complete`}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>

            <div className="page-cards-container">
                {renderPageCard('page1', 'Page One')}
                {renderPageCard('page2', 'Page Two')}
                {renderPageCard('page3', 'Page Three')}
            </div>
        </div>
    );
}

export default Dashboard;