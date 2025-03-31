import React, { useEffect, useState, useRef } from 'react';
import './BackgroundVideo.css';

const BackgroundVideo = () => {
  const [videoFailed, setVideoFailed] = useState(false);
  const videoRef = useRef(null);
  const [isMounted, setIsMounted] = useState(true);
  
  // Detectează platforma pentru a adapta path-ul resurselor
  const isProduction = window.location.hostname !== 'localhost' && 
                       !window.location.hostname.includes('127.0.0.1');
  
  // Determină baza URL-ului
  const baseUrl = isProduction ? 
    (window.location.hostname.includes('github.io') ? '/my-website' : '') : 
    '/my-website';

  useEffect(() => {
    // Marcăm componenta ca montată
    setIsMounted(true);
    
    // Verifică dacă videoclipul poate fi redat
    const checkVideo = () => {
      const video = videoRef.current;
      if (video) {
        try {
          // Încearcă să încarce videoclipul
          const playPromise = video.play();
          
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                console.log('Video playing successfully');
              })
              .catch(error => {
                console.warn('Video playback failed:', error);
                if (isMounted) {
                  setVideoFailed(true);
                }
              });
          }
        } catch (error) {
          console.error('Error playing video:', error);
          if (isMounted) {
            setVideoFailed(true);
          }
        }
      }
    };
    
    // Rulează verificarea după ce DOM-ul este încărcat complet
    window.addEventListener('load', checkVideo);
    
    // Setează un timeout pentru a verifica videoclipul după 3 secunde în cazul în care load event-ul nu se declanșează
    const timeoutId = setTimeout(checkVideo, 3000);
    
    // Cleanup
    return () => {
      setIsMounted(false);
      window.removeEventListener('load', checkVideo);
      clearTimeout(timeoutId);
    };
  }, [isMounted]);
  
  return (
    <div className="background-container">
      {/* Afișează întotdeauna imaginea de fundal ca backup */}
      <div 
        className={`background-image ${videoFailed ? 'image-only' : ''}`}
        style={{ backgroundImage: `url('${baseUrl}/images/cover.jpeg')` }}
      ></div>
      
      {/* Afișează videoclipul doar dacă acesta nu a eșuat */}
      {!videoFailed && (
        <video
          ref={videoRef}
          className="background-video"
          autoPlay
          loop
          muted
          playsInline
          onError={() => setVideoFailed(true)}
        >
          <source src={`${baseUrl}/background.mp4`} type="video/mp4" />
          <source src={`${baseUrl}/background.mov`} type="video/quicktime" />
          {/* Mesaj pentru browsere care nu suportă video */}
          Your browser does not support the video tag.
        </video>
      )}
      
      {/* Container pentru conținut */}
      <div className="content-container">
        {/* Conținutul va fi afișat aici */}
      </div>
    </div>
  );
};

export default BackgroundVideo;
