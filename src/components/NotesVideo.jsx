import React from 'react';
import { useState, useEffect, useRef } from 'react'
import expUpVideoWebm from '../assets/NotesSocialStats.webm'
import expUpVideoMp4 from '../assets/NotesSocialStats.mp4'

const NotesVideo = () => {
      const videoRef = useRef(null);
    return (
        <video
            ref={videoRef}
            onCanPlay={() => { videoRef.current.volume = 1; }}
            playsInline
            autoPlay
            style={{
              position: 'fixed',
              top: 0, left: 0,
              width: '100%', height: '100%',
              objectFit: 'cover',
              zIndex: 999,
              pointerEvents: 'none',
            }}
          >
            <source src={expUpVideoWebm} type="video/webm" />  {/* Chrome/desktop - has alpha */}
            <source src={expUpVideoMp4} type="video/mp4" />    {/* iOS Safari - use .mov with alpha */}
          </video>
    );
};

export default NotesVideo;