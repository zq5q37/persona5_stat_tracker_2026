import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { CONFIDANTS } from '../confidants.js';
import playClick from '../utils/playClick.js';
import './Dialogue.css';

const INTENSITIES = [
    { label: 'Low', exp: 10 },
    { label: 'Medium', exp: 20 },
    { label: 'High', exp: 30 },
];

const DIALOGUE_STATE = {
    IDLE: 'idle',
    ASSIST: 'assist',
    LOG: 'log',
    INTENSITY: 'intensity',
};

const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const getConfidant = (key) => CONFIDANTS[key] || CONFIDANTS.morgana;

// ── Component ────────────────────────────────────────────────────────────────

const Dialogue = ({ stats, activities, onActivity, expUp, confidant = 'morgana' }) => {

    const navigate = useNavigate();
    const [dialogueState, setDialogueState] = useState(DIALOGUE_STATE.IDLE);
    const [assistSuggestion, setAssistSuggestion] = useState(null);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [idleQuote, setIdleQuote] = useState(() => randomItem(getConfidant(confidant).idleQuotes));

    const confidantData = getConfidant(confidant);
    const isNewUser = Object.values(stats ?? {}).every((stat) => {
        return stat?.level === 1 && stat?.exp === 0;
    });

    useEffect(() => {
        if (dialogueState === DIALOGUE_STATE.IDLE && !expUp) {
            setIdleQuote(randomItem(confidantData.idleQuotes));
        }
        // only re-pick when we transition INTO this idle/non-expUp state
    }, [expUp, confidantData.idleQuotes, dialogueState]);

    useEffect(() => { resetDialogue(); }, []);

    // ── Helpers ──────────────────────────────────────────────────────────────

    const resetDialogue = () => {
        setDialogueState(DIALOGUE_STATE.IDLE);
        setAssistSuggestion(null);
        setSelectedActivity(null);
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
        setDialogueState(DIALOGUE_STATE.ASSIST);
        playClick();
    };

    const handleEdit = () => {
        resetDialogue();
        playClick();
        navigate('/edit');
    };

    const handleLog = () => {
        setDialogueState(DIALOGUE_STATE.LOG);
        setAssistSuggestion(null);
        playClick();
    };

    // Step 1: pick which activity
    const handleSelectActivity = (activity) => {
        setSelectedActivity(activity);
        setDialogueState(DIALOGUE_STATE.INTENSITY);
        playClick();
    };

    // Step 2: pick intensity, then actually log it
    const handleSelectIntensity = (exp) => {
        onActivity({ ...selectedActivity, exp });
        playClick();
        resetDialogue();
    };

    // ── Derived state ────────────────────────────────────────────────────────

    const getDialogueDisplay = () => {
        const avatarSet = confidantData.images;

        if (dialogueState === DIALOGUE_STATE.IDLE && isNewUser) {
            return { text: confidantData.welcome, pic: avatarSet.idle };
        }

        switch (dialogueState) {
            case DIALOGUE_STATE.LOG:
                return { text: confidantData.logPrompt, pic: avatarSet.smile };

            case DIALOGUE_STATE.INTENSITY:
                return { text: confidantData.intensityPrompt(selectedActivity?.name), pic: avatarSet.smile };

            case DIALOGUE_STATE.ASSIST:
                return {
                    text: assistSuggestion?.suggestion
                        ? confidantData.assist.hasSuggestion.replace('{lowestStat}', assistSuggestion.lowestStat).replace('{suggestion}', assistSuggestion.suggestion.name)
                        : confidantData.assist.noSuggestion.replace('{lowestStat}', assistSuggestion?.lowestStat || 'stat'),
                    pic: avatarSet.grin,
                };

            default:
                return expUp
                    ? { text: confidantData.expUpText, pic: avatarSet.star }
                    : { text: randomItem(confidantData.idleQuotes), pic: avatarSet.idle };
        }
    };

    const { text: speechText, pic } = getDialogueDisplay();

    // ── Render ───────────────────────────────────────────────────────────────

    return (
        <div className='dialogue-container'>
            <div className='morgana-container'>
                <img src={pic} alt={`${confidantData.label} avatar`} />
            </div>
            <div className='speech-options-container'>
                <div className='options-container'>
                    {dialogueState === DIALOGUE_STATE.IDLE || dialogueState === DIALOGUE_STATE.ASSIST ? (
                        <>
                            <button className='dialogue-button' onClick={handleLog}>Log Activity</button>
                            <button className='dialogue-button' onClick={handleAssist}>What should I do?</button>
                            {/* <button className='dialogue-button' onClick={handleEdit}>Edit Activities</button> */}
                        </>
                    ) : null}

                    {dialogueState === DIALOGUE_STATE.LOG && (
                        <>
                            {activities.map((activity) => (
                                <button
                                    className='dialogue-button'
                                    key={activity.name}
                                    onClick={() => handleSelectActivity(activity)}
                                >
                                    {activity.name}
                                </button>
                            ))}
                            <button className='dialogue-button' onClick={resetDialogue}>Nevermind.</button>
                        </>
                    )}

                    {dialogueState === DIALOGUE_STATE.INTENSITY && INTENSITIES.map(({ label, exp }) => (
                        <button
                            className='dialogue-button'
                            key={label}
                            onClick={() => handleSelectIntensity(exp)}
                        >
                            {label}
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