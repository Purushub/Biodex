import React, { useState, useRef, useEffect } from 'react';
import { soundFX } from '../utils/audio';
import { Sparkles, Play, FastForward, Upload, Volume2, VolumeX } from 'lucide-react';

interface SplashScreenProps {
  onStart: () => void;
  soundEnabled: boolean;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onStart, soundEnabled }) => {
  const [videoSrc, setVideoSrc] = useState<string>('/splash.mp4');
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [telemetryCount, setTelemetryCount] = useState(81896);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Live telemetry counter ticker matching the video's bottom right "81896"
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetryCount((prev) => prev + Math.floor(Math.random() * 7) - 3);
    }, 450);
    return () => clearInterval(interval);
  }, []);

  // Ensure video autoplay is attempted
  useEffect(() => {
    if (videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch(() => {
            // Autoplay may be restricted by browser until user gesture
            setIsPlaying(false);
          });
      }
    }
  }, [videoSrc]);

  const handleStartApp = () => {
    if (isStarting) return;
    setIsStarting(true);
    if (soundEnabled) {
      soundFX.playBoot();
    }
    setTimeout(() => {
      onStart();
    }, 650);
  };

  const handleCustomVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
      setIsVideoLoaded(true);
      if (soundEnabled) {
        soundFX.playConfirm();
      }
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[100] bg-black text-white flex items-center justify-center overflow-hidden select-none transition-opacity duration-700 ${
        isStarting ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Cyber Circuit Grid Video Player */}
      <div className="relative w-full h-full max-w-[480px] max-h-[960px] aspect-[9/16] mx-auto flex flex-col justify-between items-center overflow-hidden shadow-2xl bg-black border border-emerald-500/20">
        {/* The Native Video Feed with Auto-Enter on Video Finish */}
        <video
          ref={videoRef}
          src={videoSrc}
          autoPlay
          muted
          playsInline
          onLoadedData={() => {
            setIsVideoLoaded(true);
            if (videoRef.current) {
              setDuration(videoRef.current.duration || 0);
            }
          }}
          onTimeUpdate={() => {
            if (videoRef.current) {
              setCurrentTime(videoRef.current.currentTime);
              if (!duration && videoRef.current.duration) {
                setDuration(videoRef.current.duration);
              }
            }
          }}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={handleStartApp}
          onError={() => {
            if (videoSrc === '/splash.mp4') {
              setVideoSrc('/Splash.mp4');
            }
          }}
          className="absolute inset-0 w-full h-full object-cover object-center z-0 filter brightness-105 contrast-105"
        />

        {/* Scanline & Holographic Vignette Overlay */}
        <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-black/60 via-transparent to-black/80"></div>
        <div className="absolute inset-0 z-10 pointer-events-none scanline-overlay opacity-30"></div>

        {/* Play overlay if browser restricted autoplay */}
        {!isPlaying && (
          <button
            type="button"
            onClick={() => {
              if (videoRef.current) {
                videoRef.current.play().then(() => setIsPlaying(true));
              }
            }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 backdrop-blur-xs cursor-pointer"
          >
            <div className="w-14 h-14 rounded-full bg-emerald-500/90 hover:bg-emerald-400 text-black flex items-center justify-center shadow-[0_0_25px_rgba(16,185,129,0.8)] active:scale-95 transition-all">
              <Play className="w-7 h-7 ml-0.5 text-slate-950 fill-current" />
            </div>
            <span className="font-telemetry text-[11px] text-emerald-300 font-bold mt-2.5 tracking-wider uppercase bg-black/70 px-3 py-1 rounded-full border border-emerald-500/40">
              Tap to Play Video &bull; Auto-Enters at End
            </span>
          </button>
        )}

        {/* Subtle Bottom Progress Bar */}
        {duration > 0 && (
          <div className="absolute bottom-0 inset-x-0 z-25 h-1 bg-white/15">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-150"
              style={{ width: `${Math.min(100, (currentTime / duration) * 100)}%` }}
            />
          </div>
        )}

        {/* Subtle Top HUD Bar */}
        <div className="relative z-20 w-full px-3 pt-3 flex items-center justify-between text-[11px] font-telemetry">
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-400 font-bold tracking-wider text-[10px] font-mono">
              BIODEX EXPEDITION
            </span>
          </div>

          {/* Video Switcher & Skip Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-black/60 hover:bg-black/85 text-slate-300 hover:text-emerald-300 px-2 py-1 rounded text-[10px] font-telemetry border border-white/15 flex items-center gap-1 transition-all"
              title="Upload your MP4 video if you want to replace entry video"
            >
              <Upload className="w-3 h-3 text-emerald-400" />
              <span className="hidden sm:inline">Upload Video</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleCustomVideoUpload}
            />

            <button
              type="button"
              onClick={() => {
                if (soundEnabled) soundFX.playClick();
                onStart();
              }}
              className="bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 hover:text-white px-2.5 py-1 rounded text-[10px] font-telemetry font-bold border border-emerald-500/40 flex items-center gap-1 transition-all"
            >
              <span>ENTER</span>
              <FastForward className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Center Minimal Ambient Title (unobtrusive so video is clearly visible) */}
        <div className="relative z-10 flex flex-col items-center justify-center my-auto pointer-events-none text-center px-4">
          <div className="opacity-80 hover:opacity-100 transition-opacity">
            <h1 className="font-display font-black text-3xl sm:text-4xl tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-white via-emerald-100 to-emerald-400 drop-shadow-[0_2px_12px_rgba(16,185,129,0.7)]">
              BIODEX
            </h1>
            <span className="font-telemetry text-[10px] tracking-widest text-emerald-300 font-semibold uppercase block mt-0.5">
              WWF SPECIES MONITORING
            </span>
          </div>
        </div>

        {/* POKÉDEX ICON BUTTON ON BOTTOM LEFT WITH 12PX PADDING ON BOTTOM AND RIGHT */}
        <div
          id="splash-pokedex-bottom-left-container"
          className="absolute bottom-0 left-0 z-30 flex items-center gap-3"
          style={{ paddingBottom: '12px', paddingRight: '12px', paddingLeft: '12px' }}
        >
          <button
            type="button"
            id="splash-pokedex-icon-button"
            onClick={handleStartApp}
            aria-label="Start BioDex"
            className="group relative flex items-center justify-center rounded-full cursor-pointer focus:outline-none focus:ring-4 focus:ring-emerald-400/60 active:scale-95 transition-all shadow-[0_0_30px_rgba(220,38,38,0.7)]"
          >
            {/* Pokeball Hardware Housing */}
            <div className="relative w-14 h-14 rounded-full border-3 border-slate-900 shadow-2xl overflow-hidden group-hover:scale-105 transition-transform flex items-center justify-center bg-slate-900">
              {/* Upper Hemisphere - Pokédex Red */}
              <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-red-500 to-red-700 shadow-inner"></div>
              {/* Lower Hemisphere - Pure White */}
              <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-slate-200 to-white shadow-inner"></div>
              {/* Center Dividing Horizon Line */}
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-2.5 bg-slate-950 flex items-center justify-center"></div>
              {/* Pokédex Core Button with Cyan LED */}
              <div className="relative z-10 w-6 h-6 rounded-full bg-white border-2 border-slate-950 flex items-center justify-center shadow-lg">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 border border-slate-800 shadow-[0_0_8px_#22d3ee] animate-pulse"></div>
              </div>
            </div>

            {/* Glowing Accent Ring */}
            <div className="absolute -inset-1 rounded-full border-2 border-emerald-400/40 opacity-0 group-hover:opacity-100 transition-opacity animate-ping pointer-events-none"></div>
          </button>

          {/* Label next to Pokédex Icon */}
          <button
            type="button"
            onClick={handleStartApp}
            className="flex flex-col text-left group cursor-pointer"
          >
            <span className="font-pixel text-[10px] text-amber-300 group-hover:text-amber-200 tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              OPEN BIODEX
            </span>
            <span className="font-telemetry text-[9px] text-emerald-300/90 group-hover:text-white flex items-center gap-1">
              <span>Tap Pokédex button</span>
              <Sparkles className="w-2.5 h-2.5 text-amber-300" />
            </span>
          </button>
        </div>


      </div>
    </div>
  );
};
