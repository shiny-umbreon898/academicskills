/**
 * src/App.js
 * 
 * Main application component that handles:
 * - Application routing and page navigation
 * - User ID generation and persistence
 * - Dark mode toggle and preference persistence
 * - Main layout structure
 * 
 * Props: None (root component)
 * 
 * State:
 *   - page (string): Current route ('/', '/page1', '/page2', '/page3')
 *   - darkMode (boolean): Whether dark mode is active
 */

import './App.css';
import React, { useEffect, useState } from 'react';
import { getCookie, setCookie } from './utils/cookies';
import STORAGE_KEYS from './constants/storageKeys';

// Page components
import Dashboard from "./pages/Dashboard";
import Page1 from "./pages/Page1";
import Page2 from "./pages/Page2";
import Page3 from "./pages/Page3";

function App() {
    // Current page being displayed
    const [page, setPage] = useState('/');
    
    // Dark mode preference - persisted to localStorage
    const [darkMode, setDarkMode] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEYS.DARK_MODE);
            return saved ? JSON.parse(saved) : false;
        } catch {
            return false;
        }
    });

    /**
     * Initialize user ID on first visit
     * Generates a unique ID if one does not exist
     * Stores in both cookies and localStorage for compatibility
     */
    useEffect(() => {
        let uid = getCookie(STORAGE_KEYS.USER_ID);
        if (!uid) {
            // Generate unique ID: timestamp + random number
            uid = `${Date.now()}-${Math.floor(Math.random() * 1e9)}`;
            setCookie(STORAGE_KEYS.USER_ID, uid);
        }
        // Also store in localStorage for components that expect it
        if (!localStorage.getItem(STORAGE_KEYS.USER_ID_LOCAL)) {
            localStorage.setItem(STORAGE_KEYS.USER_ID_LOCAL, uid);
        }
    }, []);

    /**
     * Persist dark mode preference to localStorage
     * Called whenever darkMode state changes
     */
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEYS.DARK_MODE, JSON.stringify(darkMode));
        } catch (e) {
            // Silently ignore localStorage errors
        }
    }, [darkMode]);

    /**
     * Apply or remove dark mode CSS class on document root
     * This triggers CSS variable changes for dark styling
     */
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark-mode');
        } else {
            document.documentElement.classList.remove('dark-mode');
        }
    }, [darkMode]);

    /**
     * Navigate to a different page/route
     * @param {string} p - Route path (e.g., '/', '/page1', '/page2', '/page3')
     */
    const navigate = (p) => {
        setPage(p);
        // Scroll to top for better UX when changing pages
        window.scrollTo(0, 0);
    };

    /**
     * Toggle dark mode on/off
     */
    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    /**
     * Render the appropriate page component based on current route
     * @returns {JSX.Element} The component to display
     */
    const renderPage = () => {
        switch(page) {
            case '/page1': return <Page1 />;
            case '/page2': return <Page2 />;
            case '/page3': return <Page3 />;
            case '/':
            default:
                return <Dashboard navigate={navigate} />;
        }
    }

    return (
        <div className="App">
            <h1>Academic Skills</h1>

            {/* Navigation bar with Dashboard link and Dark Mode toggle */}
            <nav>
                <button onClick={() => navigate('/')}>Dashboard</button>
                {/* Dark mode toggle button */}
                <button
                    className="dark-mode-toggle"
                    onClick={toggleDarkMode}
                    title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    aria-label="Toggle dark mode"
                >
                    {darkMode ? 'Light Mode' : 'Dark Mode'}
                </button>
            </nav>

            {/* Main content area - displays current page */}
            <main>
                {renderPage()}
            </main>
        </div>
    );
}

export default App;
