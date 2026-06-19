import { useState } from 'react'
import morganaNormal from '../assets/morgana-normal.webp'
import morganaSmile from '../assets/morgana-smile.webp'
import morganaStar from '../assets/morgana-star.webp'
import morganaGrin from '../assets/morgana-grin.png'

import './Dialogue.css'
import { useNavigate } from 'react-router-dom';

import playClick from '../utils/playClick.js';

const Dialogue = ({ stats, activities, onActivity, activitiesVisible, setActivitiesVisible, expUp, setExpUp }) => {

    const checkLowestStat = () => {
        // Find the lowest value
        const lowestVal = Math.min(...Object.values(stats));

        // Collect all stats tied at that value
        const lowestStats = Object.entries(stats)
            .filter(([, val]) => val === lowestVal)
            .map(([stat]) => stat);

        // Pick a random one from the tied lowest stats
        const lowestStat = lowestStats[Math.floor(Math.random() * lowestStats.length)];

        // Find a random activity that trains it
        const matching = activities.filter(activity => activity.traits.includes(lowestStat));
        const suggestion = matching[Math.floor(Math.random() * matching.length)];

        return { lowestStat, suggestion };
    };

    const [assist, setAssist] = useState(false);
    const [assistSuggestion, setAssistSuggestion] = useState(null);

    const handleAssist = () => {
        const { lowestStat, suggestion } = checkLowestStat();
        setAssistSuggestion({ lowestStat, suggestion });
        setAssist(true);
    }

    const resetAssist = () => { setAssist(false); setAssistSuggestion(null); };

    const quotes = ["Don't think too hard about it. You'll get the hang of it.",
        "Everyone starts off a little clumsy. Don't be sad if it doesn't go well at first, OK?",
        "If you have nothing to do, let's clean up this room. An uncluttered room is an uncluttered mind!"
    ];

    const speechText = activitiesVisible
        ? "What shall we do?"
        : assist
            ? assistSuggestion?.suggestion
                ? `Your ${assistSuggestion.lowestStat} is looking low... try "${assistSuggestion.suggestion.name}"!`
                : `Your ${assistSuggestion?.lowestStat} is low, but I don't know any activities for it yet!`
            : expUp
                ? "Looks like your social stats are growing!"
                : quotes[Math.floor(Math.random() * quotes.length)];

    const morganaPic = activitiesVisible
        ? morganaSmile
        : assist
            ? morganaGrin
            : expUp
                ? morganaStar
                : morganaNormal;

    const navigate = useNavigate();


    return (
        <div className='dialogue-container'>
            <div className='morgana-container'>
                <img src={morganaPic}></img>
            </div>
            <div className='speech-options-container'>
                <div className='options-container'>
                    {!activitiesVisible && <button className='dialogue-button' onClick={() => { navigate('/edit'); playClick(); resetAssist(); }}>Edit activities</button>}
                    {!activitiesVisible && <button className='dialogue-button' onClick={() => { setActivitiesVisible(true); resetAssist(); playClick(); }}>Log an activity</button>}
                    {!activitiesVisible && <button className='dialogue-button' onClick={() => { handleAssist(); playClick(); }}>Assist</button>}

                    {activitiesVisible && activities.map((activity) => (
                        <button className='dialogue-button' key={activity.name} onClick={() => { onActivity(activity); playClick(); }}>
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