import React from 'react';
import './Dashboard.css';

function DashboardC({ navigate }) {
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
            <h1>Dashboard C</h1>
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

export default DashboardC;
