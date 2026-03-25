import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import { getCookie } from '../utils/cookies';

function DashboardB({ navigate }) {
    const [achievements, setAchievements] = useState({ completedCount: 0, level: 1 });
    const [progressItems, setProgressItems] = useState({});

    useEffect(() => {
        const a = getCookie('achievements') || { completedCount: 0, level: 1 };
        setAchievements(a);
        const p = getCookie('progress') || {};
        setProgressItems(p);
    }, []);

    const cardStyle = {
        border: '1px solid #ccc',
        borderRadius: 8,
        padding: 20,
        margin: 10,
        width: 220,
        textAlign: 'center',
        cursor: 'pointer',
        background: '#fafafa'
    };

    const containerStyle = {
        display: 'flex',
        gap: 20,
        flexWrap: 'wrap',
        marginTop: 20
    };

    return (
        <div>
            <h1>Dashboard B</h1>

            <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                <div style={{ padding: 12, border: '1px solid #ddd', borderRadius: 8, minWidth: 180 }}>
                    <h3>Achievements</h3>
                    <div>Completed: {achievements.completedCount}</div>
                    <div>Level: {achievements.level}</div>
                </div>

                <div style={{ padding: 12, border: '1px solid #ddd', borderRadius: 8 }}>
                    <h3>Progress</h3>
                    <ul style={{ margin: 0, paddingLeft: 16 }}>
                        {['page1', 'page2', 'page3'].map(id => {
                            const item = progressItems[id];
                            return (
                                <li key={id}>
                                    {id} - {item && item.completed ? `Completed (score ${item.score ?? 0})` : 'Not completed'}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>

            <p>Choose a page:</p>
            <div style={containerStyle}>
                <div style={cardStyle} onClick={() => navigate('/page1')}>
                    <h3>Page One</h3>
                    <p>Blank page 1</p>
                </div>

                <div style={cardStyle} onClick={() => navigate('/page2')}>
                    <h3>Page Two</h3>
                    <p>Blank page 2</p>
                </div>

                <div style={cardStyle} onClick={() => navigate('/page3')}>
                    <h3>Page Three</h3>
                    <p>Blank page 3</p>
                </div>
            </div>
        </div>
    );
}

export default DashboardB;
