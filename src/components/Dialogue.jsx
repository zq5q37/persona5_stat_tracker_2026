import { useState } from 'react'
import morganaPic from '../assets/morgana-normal.webp'
import './Dialogue.css'
const Dialogue = ({ activities, onActivity , activitiesVisible, setActivitiesVisible}) => {

    const quotes = ["Don't think too hard about it. You'll get the hang of it.",
        "Everyone starts off a little clumsy. Don't be sad if it doesn't go well at first, OK?",
        "If you have nothing to do, let's clean up this room. An uncluttered room is an uncluttered mind!"
    ];

    return (
        <div className='dialogue-container'>
            <div className='morgana-container'>
                <img src={morganaPic}></img>
            </div>
            <div className='speech-options-container'>
                <div className='options-container'>
                    {!activitiesVisible && <button onClick={() => setActivitiesVisible(true)}>Log an activity.</button>}
                    {activitiesVisible && activities.map((activity) => (
                        <button key={activity.name} onClick={() => onActivity(activity)}>
                            {activity.name}
                        </button>
                    ))}
                </div>
                <div className='speech-container'>
                    {!activitiesVisible && <p>{quotes[0]}</p>}
                    {activitiesVisible && <p>What shall we do?</p>}
                </div>

            </div>

        </div>
    );
};

export default Dialogue;