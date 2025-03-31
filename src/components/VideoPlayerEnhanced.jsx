import React, { useEffect, useState, useRef } from 'react';
import './BackgroundVideo.css';

/**
 * Component îmbunătățit pentru redarea video în fundal
 * Cu tratare mai bună a erorilor și fallback la imagini
 */
const VideoPlayerEnhanced = ({ 
  videoSrc = '/background.mp4', 
  fallbackImageSrc = '/images/cover.jpeg',
  showControls = false,
  autoplay = true,
  loop = true,
  muted = true
}) => {
  const [videoFailed, setVideoFailed] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const videoRef = useRef(null);
  const retryCountRef = useRef(0);
  const maxRetries = 2;
  
  // Detectează mediul și adaptează path-urile
  const isProduction = window.location.hostname !== 'localhost' && 
                       !window.location.hostname.includes('127.0.0.1');
  
  const baseUrl = isProduction ? 
    (window.location.hostname.includes('github.io') ? '/my-website' : '') : 
    '/my-website';
  
  // Path-uri complete pentru resurse  
  const fullVideoPath = videoSrc.startsWith('http') ? videoSrc : `${baseUrl}${videoSrc}`;
  const fullImagePath = fallbackImageSrc.startsWith('http') ? fallbackImageSrc : `${baseUrl}${fallbackImageSrc}`;
  
  // Configurează video
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    // Funcția pentru încercare inițială
    const attemptToPlayVideo = () => {
      try {
        if (autoplay) {
          console.log('Attempting to play video...');
          const playPromise = video.play();
          
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                console.log('Video playing successfully');
                setVideoLoaded(true);
                setVideoFailed(false);
              })
              .catch(error => {
                console.warn('Video playback failed:', error);
                handleVideoError(error);
              });
          }
        }
      } catch (error) {
        console.error('Exception during video play:', error);
        handleVideoError(error);
      }
    };
    
    // Gestionare erori
    const handleVideoError = (error) => {
      if (retryCountRef.current < maxRetries) {
        console.log(`Retrying video playback (${retryCountRef.current + 1}/${maxRetries})...`);
        retryCountRef.current += 1;
        
        // Reîncercăm după o scurtă pauză
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.load();
            attemptToPlayVideo();
          }
        }, 1000);
      } else {
        console.warn(`Video playback failed after ${maxRetries} retries. Falling back to image.`);
        setVideoFailed(true);
      }
    };
    
    // Adăugăm listeners pentru evenimente
    video.addEventListener('canplaythrough', () => setVideoLoaded(true));
    video.addEventListener('error', (e) => handleVideoError(e));
    
    // Preîncarcă video la montare
    video.load();
    
    // Încearcă redarea după încărcare
    if (document.readyState === 'complete') {
      attemptToPlayVideo();
    } else {
      window.addEventListener('load', attemptToPlayVideo);
    }
    
    // Cleanup
    return () => {
      video.removeEventListener('error', handleVideoError);
      video.removeEventListener('canplaythrough', () => setVideoLoaded(true));
      window.removeEventListener('load', attemptToPlayVideo);
    };
  }, [autoplay, fullVideoPath]);
  
  // Toggle debug info
  const toggleDebug = () => {
    setShowDebug(prev => !prev);
  };
  
  return (
    <div className="background-container">
      {/* Fallback background color when nothing else is loaded */}
      <div className="fallback-background"></div>
      
      {/* Background image that's always displayed */}
      <div 
        className={`background-image ${videoFailed || !videoLoaded ? 'image-only' : ''}`}
        style={{ backgroundImage: `url('${fullImagePath}')` }}
      ></div>
      
      {/* Video element - only displayed if not failed */}
      {!videoFailed && (
        <video
          ref={videoRef}
          className="background-video"
          autoPlay={autoplay}
          loop={loop}
          muted={muted}
          controls={showControls}
          playsInline
        >
          <source src={fullVideoPath} type="video/mp4" />
          {/* Add support for other formats if needed */}
          <source src={fullVideoPath.replace('.mp4', '.webm')} type="video/webm" />
          <source src={fullVideoPath.replace('.mp4', '.mov')} type="video/quicktime" />
          {/* Message for browsers that don't support video */}
          Your browser does not support the video tag.
        </video>
      )}
      
      {/* Debug information - only visible if showDebug is true */}
      {showDebug && (
        <div className="debug-info">
          <p>Video Path: {fullVideoPath}</p>
          <p>Image Path: {fullImagePath}</p>
          <p>Video Failed: {videoFailed ? 'Yes' : 'No'}</p>
          <p>Video Loaded: {videoLoaded ? 'Yes' : 'No'}</p>
          <p>Environment: {isProduction ? 'Production' : 'Development'}</p>
          <p>Base URL: {baseUrl}</p>
          <p>Retry Count: {retryCountRef.current}/{maxRetries}</p>
        </div>
      )}
      
      {/* Button to toggle debug info - hidden in production */}
      {!isProduction && (
        <button className="check-button" onClick={toggleDebug}>
          {showDebug ? 'Hide Debug' : 'Show Debug'}
        </button>
      )}
      
      {/* Error message when video fails */}
      {videoFailed && showDebug && (
        <div className="video-error">
          <p>Video playback failed. Using background image instead.</p>
        </div>
      )}
    </div>
  );
};

export default VideoPlayerEnhanced;
