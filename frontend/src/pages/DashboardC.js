import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import { getCookie } from '../utils/cookies';

const MAX_SCORES = { page1: 10, page2: 5, page3: 5 };

function DashboardC({ navigate }) {
    const [achievements, setAchievements] = useState({ completedCount: 0, level: 1 });
    const [progressItems, setProgressItems] = useState({});

    useEffect(() => {
        const a = getCookie('achievements') || { completedCount: 0, level: 1 };
        setAchievements(a);
        const p = getCookie('progress') || {};
        setProgressItems(p);
    }, []);

    const badgeStyle = (completed) => ({
        display: 'inline-block',
        width: 40,
        height: 40,
        borderRadius: '50%',
        margin: 8,
        backgroundColor: completed ? '#4CAF50' : 'transparent',
        border: completed ? 'none' : '2px dashed #ccc',
        fontSize: 20,
        lineHeight: '40px',
        textAlign: 'center',
        color: completed ? '#fff' : '#999'
    });

    const cardStyle = {
        border: '1px solid #ccc',
        borderRadius: 8,
        padding: 20,
        margin: 10,
        width: 220,
        textAlign: 'center',
        cursor: 'pointer',
        background: '#fafafa',
        transition: 'all 0.3s ease'
    };

    const containerStyle = {
        display: 'flex',
        gap: 20,
        flexWrap: 'wrap',
        marginTop: 20
    };

    const getButtonLabel = (contentId) => {
        const item = progressItems[contentId];
        if (!item) return 'Start';
        if (item.completed) return 'Completed ?';
        return 'Continue';
    };

    const getButtonColor = (contentId) => {
        const item = progressItems[contentId];
        if (!item) return '#2196F3';
        if (item.completed) return '#4CAF50';
        return '#FF9800';
    };

    const renderPageCard = (contentId, title) => {
        const item = progressItems[contentId];
        const isCompleted = item && item.completed;
        const max = MAX_SCORES[contentId] || 10;
        const percent = item ? Math.round((Number(item.score || 0) / max) * 100) : 0;

        return (
            <div key={contentId} style={cardStyle} onClick={() => navigate(`/${contentId}`)}>
                <h3>{title}</h3>
                <div style={{ marginBottom: 12 }}>
                    {isCompleted && <div style={{ fontSize: 12, color: '#4CAF50', fontWeight: 'bold' }}>? Completed</div>}
                    {item && !isCompleted && <div style={{ fontSize: 12, color: '#FF9800', fontWeight: 'bold' }}>In Progress</div>}
                    {!item && <div style={{ fontSize: 12, color: '#999' }}>Not Started</div>}
                </div>
                <div style={{ fontSize: 12, marginBottom: 8 }}>Score: {item ? item.score : 0} / {max} ({percent}%)</div>
                <button
                    style={{
                        background: getButtonColor(contentId),
                        color: '#fff',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: 4,
                        cursor: 'pointer',
                        fontSize: 12,
                        fontWeight: 'bold'
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/${contentId}`);
                    }}
                >
                    {getButtonLabel(contentId)}
                </button>
            </div>
        );
    };

    return (
        <div>
            <h1>Dashboard C</h1>

            <div style={{ display: 'flex', gap: 20, alignItems: 'center', marginBottom: 20 }}>
                <div style={{ padding: 12, border: '1px solid #ddd', borderRadius: 8, minWidth: 200 }}>
                    <h3>Level & Achievements</h3>
                    <div style={{ fontSize: 24, fontWeight: 'bold', color: '#2196F3', marginBottom: 8 }}>Level {achievements.level}</div>
                    <div>Completed: {achievements.completedCount}/3</div>
                    <div style={{ marginTop: 12, textAlign: 'center' }}>
                        {['page1', 'page2', 'page3'].map(id => (
                            <span key={id} style={badgeStyle(progressItems[id]?.completed)}>
                                {progressItems[id]?.completed ? '?' : ''}
                            </span>
                        ))}
                    </div>
                </div>

                <div style={{ padding: 12, border: '1px solid #ddd', borderRadius: 8 }}>
                    <h3>Progress</h3>
                    <ul style={{ margin: 0, paddingLeft: 16 }}>
                        {['page1', 'page2', 'page3'].map(id => {
                            const item = progressItems[id];
                            const max = MAX_SCORES[id] || 10;
                            const pct = item ? Math.round((Number(item.score || 0) / max) * 100) : 0;
                            return (
                                <li key={id}>
                                    {id} - {item && item.completed ? `? Completed (score ${item.score ?? 0})` : `Not completed (${pct}%)`}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>

            <p>Choose a page:</p>
            <div style={containerStyle}>
                {renderPageCard('page1', 'Page One')}
                {renderPageCard('page2', 'Page Two')}
                {renderPageCard('page3', 'Page Three')}
            </div>
        </div>
    );
}

export default DashboardC;
