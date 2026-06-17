import React from 'react';
import { useState, useEffect, useRef } from 'react'
import expUpVideoWebm from '../assets/NotesSocialStats.webm'
import expUpVideoMp4 from '../assets/NotesSocialStats.mp4'
import expUpVideoMov from '../assets/NotesSocialStats.mov'

const NotesVideo = ({expUp}) => {
    const videoRef = useRef(null);

    useEffect(() => {
        if (expUp && videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play();
        }
    }, [expUp]);

    return (
        <video
            ref={videoRef}
            onCanPlay={() => { videoRef.current.volume = 1; }}
            playsInline
            preload="auto"
            style={{
                position: 'fixed',
                top: 0, left: 0,
                width: '100%', height: '100%',
                objectFit: 'cover',
                zIndex: 999,
                pointerEvents: 'none',
            }}
        >
            <source src={expUpVideoWebm} type="video/webm" />
            {/* <source src={expUpVideoMp4} type="video/mp4" /> */}
            {/* <source src={expUpVideoMov} type="video/mov" /> */}
        </video>
    );
};

export default NotesVideo;