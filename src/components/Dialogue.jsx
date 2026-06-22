import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import morganaNormal from '../assets/morgana-normal.webp';
import morganaSmile from '../assets/morgana-smile.webp';
import morganaStar from '../assets/morgana-star.webp';
import morganaGrin from '../assets/morgana-grin.webp';

import playClick from '../utils/playClick.js';
import './Dialogue.css';

// ── Constants ────────────────────────────────────────────────────────────────

const QUOTES = [
    "Don't think too hard about it. You'll get the hang of it.",
    "Everyone starts off a little clumsy. Don't be sad if it doesn't go well at first, OK?",
    "If you have nothing to do, let's clean up this room. An uncluttered room is an uncluttered mind!",
];

const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

// ── Component ────────────────────────────────────────────────────────────────

const Dialogue = ({ stats, activities, onActivity, activitiesVisible, setActivitiesVisible, expUp }) => {

    const navigate = useNavigate();
    const [assist, setAssist] = useState(false);
    const [assistSuggestion, setAssistSuggestion] = useState(null);

    useEffect(() => { resetAssist(); }, []);

    // ── Helpers ──────────────────────────────────────────────────────────────

    const resetAssist = () => {
        setAssist(false);
        setAssistSuggestion(null);
    };
    const checkLowestStat = () => {
        const lowestVal = Math.min(...Object.values(stats).map(s => s.level));
        const lowestStats = Object.entries(stats)
            .filter(([, s]) => s.level === lowestVal)
            .map(([stat]) => stat);
        const lowestStat = randomItem(lowestStats);
        const matching = activities.filter(a => a.traits.includes(lowestStat));
        const suggestion = randomItem(matching);
        return { lowestStat, suggestion };
    };
    // ── Handlers ─────────────────────────────────────────────────────────────

    const handleAssist = () => {
        const { lowestStat, suggestion } = checkLowestStat();
        setAssistSuggestion({ lowestStat, suggestion });
        setAssist(true);
        playClick();
    };

    const handleEdit = () => {
        resetAssist();
        playClick();
        navigate('/edit');
    };

    const handleLog = () => {
        resetAssist();
        setActivitiesVisible(true);
        playClick();
    };

    const handleActivity = (activity) => {
        onActivity(activity);
        playClick();
    };

    // ── Derived state ────────────────────────────────────────────────────────

    const speechText = activitiesVisible
        ? "What shall we do?"
        : assist
            ? assistSuggestion?.suggestion
                ? `Your ${assistSuggestion.lowestStat} is looking low... try "${assistSuggestion.suggestion.name}"!`
                : `Your ${assistSuggestion?.lowestStat} is low, but I don't know any activities for it yet!`
            : expUp
                ? "Looks like your social stats are growing!"
                : randomItem(QUOTES);

    const morganaPic = activitiesVisible ? morganaSmile
        : assist ? morganaGrin
            : expUp ? morganaStar
                : morganaNormal;

    // ── Render ───────────────────────────────────────────────────────────────

    return (
        <div className='dialogue-container'>
            <div className='morgana-container'>
                <img src={morganaPic} alt="Morgana" />
            </div>
            <div className='speech-options-container'>
                <div className='options-container'>
                    {!activitiesVisible && <>
                        <button className='dialogue-button' onClick={handleLog}>Log Activity</button>
                        <button className='dialogue-button' onClick={handleAssist}>What should I do?</button>
                        {/* <button className='dialogue-button' onClick={handleEdit}>Edit Activities</button> */}
                    </>}
                    {activitiesVisible && activities.map((activity) => (
                        <button className='dialogue-button' key={activity.name} onClick={() => handleActivity(activity)}>
                            {activity.name}
                        </button>
                    ))}
                </div>
                <div className='speech-container'>
                    <p>{speechText}</p>
                </div>
            </div>
        </div>
    );
};

export default Dialogue;