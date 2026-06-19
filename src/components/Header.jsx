import './Header.css'
import p5Logo from '../assets/Persona-5-Logo.png'
import statsLogo from '../assets/stats-logo.png'

import volumeLogo from '../assets/volume.png'
import muteLogo from '../assets/mute.png'

import backgroundMusic from '../assets/sounds/beneathTheMask.mp3';
import { useState, useEffect, useRef } from 'react';

import playClick from '../utils/playClick.js';

function Header({ onReset }) {
    const audioRef = useRef(null);
    const [muted, setMuted] = useState(true);

    useEffect(() => {
        audioRef.current = new Audio(backgroundMusic);
        audioRef.current.loop = true;
        audioRef.current.volume = 0.05;
        audioRef.current.muted = true; // start muted
        // audioRef.current.play();

        return () => audioRef.current.pause();
    }, []);

    const toggleMute = () => {
        if (audioRef.current.paused) {
            audioRef.current.play();
        }
        audioRef.current.muted = !audioRef.current.muted;
        setMuted(prev => !prev);
    };

    return (
        <>
            <div className="header-bar">
                <div className='left'>
                    <div className="logo">
                        <img src={p5Logo}></img>
                    </div>
                    <button className='dialogue-button reset-button' onClick={() => { onReset(); playClick(); }}>Reset</button>
                    <button className='sound-button' onClick={toggleMute}>
                        <img src={muted ? muteLogo : volumeLogo} alt="sound" />
                    </button>

                </div>
                <div className='right'>
                    <img className='stats-logo' src={statsLogo}></img>

                </div>

            </div>
        </>
    )
}

export default Header