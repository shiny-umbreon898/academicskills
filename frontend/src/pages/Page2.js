import React, { useState, useEffect, useRef } from 'react';
import { getCookie, setCookie } from '../utils/cookies';
import H5P_CONFIG from './h5pConfig';
import ScoreControls from '../components/ScoreControls';
import Confetti from '../components/Confetti';

// 6 Essential Grammar Tips with quiz questions at specific timestamps

// timestamps
// 3:27 - 1: Long Sentences
// 4:42 - 2: Paragraphs
// 6:22 - 3: Subject-Verb Placement
// 8:03 - 4: Prepositions
// 9:02 - 5: Conjunctions
// 11:18 - 6: Verb Tenses

const GRAMMAR_TIPS = [
    {
        id: 'tip1',
        title: 'Long Sentences',
        // 3:27 -> 207s
        time: 207,
        quiz: {
            question: 'Why should very long sentences be avoided in academic writing?',
            options: [
                'They always use the wrong tense',
                'They can make the meaning hard to follow',
                'They contain too many verbs',
                'They are too formal'
            ],
            correctAnswer: 1
        },
        feedback: 'Long sentences can be difficult for readers to follow and may obscure the main point. Aim for clarity by breaking complex ideas into shorter sentences.'
    },
    {
        id: 'tip2',
        title: 'Paragraphs',
        // 4:42 -> 282s
        time: 282,
        quiz: {
            question: 'What is the main purpose of a paragraph in academic writing?',
            options: [
                'To include as many ideas as possible',
                'To reduce the word count',
                'To focus and develop one topic',
                'To separate references'
            ],
            correctAnswer: 2
        },
        feedback: 'A paragraph should focus on developing one main idea or topic. Avoid including multiple unrelated ideas in the same paragraph.'
    },
    {
        id: 'tip3',
        title: 'Subject-Verb Placement',
        // 6:22 -> 382s
        time: 382,
        quiz: {
            question: 'Why should the subject and verb be placed close together?',
            options: [
                'To make the sentence shorter',
                'To improve punctuation', 
                'To enhance clarity and readability', 
                'To make it sound more formal'
            ],
            correctAnswer: 2
        },
        feedback: 'Keeping the subject and verb close together helps improve clarity and readability. When they are separated by long phrases or clauses, it can make the sentence harder to understand.'
    },
    {
        id: 'tip4',
        title: 'Prepositions',
        // 8:03 -> 483s
        time: 483,
        quiz: {
            question: 'Which sentence follows the rule about prepositions in academic writing?',
            options: [
                'What topic did the lecture focus on?',
                'On what topic did the lecture focus?',
                'The lecture focused on what topic?',
                'What topic the lecture focused on?'
            ],
            correctAnswer: 1
        },
        feedback: 'In formal academic writing, avoid leaving prepositions hanging at the end of sentences. Place the preposition before its object.'
    },
    {
        id: 'tip5',
        title: 'Conjunctions',
        // 9:02 -> 542s
        time: 542,
        quiz: {
            question: 'Why are conjunctions useful in academic writing?',
            options: [
                'They replace punctuation',
                'They connect ideas and improve flow',
                'They shorten every sentence',
                'They remove verbs'
            ],
            correctAnswer: 1
        },
        feedback: 'Conjunctions like "however", "therefore", and "moreover" help connect ideas and improve flow.'
    },
    {
        id: 'tip6',
        title: 'Verb Tenses',
        // 11:18 -> 678s
        time: 678,
        quiz: {
            question: 'Which tense is most commonly used in academic writing?',
            options: [
                'Present continuous',
                'Past tense',
                'Future tense',
                'Simple present tense'
            ],
            correctAnswer: 3
        },
        feedback: 'Simple present tense is commonly used in academic writing for general statements and findings.'
    }
];

