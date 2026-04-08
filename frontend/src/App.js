// default React app component from create-react-app
import logo from './logo.svg';
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

    // function to navigate between pages
    const navigate = (p) => {
        setPage(p);
        window.scrollTo(0,0);
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
            </nav>

            <main>
                {renderPage()}
            </main>
        </div>
    );
}

export default App;
