import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import morganaNormal from '../assets/characters/morgana/morgana-normal.webp';
import morganaSmile from '../assets/characters/morgana/morgana-smile.webp';
import morganaStar from '../assets/characters/morgana/morgana-star.webp';
import morganaGrin from '../assets/characters/morgana/morgana-grin.webp';
import futabaAvatar from '../assets/characters/futaba/futaba_normal.png';
import makotoAvatar from '../assets/characters/makoto/makoto_normal.png';

import playClick from '../utils/playClick.js';
import './Dialogue.css';

// ── Constants ────────────────────────────────────────────────────────────────

const QUOTES = [
    "Don't think too hard about it. You'll get the hang of it.",
    "Everyone starts off a little clumsy. Don't be sad if it doesn't go well at first, OK?",
    "If you have nothing to do, let's clean up this room. An uncluttered room is an uncluttered mind!",
];

const WELCOME_MSG = "Welcome to Persona 5 Stat Tracker! Turn real-life habits into a game: log an activity, watch your stats grow, and use \"Edit\" to tailor activities to your lifestyle."

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

const CONFIDANT_IMAGES = {
    morgana: {
        idle: morganaNormal,
        smile: morganaSmile,
        star: morganaStar,
        grin: morganaGrin,
    },
    futaba: {
        idle: futabaAvatar,
        smile: futabaAvatar,
        star: futabaAvatar,
        grin: futabaAvatar,
    },
    makoto: {
        idle: makotoAvatar,
        smile: makotoAvatar,
        star: makotoAvatar,
        grin: makotoAvatar,
    },
};

// ── Component ────────────────────────────────────────────────────────────────

const Dialogue = ({ stats, activities, onActivity, expUp, confidant = 'morgana' }) => {

    const navigate = useNavigate();
    const [dialogueState, setDialogueState] = useState(DIALOGUE_STATE.IDLE);
    const [assistSuggestion, setAssistSuggestion] = useState(null);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [idleQuote, setIdleQuote] = useState(() => randomItem(QUOTES));

    const isNewUser = Object.values(stats ?? {}).every((stat) => {
        return stat?.level === 1 && stat?.exp === 0;
    });

    useEffect(() => {
        if (dialogueState === DIALOGUE_STATE.IDLE && !expUp) {
            setIdleQuote(randomItem(QUOTES));
        }
        // only re-pick when we transition INTO this idle/non-expUp state
    }, [expUp]); // fires once when expUp flips false→true→false etc.

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
        const avatarSet = CONFIDANT_IMAGES[confidant] || CONFIDANT_IMAGES.morgana;

        if (dialogueState === DIALOGUE_STATE.IDLE && isNewUser) {
            return { text: WELCOME_MSG, pic: avatarSet.idle };
        }

        switch (dialogueState) {
            case DIALOGUE_STATE.LOG:
                return { text: "What shall we do?", pic: avatarSet.smile };

            case DIALOGUE_STATE.INTENSITY:
                return { text: `How intense was "${selectedActivity?.name}"?`, pic: avatarSet.smile };

            case DIALOGUE_STATE.ASSIST:
                return {
                    text: assistSuggestion?.suggestion
                        ? `Your ${assistSuggestion.lowestStat} is looking low... try "${assistSuggestion.suggestion.name}"!`
                        : `Your ${assistSuggestion?.lowestStat} is low, but I don't know any activities for it yet!`,
                    pic: avatarSet.grin,
                };

            default:
                return expUp
                    ? { text: "Looks like your social stats are growing!", pic: avatarSet.star }
                    : { text: idleQuote, pic: avatarSet.idle };
        }
    };

    const { text: speechText, pic: morganaPic } = getDialogueDisplay();

    // ── Render ───────────────────────────────────────────────────────────────

    return (
        <div className='dialogue-container'>
            <div className='morgana-container'>
                <img src={morganaPic} alt="Morgana" />
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

                    {dialogueState === DIALOGUE_STATE.LOG && activities.map((activity) => (
                        <button
                            className='dialogue-button'
                            key={activity.name}
                            onClick={() => handleSelectActivity(activity)}
                        >
                            {activity.name}
                        </button>
                    ))}

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