// Page 2 Component: Interactive Video with Question Overlays
export default function Page2() {
    const cfg = H5P_CONFIG['page2'] || {};
    const videoRef = useRef(null);
    const timelineRef = useRef(null);
    
    const [score, setScore] = useState(0);
    const [completed, setCompleted] = useState(false);
    const [message, setMessage] = useState('');
    const [quizAnswers, setQuizAnswers] = useState({});
    const [showFeedback, setShowFeedback] = useState({});
    const [transcript, setTranscript] = useState('');
    const [showTranscript, setShowTranscript] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [activeQuestion, setActiveQuestion] = useState(null);

    const maxScore = cfg.maxScore || 6;

    // Load existing progress on mount
    useEffect(() => {
        const progress = getCookie('progress') || {};
        const data = progress['page2'];
        if (data) {
            setCompleted(!!data.completed);
            setScore(Number(data.score) || 0);
            if (data.quizAnswers) {
                setQuizAnswers(data.quizAnswers);
                const feedback = {};
                Object.keys(data.quizAnswers).forEach(tipId => {
                    feedback[tipId] = true;
                });
                setShowFeedback(feedback);
            }
        }

        // load transcript if available in config
        if (cfg.transcript) {
            fetch(cfg.transcript)
                .then(res => res.text())
                .then(txt => setTranscript(txt))
                .catch(() => setTranscript(''));
        }
    }, []);

    // Update duration when metadata loaded
    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration || 0);
        }
    };

    // Check for question at current time
    useEffect(() => {
        const questionTip = GRAMMAR_TIPS.find(tip => 
            Math.abs(tip.time - currentTime) < 0.6 && !showFeedback[tip.id]
        );
        
        if (questionTip && isPlaying) {
            setActiveQuestion(questionTip.id);
            if (videoRef.current) {
                videoRef.current.pause();
                setIsPlaying(false);
            }
        }
    }, [currentTime, isPlaying, showFeedback]);

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
        }
    };

    const handlePlay = () => {
        setIsPlaying(true);
    };

    const handlePause = () => {
        setIsPlaying(false);
    };

    // Seek by clicking timeline
    const handleTimelineClick = (e) => {
        if (!timelineRef.current || !videoRef.current || !duration) return;
        const rect = timelineRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const pct = Math.max(0, Math.min(1, x / rect.width));
        const time = pct * duration;
        videoRef.current.currentTime = time;
        setCurrentTime(time);
    };

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
    // answers param (optional) allows caller to provide the latest answers object
    const saveProgress = (complete = false, newScore = null, answers = null) => {
        const progress = getCookie('progress') || {};
        const existing = progress['page2'] || {};

        // Use provided answers or current state
        const answersToPersist = answers || quizAnswers;

        let s = newScore !== null ? Number(newScore) : Number(score || 0);
        if (Number.isNaN(s)) s = 0;
        if (s < 0) s = 0;
        if (s > maxScore) s = maxScore;

        progress['page2'] = {
            ...existing,
            completed: !!complete || existing.completed || false,
            score: s,
            timestamp: Date.now(),
            quizAnswers: answersToPersist,
            awardedExp: existing.awardedExp || 0
        };

        if (complete && !existing.completed) {
            const awardAmount = maxScore;
            awardExperienceIfNeeded(progress, awardAmount);
            setCompleted(true);
            setMessage('All grammar tips completed!');
            // if full score when marking complete, fire confetti
            if (s === maxScore) {
                const rect = videoRef.current ? videoRef.current.getBoundingClientRect() : null;
                const x = rect ? rect.left + rect.width / 2 : undefined;
                const y = rect ? rect.top + rect.height / 3 : undefined;
                window.dispatchEvent(new CustomEvent('fireConfetti', { detail: { x, y, count: 160 } }));
            }
        } else {
            persistProgress(progress);
            setCompleted(progress['page2'].completed);
            setMessage('Progress saved');
        }

        setScore(s);
    };

    // Handle quiz answer selection
    const handleAnswerClick = (tipId, selectedIndex) => {
        const tipIndex = GRAMMAR_TIPS.findIndex(t => t.id === tipId);
        const tip = GRAMMAR_TIPS[tipIndex];
        const isCorrect = selectedIndex === tip.quiz.correctAnswer;

        // Update quiz answers
        const updatedAnswers = { ...quizAnswers, [tipId]: selectedIndex };
        setQuizAnswers(updatedAnswers);

        // Show feedback
        setShowFeedback({ ...showFeedback, [tipId]: true });

        // Calculate and update score (persist in all cases to avoid losing last answer)
        const newScore = Math.min(maxScore, Object.keys(updatedAnswers).filter(key => {
            const idx = GRAMMAR_TIPS.findIndex(t => t.id === key);
            return updatedAnswers[key] === GRAMMAR_TIPS[idx].quiz.correctAnswer;
        }).length);
        setScore(newScore);
        // persist interim progress using updatedAnswers to avoid race conditions
        saveProgress(false, newScore, updatedAnswers);

        // fire confetti only when answer is correct
        if (isCorrect) {
            const rect = videoRef.current ? videoRef.current.getBoundingClientRect() : null;
            const x = rect ? rect.left + rect.width / 2 : undefined;
            const y = rect ? rect.top + rect.height / 3 : undefined;
            window.dispatchEvent(new CustomEvent('fireConfetti', { detail: { x, y, count: 80 } }));
        }

        // Auto-complete if all tips answered
        if (Object.keys(updatedAnswers).length === GRAMMAR_TIPS.length) {
            setTimeout(() => {
                // Calculate final score from all answers
                const finalScore = Math.min(maxScore, Object.keys(updatedAnswers).filter(key => {
                    const idx = GRAMMAR_TIPS.findIndex(t => t.id === key);
                    return updatedAnswers[key] === GRAMMAR_TIPS[idx].quiz.correctAnswer;
                }).length);
                // persist complete progress and answers
                saveProgress(true, finalScore, updatedAnswers);
            }, 500);
        }
    };

    const continueVideo = () => {
        setActiveQuestion(null);
        if (videoRef.current) {
            videoRef.current.play();
            setIsPlaying(true);
        }
    };

    // when video ends, if user has full score fire confetti
    const handleVideoEnded = () => {
        if (score === maxScore) {
            const rect = videoRef.current ? videoRef.current.getBoundingClientRect() : null;
            const x = rect ? rect.left + rect.width / 2 : undefined;
            const y = rect ? rect.top + rect.height / 3 : undefined;
            window.dispatchEvent(new CustomEvent('fireConfetti', { detail: { x, y, count: 200 } }));
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

    const activeTip = GRAMMAR_TIPS.find(t => t.id === activeQuestion);

    return (
        <div>
            <Confetti />
            <h1>{cfg.title || '6 Essential Grammar Tips'}</h1>

            {/* Video Player Container */}
            <div style={{ maxWidth: 900, background: '#fff', padding: 16, borderRadius: 8, marginBottom: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', position: 'relative' }}>
                <video 
                    ref={videoRef}
                    width="100%" 
                    height="auto" 
                    controls 
                    style={{ borderRadius: 4, backgroundColor: '#000', display: activeQuestion ? 'none' : 'block' }}
                    onTimeUpdate={handleTimeUpdate}
                    onPlay={handlePlay}
                    onPause={handlePause}
                    onLoadedMetadata={handleLoadedMetadata}
                    onEnded={handleVideoEnded}
                >
                    <source src={cfg.url || '/resources/tutorials/six_grammar_tips.mp4'} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>

                {/* Custom timeline with markers */}
                <div ref={timelineRef} onClick={handleTimelineClick} style={{ marginTop: 12, height: 14, background: '#eee', borderRadius: 7, cursor: 'pointer', position: 'relative' }}>
                    {/* progress fill */}
                    <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: duration ? `${Math.max(0, Math.min(100, (currentTime / duration) * 100))}%` : '0%', background: '#2196F3', borderRadius: 7 }} />
                    {/* markers */}
                    {duration > 0 && GRAMMAR_TIPS.map(tip => {
                        const pct = Math.max(0, Math.min(100, (tip.time / duration) * 100));
                        const answered = !!showFeedback[tip.id];
                        return (
                            <div key={tip.id} title={`${tip.title} - ${Math.floor(tip.time/60)}:${String(tip.time%60).padStart(2,'0')}`} style={{ position: 'absolute', left: `calc(${pct}% - 6px)`, top: -6, width: 12, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ width: 6, height: 6, borderRadius: 3, background: answered ? '#4CAF50' : '#FFF', border: `2px solid ${answered ? '#4CAF50' : '#2196F3'}` }} />
                            </div>
                        );
                    })}
                </div>

                {/* Question Overlay */}
                {activeQuestion && activeTip && (
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0, 0, 0, 0.85)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10,
                        borderRadius: 4,
                        padding: 16
                    }}>
                        <div style={{
                            background: '#fff',
                            borderRadius: 8,
                            padding: 32,
                            maxWidth: 600,
                            boxShadow: '0 4px 16px rgba(0,0,0,0.3)'
                        }}>
                            <h2 style={{ color: '#333', marginBottom: 20, fontSize: 20 }}>
                                {activeTip.title}
                            </h2>
                            
                            <p style={{ color: '#555', marginBottom: 24, fontSize: 16, lineHeight: 1.5 }}>
                                {activeTip.quiz.question}
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                                {activeTip.quiz.options.map((option, optionIndex) => {
                                    const isSelected = quizAnswers[activeTip.id] === optionIndex;
                                    const isCorrect = optionIndex === activeTip.quiz.correctAnswer;
                                    const answered = showFeedback[activeTip.id];

                                    return (
                                        <button
                                            key={optionIndex}
                                            onClick={() => handleAnswerClick(activeTip.id, optionIndex)}
                                            disabled={answered}
                                            style={{
                                                padding: 14,
                                                background: answered
                                                    ? isCorrect
                                                        ? '#4CAF50'
                                                        : isSelected
                                                        ? '#FF9800'
                                                        : '#f0f0f0'
                                                    : '#f0f0f0',
                                                color: answered && (isCorrect || isSelected) ? '#fff' : '#333',
                                                border: answered && isCorrect ? '2px solid #2e7d32' : '1px solid #ddd',
                                                borderRadius: 6,
                                                cursor: answered ? 'default' : 'pointer',
                                                fontSize: 14,
                                                fontWeight: 500,
                                                transition: 'all 0.3s ease',
                                                textAlign: 'left'
                                            }}
                                        >
                                            {option}
                                        </button>
                                    );
                                })}
                            </div>

                            {showFeedback[activeTip.id] && (
                                <div>
                                    <div style={{
                                        padding: 12,
                                        background: quizAnswers[activeTip.id] === activeTip.quiz.correctAnswer ? '#e8f5e9' : '#fff3e0',
                                        color: quizAnswers[activeTip.id] === activeTip.quiz.correctAnswer ? '#2e7d32' : '#e65100',
                                        borderRadius: 6,
                                        marginBottom: 16,
                                        fontSize: 14,
                                        lineHeight: 1.5
                                    }}>
                                        {quizAnswers[activeTip.id] === activeTip.quiz.correctAnswer ? 'Correct!' : 'Incorrect. The correct answer is shown above.'}
                                    </div>
                                    
                                    {activeTip.feedback && (
                                        <div style={{
                                            padding: 12,
                                            background: '#f5f5f5',
                                            borderLeft: '4px solid #2196F3',
                                            borderRadius: 4,
                                            marginBottom: 16,
                                            fontSize: 13,
                                            color: '#555',
                                            lineHeight: 1.6
                                        }}>
                                            <strong>Explanation:</strong> {activeTip.feedback}
                                        </div>
                                    )}

                                    <button
                                        onClick={continueVideo}
                                        style={{
                                            padding: '12px 24px',
                                            background: '#2196F3',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: 6,
                                            cursor: 'pointer',
                                            fontSize: 14,
                                            fontWeight: 600,
                                            width: '100%'
                                        }}
                                    >
                                        Continue Video
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Transcript */}
            {transcript && (
                <div style={{ marginTop: 12 }}>
                    <button onClick={() => setShowTranscript(!showTranscript)} style={{ marginBottom: 8 }}>
                        {showTranscript ? 'Hide transcript' : 'Show transcript'}
                    </button>
                    {showTranscript && (
                        <pre style={{ whiteSpace: 'pre-wrap', maxHeight: 320, overflow: 'auto', background: '#f7f7f7', padding: 12, borderRadius: 6 }}>
                            {transcript}
                        </pre>
                    )}
                </div>
            )}

            {/* Progress Overview */}
            <div style={{ maxWidth: 900, background: '#fff', padding: 16, borderRadius: 8, marginBottom: 20, marginTop: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <div style={{ background: '#f0f0f0', padding: 12, borderRadius: 4, marginBottom: 12 }}>
                    <strong>Progress:</strong> {Object.keys(showFeedback).length} / {GRAMMAR_TIPS.length} questions answered
                </div>
                
                {/* Question Markers */}
                <div style={{ marginTop: 16 }}>
                    <strong style={{ display: 'block', marginBottom: 8 }}>Questions in Video:</strong>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 8 }}>
                        {GRAMMAR_TIPS.map(tip => (
                            <div key={tip.id} style={{
                                padding: 8,
                                background: showFeedback[tip.id] ? '#4CAF50' : '#f0f0f0',
                                color: showFeedback[tip.id] ? '#fff' : '#333',
                                borderRadius: 4,
                                fontSize: 12,
                                textAlign: 'center',
                                fontWeight: 500
                            }}>
                                {tip.title}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Control Buttons */}
            <div style={{ marginTop: 24, padding: 16, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <ScoreControls score={score} setScore={setScore} maxScore={maxScore} onSave={saveProgress} onReset={reset} completed={completed} message={message} />
            </div>

            {/* Status */}
            <div style={{ marginTop: 16, padding: 12, background: '#f9f9f9', borderRadius: 4, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <strong>Status:</strong> {completed ? 'Completed' : 'In Progress'}
                {message && <div style={{ color: message.toLowerCase().includes('completed') ? '#4CAF50' : '#333', fontWeight: 600, marginTop: 8 }}>{message}</div>}
            </div>
        </div>
    );
}
