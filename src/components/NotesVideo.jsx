import { useState, useEffect, useRef } from 'react'
import expUpVideoWebm from '../assets/NotesSocialStats.webm'
import expUpVideoMp4 from '../assets/NotesSocialStats.mp4'

const KEY_COLOR = { r: 0, g: 255, b: 0 }; // adjust to match your actual green screen
const SIMILARITY = 90; // 0-255ish; raise if green still shows, lower if subject gets eaten

const NotesVideo = ({ expUp }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const rafRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        if (expUp && videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play();
            setIsPlaying(true);
        }
    }, [expUp]);

    const drawFrame = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas || video.paused || video.ended) return;

        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = frame.data;

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i], g = data[i + 1], b = data[i + 2];
            const diff = Math.sqrt(
                (r - KEY_COLOR.r) ** 2 +
                (g - KEY_COLOR.g) ** 2 +
                (b - KEY_COLOR.b) ** 2
            );
            if (diff < SIMILARITY) {
                data[i + 3] = 0; // make transparent
            }
        }

        ctx.putImageData(frame, 0, 0);
        rafRef.current = requestAnimationFrame(drawFrame);
    };

    const handlePlay = () => {
        rafRef.current = requestAnimationFrame(drawFrame);
    };

    const handleEnded = () => {
        setIsPlaying(false);
        cancelAnimationFrame(rafRef.current);
    };

    return (
        <>
            <video
                ref={videoRef}
                onPlay={handlePlay}
                onEnded={handleEnded}
                onCanPlay={() => { videoRef.current.volume = 1; }}
                playsInline
                preload="auto"
                style={{ display: 'none' }}
            >
                <source src={expUpVideoWebm} type="video/webm" />
                <source src={expUpVideoMp4} type="video/mp4" />
            </video>
            <canvas
                ref={canvasRef}
                style={{
                    position: 'fixed',
                    top: 0, left: 0,
                    width: '100%', height: '100%',
                    objectFit: 'cover',
                    zIndex: 999,
                    pointerEvents: 'none',
                    opacity: isPlaying ? 1 : 0,
                    transition: 'opacity 0.1s ease',
                    backgroundColor: 'transparent',
                    mixBlendMode: 'plus-lighter',
                }}
            />
        </>
    );
};

export default NotesVideo;