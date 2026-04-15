import React, { useState, useEffect } from 'react';
import { getCookie, setCookie } from '../utils/cookies';
import Page from './Page';

// 6 Essential Grammar Tips with quiz questions for each segment
const GRAMMAR_TIPS = [
    {
        id: 'tip1',
        title: 'Subject-Verb Agreement',
        description: 'The subject and verb must agree in number (singular or plural)',
        example: 'Correct: "The team is playing well." / Incorrect: "The team are playing well."',
        quiz: {
            question: 'Which sentence is grammatically correct?',
            options: [
                'The cats is sleeping',
                'The cats are sleeping',
                'The cat are sleeping',
                'Cats is sleeping'
            ],
            correctAnswer: 1
        }
    },
    {
        id: 'tip2',
        title: 'Comma Usage',
        description: 'Commas separate independent clauses, separate items in a list, and set off introductory phrases',
        example: 'Correct: "I need milk, bread, and eggs." / Incorrect: "I need milk bread and eggs"',
        quiz: {
            question: 'Where should the comma be placed?',
            options: [
                'When you wake up take a shower',
                'When you wake, up take a shower',
                'When you wake up, take a shower',
                'When, you wake up take a shower'
            ],
            correctAnswer: 2
        }
    },
    {
        id: 'tip3',
        title: 'Pronoun Reference',
        description: 'A pronoun must clearly refer to a single antecedent',
        example: 'Correct: "Mary told Sue that she was late." / Unclear: "Mary and Sue talked, then she left."',
        quiz: {
            question: 'Which sentence has a clear pronoun reference?',
            options: [
                'John told Mike he was wrong',
                'When John arrived, Mike said he was ready',
                'John and Mike left early because they had an appointment',
                'The car and the truck passed by, and it was fast'
            ],
            correctAnswer: 2
        }
    },
    {
        id: 'tip4',
        title: 'Verb Tense Consistency',
        description: 'Maintain the same verb tense throughout a passage unless there is a logical reason to change',
        example: 'Correct: "She walked home and made dinner." / Incorrect: "She walks home and made dinner."',
        quiz: {
            question: 'Which sentence maintains consistent verb tense?',
            options: [
                'She was studying hard and passes her exam',
                'She studied hard and passes her exam',
                'She studied hard and passed her exam',
                'She is studying hard and passed her exam'
            ],
            correctAnswer: 2
        }
    },
    {
        id: 'tip5',
        title: 'Parallel Structure',
        description: 'Elements in a list should be in the same grammatical form',
        example: 'Correct: "I like reading, writing, and painting." / Incorrect: "I like reading, to write, and painting."',
        quiz: {
            question: 'Which sentence uses parallel structure correctly?',
            options: [
                'She enjoys singing, dancing, and to act',
                'She enjoys to sing, to dance, and acting',
                'She enjoys singing, dancing, and acting',
                'She enjoys to sing, dancing, and to act'
            ],
            correctAnswer: 2
        }
    },
    {
        id: 'tip6',
        title: 'Commonly Confused Words',
        description: 'Learn to distinguish between similar words like their/there/they\'re, your/you\'re, and its/it\'s',
        example: 'Correct: "Their car is over there." / Incorrect: "There car is over their."',
        quiz: {
            question: 'Which sentence uses the correct word?',
            options: [
                'Your going to love there new house',
                'You\'re going to love their new house',
                'Your going to love their new house',
                'You\'re going to love there new house'
            ],
            correctAnswer: 1
        }
    }
];

