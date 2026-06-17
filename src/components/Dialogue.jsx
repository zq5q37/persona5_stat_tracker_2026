import { useState } from 'react'
import morganaNormal from '../assets/morgana-normal.webp'
import morganaSmile from '../assets/morgana-smile.png'
import morganaStar from '../assets/morgana-star.png'
import './Dialogue.css'

import playClick from '../utils/playClick.js';

const Dialogue = ({ activities, onActivity, activitiesVisible, setActivitiesVisible , expUp, setExpUp }) => {

    const quotes = ["Don't think too hard about it. You'll get the hang of it.",
        "Everyone starts off a little clumsy. Don't be sad if it doesn't go well at first, OK?",
        "If you have nothing to do, let's clean up this room. An uncluttered room is an uncluttered mind!"
    ];

    const speechText = activitiesVisible
        ? "What shall we do?"
        : expUp
            ? "Looks like your social stats are growing!"
            : quotes[Math.floor(Math.random() * quotes.length)];

    const morganaPic = activitiesVisible
        ? morganaSmile
        : expUp
            ? morganaStar
            : morganaNormal;

    return (
        <div className='dialogue-container'>
            <div className='morgana-container'>
                <img src={morganaPic}></img>
            </div>
            <div className='speech-options-container'>
                <div className='options-container'>
                    {!activitiesVisible && <button className='dialogue-button' onClick={() => { setActivitiesVisible(true); playClick(); }}>Log an activity.</button>}
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