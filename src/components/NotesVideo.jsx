import { useState, useEffect, useRef } from 'react'
import expUpVideoWebm from '../assets/NotesSocialStats.webm'
import expUpVideoMp4 from '../assets/NotesSocialStats.mp4'
import expUpVideoMov from '../assets/NotesSocialStats.mov'

const NotesVideo = ({ expUp }) => {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    // Trigger a play whenever expUp flips true — ignore it flipping false
    useEffect(() => {
        if (expUp && videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play();
            setIsPlaying(true);
        }
    }, [expUp]);

    const handleEnded = () => {
        setIsPlaying(false);
    };

    return (
        <video
            ref={videoRef}
            onCanPlay={() => { videoRef.current.volume = 1; }}
            onEnded={handleEnded}
            playsInline
            preload="auto"
            style={{
                position: 'fixed',
                top: 0, left: 0,
                width: '100%', height: '100%',
                objectFit: 'cover',
                zIndex: 999,
                pointerEvents: 'none',
                opacity: isPlaying ? 1 : 0,
                transition: 'opacity 0.2s ease',
            }}
        >
            <source src={expUpVideoWebm} type="video/webm" />
            {/* <source src={expUpVideoMp4} type="video/mp4" /> */}
            {/* <source src={expUpVideoMov} type="video/mov" /> */}
        </video>
    );
};

export default NotesVideo;