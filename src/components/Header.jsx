import './Header.css'
import p5Logo from '../assets/Persona-5-Logo.png'
import statsLogo from '../assets/stats-logo.webp'

import volumeLogo from '../assets/volume.webp'
import muteLogo from '../assets/mute.webp'
import hamburgerLogo from '../assets/hamburger.webp'

import backgroundMusic from '../assets/sounds/beneathTheMask.mp3';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import playClick from '../utils/playClick.js';

function Header({ onReset, onChangeConfidant, resetLabel = 'Reset', user, onLogin, onLogout }) {
    const audioRef = useRef(null);
    const [muted, setMuted] = useState(true);
    const [menuOpen, setMenuOpen] = useState(false);

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

    const handleAuthClick = () => {
        playClick();
        if (user) {
            onLogout();
        } else {
            onLogin();
        }
    };

    const handleMenuItemClick = () => {
        setMenuOpen(false);
    };

    const handleHome = () => {
        playClick();
        navigate('/');
    };

    return (
        <>
            <div className="header-bar">
                <div className='left'>
                    <div className="logo" onClick={handleHome}>
                        <img src={p5Logo}></img>
                    </div>
                     <button className='sound-button' onClick={toggleMute}>
                        <img src={muted ? muteLogo : volumeLogo} alt="sound" />
                    </button>
                    <button className='dialogue-button reset-button' onClick={() => { onReset(); playClick(); }}>{resetLabel}</button>
                    <button className='dialogue-button header-button' onClick={handleEdit}>Edit</button>
                   

                    <button className='dialogue-button header-button auth-button' onClick={handleAuthClick}>
                        {user ? 'Logout' : 'Login'}
                    </button>
                </div>
                <div className='right'>
                    
                    <img className='stats-logo' src={statsLogo}></img>

                    {/* Hamburger Menu for Mobile */}
                    <button className='hamburger-button' onClick={() => setMenuOpen(!menuOpen)}>
                        <img src={hamburgerLogo} alt="menu" />
                    </button>
                    
                    {menuOpen && (
                        <div className='mobile-menu'>
                            <button className='menu-item' onClick={() => { handleEdit(); handleMenuItemClick(); }}>Edit</button>
                            <button className='menu-item' onClick={() => { handleAuthClick(); handleMenuItemClick(); }}>
                                {user ? 'Logout' : 'Login'}
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </>
    )
}

export default Header