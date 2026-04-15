// default React app component from create-react-app
import './App.css';
import React, { useEffect, useState } from 'react';

// cookie helpers
import { getCookie, setCookie } from './utils/cookies';

// Page Components
import Dashboard from "./pages/Dashboard";
import Page1 from "./pages/Page1";
import Page2 from "./pages/Page2";
import Page3 from "./pages/Page3";

function App() {
    const [page, setPage] = useState('/');
    // dark mode state: persisted in localStorage
    const [darkMode, setDarkMode] = useState(() => {
        try {
            const saved = localStorage.getItem('darkMode');
            return saved ? JSON.parse(saved) : false;
        } catch {
            return false;
        }
    });

    // ensure persistent user id cookie/localStorage exists — app no longer requires login
    useEffect(() => {
        let uid = getCookie('user_id');
        if (!uid) {
            uid = `${Date.now()}-${Math.floor(Math.random() * 1e9)}`;
            setCookie('user_id', uid);
        }
        // store in localStorage for compatibility with components that expect user_id
        if (!localStorage.getItem('user_id')) {
            localStorage.setItem('user_id', uid);
        }
    }, []);

    // persist darkMode preference to localStorage
    useEffect(() => {
        try {
            localStorage.setItem('darkMode', JSON.stringify(darkMode));
        } catch (e) {
            // ignore storage errors
        }
    }, [darkMode]);

    // Apply dark mode class to document root
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark-mode');
        } else {
            document.documentElement.classList.remove('dark-mode');
        }
    }, [darkMode]);

    // function to navigate between pages
    const navigate = (p) => {
        setPage(p);
        window.scrollTo(0,0);
    };

    // toggle dark mode
    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    // render the correct page component based on the current page
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

            <main>
                {renderPage()}
            </main>
        </div>
    );
}

export default App;