// Page 2 Component: Interactive Grammar Tips with Video and Quizzes
export default function Page2() {
    const [score, setScore] = useState(0);
    const [completed, setCompleted] = useState(false);
    const [message, setMessage] = useState('');
    const [quizAnswers, setQuizAnswers] = useState({});
    const [showFeedback, setShowFeedback] = useState({});

    const maxScore = 5; // Max score for Page 2

    // Load existing progress on mount
    useEffect(() => {
        const progress = getCookie('progress') || {};
        const data = progress['page2'];
        if (data) {
            setCompleted(!!data.completed);
            setScore(Number(data.score) || 0);
            // Restore quiz answers if available
            if (data.quizAnswers) {
                setQuizAnswers(data.quizAnswers);
                // Re-populate feedback for answered questions
                const feedback = {};
                Object.keys(data.quizAnswers).forEach(tipId => {
                    feedback[tipId] = true;
                });
                setShowFeedback(feedback);
            }
        }
    }, []);

    // Helper: persist progress object back to cookies
    const persistProgress = (progress) => {
        setCookie('progress', progress);
        try {
            localStorage.setItem('progress_updated_at', String(Date.now()));
            window.dispatchEvent(new Event('progress_updated'));
        } catch (e) {
            // ignore storage errors
        }
    };

    // Award experience for completion once
    const awardExperienceIfNeeded = (progress, awardAmount) => {
        if (!progress) return;
        const existing = progress['page2'] || {};
        const alreadyAwarded = Number(existing.awardedExp || 0);
        const toAward = Math.max(0, Number(awardAmount || 0) - alreadyAwarded);
        if (toAward <= 0) return;

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

        progress['page2'] = { ...existing, awardedExp: (Number(existing.awardedExp || 0) + toAward) };
        persistProgress(progress);
    };

    // Save progress and calculate score based on quiz answers
    const saveProgress = (complete = false, newScore = null) => {
        const progress = getCookie('progress') || {};
        const existing = progress['page2'] || {};

        let s = newScore !== null ? Number(newScore) : Number(score || 0);
        if (Number.isNaN(s)) s = 0;
        if (s < 0) s = 0;
        if (s > maxScore) s = maxScore;

        progress['page2'] = {
            ...existing,
            completed: !!complete || existing.completed || false,
            score: s,
            timestamp: Date.now(),
            quizAnswers: quizAnswers,
            awardedExp: existing.awardedExp || 0
        };

        if (complete && !existing.completed) {
            const awardAmount = maxScore;
            awardExperienceIfNeeded(progress, awardAmount);
            setCompleted(true);
            setMessage('? All grammar tips completed!');
        } else {
            persistProgress(progress);
            setCompleted(progress['page2'].completed);
            setMessage('Progress saved');
        }

        setScore(s);
    };

    // Handle quiz answer selection
    const handleAnswerClick = (tipId, selectedIndex) => {
        if (showFeedback[tipId]) return; // Already answered

        const tipIndex = GRAMMAR_TIPS.findIndex(t => t.id === tipId);
        const tip = GRAMMAR_TIPS[tipIndex];
        const isCorrect = selectedIndex === tip.quiz.correctAnswer;

        // Update quiz answers
        const updatedAnswers = { ...quizAnswers, [tipId]: selectedIndex };
        setQuizAnswers(updatedAnswers);

        // Show feedback
        setShowFeedback({ ...showFeedback, [tipId]: true });

        // Calculate and update score
        if (isCorrect) {
            const newScore = Math.min(maxScore, Object.keys(updatedAnswers).filter(key => {
                const idx = GRAMMAR_TIPS.findIndex(t => t.id === key);
                return updatedAnswers[key] === GRAMMAR_TIPS[idx].quiz.correctAnswer;
            }).length);
            setScore(newScore);
            saveProgress(false, newScore);
        }

        // Auto-complete if all tips answered
        if (Object.keys(updatedAnswers).length === GRAMMAR_TIPS.length) {
            setTimeout(() => {
                saveProgress(true);
            }, 500);
        }
    };

    // Reset progress
    const reset = () => {
        const progress = getCookie('progress') || {};
        const existing = progress['page2'] || {};

        if (existing.completed && existing.awardedExp) {
            const achievements = getCookie('achievements') || { completedCount: 0, level: 1, totalExp: 0 };
            const newTotalExp = Math.max(0, Number(achievements.totalExp || 0) - Number(existing.awardedExp || 0));
            const newCompletedCount = Math.max(0, Number(achievements.completedCount || 0) - 1);
            const newLevel = Math.floor(newCompletedCount / 3) + 1;
            const newAchievements = { completedCount: newCompletedCount, level: newLevel, totalExp: newTotalExp };
            setCookie('achievements', newAchievements);
        }

        delete progress['page2'];
        persistProgress(progress);

        setCompleted(false);
        setScore(0);
        setMessage('Progress reset');
        setQuizAnswers({});
        setShowFeedback({});
    };

    return (
        <div>
            <h1>6 Essential Grammar Tips</h1>

            {/* Video Player */}
            <div style={{ maxWidth: 900, background: '#fff', padding: 16, borderRadius: 8, marginBottom: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <video 
                    width="100%" 
                    height="auto" 
                    controls 
                    style={{ borderRadius: 4, backgroundColor: '#000' }}
                >
                    <source src="/resources/tutorials/six_grammar_tips.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>

            {/* Grammar Tips Introduction */}
            <div style={{ maxWidth: 900, background: '#fff', padding: 16, borderRadius: 8, marginBottom: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <p style={{ fontSize: 16, marginBottom: 12, color: '#666' }}>
                    Watch the video above, then answer the quiz questions for each grammar tip to test your understanding.
                </p>
                <div style={{ background: '#f0f0f0', padding: 12, borderRadius: 4, marginBottom: 12 }}>
                    <strong>Progress:</strong> {Object.keys(quizAnswers).length} / {GRAMMAR_TIPS.length} tips completed
                </div>
            </div>

            {/* Grammar Tips Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 24 }}>
                {GRAMMAR_TIPS.map((tip) => {
                    const isAnswered = !!quizAnswers[tip.id];
                    const isCorrect = isAnswered && quizAnswers[tip.id] === tip.quiz.correctAnswer;

                    return (
                        <div
                            key={tip.id}
                            style={{
                                background: '#fff',
                                border: isCorrect ? '2px solid #4CAF50' : isAnswered ? '2px solid #FF9800' : '1px solid #ddd',
                                borderRadius: 8,
                                padding: 16,
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {/* Tip Header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                <h3 style={{ color: '#333', fontSize: 16, margin: 0 }}>{tip.title}</h3>
                                {isAnswered && (
                                    <span style={{ fontSize: 20, color: isCorrect ? '#4CAF50' : '#FF9800' }}>
                                        {isCorrect ? '?' : '?'}
                                    </span>
                                )}
                            </div>

                            {/* Tip Description */}
                            <p style={{ fontSize: 13, color: '#666', marginBottom: 8 }}>{tip.description}</p>

                            {/* Example */}
                            <div style={{ background: '#f9f9f9', padding: 8, borderRadius: 4, marginBottom: 12, fontSize: 12, color: '#555' }}>
                                <strong>Example:</strong> {tip.example}
                            </div>

                            {/* Quiz Question */}
                            <div style={{ marginBottom: 12 }}>
                                <strong style={{ display: 'block', marginBottom: 8, color: '#333' }}>
                                    {tip.quiz.question}
                                </strong>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                    {tip.quiz.options.map((option, optionIndex) => (
                                        <button
                                            key={optionIndex}
                                            onClick={() => handleAnswerClick(tip.id, optionIndex)}
                                            disabled={isAnswered}
                                            style={{
                                                padding: 10,
                                                background: isAnswered
                                                    ? optionIndex === tip.quiz.correctAnswer
                                                        ? '#4CAF50'
                                                        : optionIndex === quizAnswers[tip.id]
                                                        ? '#FF9800'
                                                        : '#f0f0f0'
                                                    : '#f0f0f0',
                                                color: isAnswered && (optionIndex === tip.quiz.correctAnswer || optionIndex === quizAnswers[tip.id]) ? '#fff' : '#333',
                                                border: '1px solid #ddd',
                                                borderRadius: 4,
                                                cursor: isAnswered ? 'default' : 'pointer',
                                                fontSize: 12,
                                                transition: 'all 0.3s ease',
                                                opacity: isAnswered ? 1 : 0.8
                                            }}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Feedback */}
                            {showFeedback[tip.id] && (
                                <div style={{
                                    padding: 8,
                                    background: isCorrect ? '#e8f5e9' : '#fff3e0',
                                    color: isCorrect ? '#2e7d32' : '#e65100',
                                    borderRadius: 4,
                                    fontSize: 12
                                }}>
                                    {isCorrect ? '? Correct!' : '? Incorrect. The correct answer is highlighted.'}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Control Buttons */}
            <div style={{ marginTop: 24, padding: 16, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <button
                    onClick={() => saveProgress(false)}
                    style={{
                        background: '#dc143c',
                        color: '#fff',
                        border: 'none',
                        padding: '10px 16px',
                        borderRadius: 4,
                        cursor: 'pointer',
                        marginRight: 8,
                        fontWeight: 600
                    }}
                >
                    Save Progress
                </button>
                <button
                    onClick={() => saveProgress(true)}
                    disabled={Object.keys(quizAnswers).length < GRAMMAR_TIPS.length}
                    style={{
                        background: Object.keys(quizAnswers).length === GRAMMAR_TIPS.length ? '#4CAF50' : '#ccc',
                        color: '#fff',
                        border: 'none',
                        padding: '10px 16px',
                        borderRadius: 4,
                        cursor: Object.keys(quizAnswers).length === GRAMMAR_TIPS.length ? 'pointer' : 'not-allowed',
                        marginRight: 8,
                        fontWeight: 600
                    }}
                >
                    Mark Complete
                </button>
                <button
                    onClick={reset}
                    style={{
                        background: '#999',
                        color: '#fff',
                        border: 'none',
                        padding: '10px 16px',
                        borderRadius: 4,
                        cursor: 'pointer',
                        fontWeight: 600
                    }}
                >
                    Reset
                </button>
            </div>

            {/* Status */}
            <div style={{ marginTop: 16, padding: 12, background: '#f9f9f9', borderRadius: 4, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <strong>Status:</strong> {completed ? '? Completed' : 'In Progress'}
                {message && <div style={{ color: message.includes('?') ? '#4CAF50' : '#333', fontWeight: 600, marginTop: 8 }}>{message}</div>}
            </div>
        </div>
    );
}
