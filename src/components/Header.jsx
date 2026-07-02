import './Header.css'
import p5Logo from '../assets/Persona-5-Logo.png'
import statsLogo from '../assets/stats-logo.webp'

import volumeLogo from '../assets/volume.webp'
import muteLogo from '../assets/mute.webp'

import backgroundMusic from '../assets/sounds/beneathTheMask.mp3';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import playClick from '../utils/playClick.js';

function Header({ onReset, onChangeConfidant, resetLabel = 'Reset' }) {
    const audioRef = useRef(null);
    const [muted, setMuted] = useState(true);

    useEffect(() => {
        audioRef.current = new Audio(backgroundMusic);
        audioRef.current.loop = true;
        audioRef.current.volume = 0.15;
        audioRef.current.muted = muted;

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
            }
        };
    }, []);

    useEffect(() => {
        if (!audioRef.current) return;

        audioRef.current.muted = muted;
        if (!muted) {
            audioRef.current.play().catch(() => { });
        } else {
            audioRef.current.pause();
        }
    }, [muted]);

    const toggleMute = () => {
        setMuted(prev => !prev);
    };
    const navigate = useNavigate();
    const handleEdit = () => {
        // resetAssist();
        playClick();
        navigate('/edit');
    };

    return (
        <>
            <div className="header-bar">
                <div className='left'>
                    <div className="logo">
                        <img src={p5Logo}></img>
                    </div>
                    <button className='dialogue-button header-button' onClick={() => { onReset(); playClick(); }}>{resetLabel}</button>
                    <button className='dialogue-button header-button' onClick={handleEdit}>Edit</button>
                    {/* <button className='dialogue-button header-button confidant-button' onClick={() => { onChangeConfidant(); playClick(); }}>
                        Confidant
                    </button> */}
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