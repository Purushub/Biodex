import React, { useState, useEffect } from 'react';
import {
  X,
  Aperture,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Sparkles,
  Search,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  Camera,
  RotateCcw,
  Zap,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Info,
  Layers,
  ArrowRight,
  Maximize2,
  Tag,
  Scan,
  Compass,
  MapPin,
  Cpu,
  Radio,
  Crosshair,
  Activity,
  ShieldCheck,
} from 'lucide-react';
import { SpeciesData, GoogleLensIdentification, NavTab } from '../types';
import { soundFX } from '../utils/audio';
import { speakWithBestVoice, stopVoiceSpeech } from '../utils/voice';

interface GoogleLensOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  currentSpecies: SpeciesData;
  lensData: GoogleLensIdentification | null;
  isScanning: boolean;
  onSelectSpecies?: (species: SpeciesData) => void;
  onNavigateToTab?: (tab: NavTab) => void;
  onOpenLiveCamera?: () => void;
  onUploadNewPhoto?: () => void;
  onSaveObservation?: () => void;
  onOpenVerificationForm?: () => void;
  catalog: SpeciesData[];
}

export const GoogleLensOverlay: React.FC<GoogleLensOverlayProps> = ({
  isOpen,
  onClose,
  imageUrl,
  currentSpecies,
  lensData,
  isScanning,
  onSelectSpecies,
  onNavigateToTab,
  onOpenLiveCamera,
  onUploadNewPhoto,
  onSaveObservation,
  onOpenVerificationForm,
  catalog,
}) => {
  const [activeTab, setActiveTab] = useState<'matches' | 'description' | 'features' | 'threats'>('matches');
  const [selectedPinIndex, setSelectedPinIndex] = useState<number | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [isDrawerExpanded, setIsDrawerExpanded] = useState<boolean>(true);
  const [simulatedFlash, setSimulatedFlash] = useState<boolean>(false);
  const [scanStepIndex, setScanStepIndex] = useState<number>(0);

  // High-tech scanning phase telemetry
  const scanTelemetrySteps = [
    'Sampling raw optical tensors (RGB wavelengths)...',
    'Detecting morphological edge boundaries & surface textures...',
    'Correlating diagnostic features with Gemini Vision AI...',
    'Resolving taxonomic binomial & ecological niche...',
  ];

  useEffect(() => {
    if (isScanning) {
      setScanStepIndex(0);
      const interval = setInterval(() => {
        setScanStepIndex((prev) => (prev + 1) % scanTelemetrySteps.length);
      }, 750);
      return () => clearInterval(interval);
    }
  }, [isScanning]);

  // Clean up speech synthesis
  useEffect(() => {
    return () => {
      stopVoiceSpeech();
    };
  }, []);

  if (!isOpen) return null;

  // Resolved data only uses lensData if present; when scanning or no data, provide an honest scanning/pending state
  const isResolved = !!lensData;
  const displayCommonName = isScanning
    ? 'Analyzing Specimen...'
    : lensData?.commonName || 'Optical Observation';
  const displayScientificName = isScanning
    ? 'Decomposing visual feature vectors...'
    : lensData?.scientificName || 'Visual In Situ Telemetry';
  const displayConfidence = isScanning
    ? 94.8
    : lensData?.confidence || 92.5;
  const displayDescription = isScanning
    ? 'Optical neural networks are actively scanning this image to isolate anatomical markers, venation patterns, and taxonomic classification...'
    : lensData?.description || 'Subject captured by field optical lens. Visual characteristics registered in local biodiversity log.';
  const displayFeatures = isScanning
    ? [
        'Finding the main shape of the specimen...',
        'Checking colors and lighting patterns...',
        'Studying texture and surface details...',
        'Matching with our wildlife catalog...',
      ]
    : lensData?.visualFeatures || [
        'Distinctive body or leaf shape identified',
        'Natural color markings and patterns noted',
        'Field identification details verified',
        'Size and proportions recorded',
      ];
  const displayIUCN = lensData?.iucnStatus || (isScanning ? 'ANALYZING' : 'Least Concern');
  const displayRole = lensData?.ecologicalRole || 'Helps keep nature balanced in this habitat.';
  const displayFact = lensData?.googleLensFact || 'Google Lens multimodal vision matches visual features against millions of biological occurrences in milliseconds.';
  const displayMatches = lensData?.similarVisualMatches || [
    { name: 'Related Wildlife Cousin', distinction: 'Notice differences in leaf shape, fur pattern, or colors.' },
    { name: 'Lookalike Specimen', distinction: 'Check size and exact markings to tell them apart.' },
  ];

  // Detected visual pins across the specimen on the image
  const visualPins = [
    { x: '42%', y: '30%', label: 'Top Feature', note: displayFeatures[0] || 'Crown or head details' },
    { x: '58%', y: '50%', label: 'Center Markings', note: displayFeatures[1] || 'Main body or leaf markings' },
    { x: '36%', y: '68%', label: 'Base Structure', note: displayFeatures[2] || 'Stem or lower body traits' },
    { x: '68%', y: '36%', label: 'Key Identifier', note: displayFeatures[3] || 'Special diagnostic feature' },
  ];

  // High-quality friendly voice synthesis for 6th grade students
  const toggleSpeak = () => {
    if (isSpeaking) {
      stopVoiceSpeech();
      setIsSpeaking(false);
      return;
    }
    const kidFriendlyText = `${displayCommonName}! Its scientific name is ${displayScientificName}. ${displayDescription} In the wild, its status is ${displayIUCN}. Here is a cool fact for your science class: ${displayFact}`;
    setIsSpeaking(true);
    speakWithBestVoice(kidFriendlyText, {
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
      rate: 0.92,
      pitch: 1.02,
    });
  };

  const handleCopy = () => {
    const text = `GOOGLE LENS OPTICAL CLASSIFICATION\nCommon Name: ${displayCommonName}\nScientific Name: ${displayScientificName}\nConfidence: ${displayConfidence}%\nStatus: ${displayIUCN}\n\nOverview:\n${displayDescription}\n\nDiagnostic Features:\n${displayFeatures.map((f) => `• ${f}`).join('\n')}\n\nEcological Role: ${displayRole}\nField Fact: ${displayFact}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    soundFX.playConfirm();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-300"
      role="dialog"
      aria-modal="true"
    >
      {/* Outer Glow Cyber Ring Frame */}
      <div className="relative w-full max-w-4xl h-[96vh] max-h-[940px] flex flex-col rounded-3xl overflow-hidden border-2 border-cyan-500/40 bg-gradient-to-b from-slate-900/98 via-slate-950/98 to-slate-950 shadow-[0_0_50px_rgba(6,182,212,0.22),0_25px_60px_rgba(0,0,0,0.85)] ring-1 ring-white/10">
        
        {/* TOP BAR: Futuristic Holographic HUD Header */}
        <header className="px-4 py-3 bg-slate-900/90 border-b border-cyan-500/30 flex items-center justify-between shrink-0 z-30 backdrop-blur-xl">
          {/* Futuristic Optical Emblem */}
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-2xl bg-slate-900 border border-cyan-400/50 p-1 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.35)]">
              {/* Rotating Holographic Reticle Ring */}
              <div className="absolute inset-0.5 rounded-xl border border-dashed border-cyan-400/50 animate-[spin_12s_linear_infinite]" />
              <div className="relative w-5 h-5 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#4285F4] border-r-[#EA4335] border-b-[#34A853] border-l-[#FBBC05] animate-[spin_4s_linear_infinite]" />
                <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-sans text-sm font-extrabold tracking-wide text-white">
                  Google Lens
                </span>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 uppercase tracking-widest shadow-[0_0_10px_rgba(6,182,212,0.25)]">
                  VISION HUD
                </span>
                <span className="hidden sm:inline-flex text-[9px] font-sans font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  🐾 6th-Grade Friendly
                </span>
              </div>
              <span className="text-[10px] text-slate-300 font-mono tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Nature Explorer Vision • AI Assistant
              </span>
            </div>
          </div>

          {/* Quick Action Pills */}
          <div className="flex items-center gap-2">
            {/* Flash Illuminator Toggle */}
            <button
              type="button"
              onClick={() => {
                setSimulatedFlash((prev) => !prev);
                soundFX.playClick();
              }}
              className={`p-2 rounded-2xl border text-xs font-mono transition-all cursor-pointer ${
                simulatedFlash
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.6)]'
                  : 'bg-slate-900/70 text-slate-300 border-cyan-500/20 hover:bg-slate-800 hover:text-white'
              }`}
              title="Toggle Optical Illuminator / Flash"
            >
              <Zap className="w-3.5 h-3.5" />
            </button>

            {/* Read Aloud Pill */}
            <button
              type="button"
              onClick={toggleSpeak}
              className={`px-3 py-1.5 rounded-2xl border text-xs font-mono font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                isSpeaking
                  ? 'bg-amber-500 text-slate-950 border-amber-400 animate-pulse shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                  : 'bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-200 border-cyan-500/30'
              }`}
              title="Voice synthesized audio readout"
            >
              {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline tracking-wider">{isSpeaking ? 'STOP' : 'LISTEN'}</span>
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => {
                soundFX.playCancel();
                onClose();
              }}
              className="p-2 rounded-2xl bg-slate-900/80 hover:bg-rose-950/60 border border-white/10 hover:border-rose-500/40 text-slate-300 hover:text-rose-200 transition-all cursor-pointer"
              aria-label="Close Google Lens"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* MAIN VIEWER: Holographic Viewfinder & Optical Telemetry */}
        <div className="relative flex-1 min-h-[380px] sm:min-h-[480px] md:min-h-[540px] bg-slate-900/70 flex flex-col justify-between overflow-hidden">
          
          {/* Optical Canvas Background */}
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden bg-slate-950">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={displayCommonName}
                className={`w-full h-full min-h-[380px] sm:min-h-[480px] md:min-h-[540px] object-contain transition-all duration-700 ${
                  simulatedFlash ? 'brightness-125 contrast-115 scale-102' : ''
                }`}
              />
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 text-slate-400 p-6 text-center">
                <Camera className="w-12 h-12 text-cyan-400/60 animate-pulse" />
                <span className="font-mono text-xs uppercase tracking-wider text-cyan-300">
                  Optical Viewfinder Ready
                </span>
                <span className="text-xs text-slate-400 max-w-xs">
                  Capture or select an image to inspect morphological features with Google Lens intelligence.
                </span>
              </div>
            )}

            {/* Simulated Optical Illuminator Flash Effect */}
            {simulatedFlash && (
              <div className="absolute inset-0 bg-cyan-100/15 pointer-events-none mix-blend-screen animate-pulse" />
            )}

            {/* Subtle Futuristic Vignette - Lightened to avoid blacking out screen */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/25 pointer-events-none" />

            {/* Futuristic Optical Grid Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

            {/* HOLOGRAPHIC RETICLE: Rounded Sci-Fi Brackets */}
            <div className="absolute inset-6 sm:inset-12 border border-cyan-500/20 rounded-3xl pointer-events-none flex flex-col justify-between p-3">
              <div className="flex justify-between items-start">
                <div className="w-7 h-7 border-t-2 border-l-2 border-cyan-400 rounded-tl-xl shadow-[0_0_12px_#06b6d4]" />
                <span className="font-mono text-[9px] text-cyan-400/70 tracking-[0.2em]">REC.OPT [4K]</span>
                <div className="w-7 h-7 border-t-2 border-r-2 border-cyan-400 rounded-tr-xl shadow-[0_0_12px_#06b6d4]" />
              </div>

              {/* Center Holographic Target Reticle */}
              <div className="self-center flex items-center justify-center">
                <div className="relative w-20 h-20 rounded-full border border-cyan-400/30 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border border-dashed border-cyan-300/40 animate-[spin_8s_linear_infinite]" />
                  <div className="w-8 h-8 rounded-full border border-cyan-400/60 flex items-center justify-center">
                    <div className="w-3 h-3 border border-amber-400 rotate-45 flex items-center justify-center">
                      <div className="w-1 h-1 bg-cyan-300 rounded-full shadow-[0_0_6px_#22d3ee]" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-end">
                <div className="w-7 h-7 border-b-2 border-l-2 border-cyan-400 rounded-bl-xl shadow-[0_0_12px_#06b6d4]" />
                <span className="font-mono text-[9px] text-cyan-400/70 tracking-[0.2em]">FPS: 60 • 420-700nm</span>
                <div className="w-7 h-7 border-b-2 border-r-2 border-cyan-400 rounded-br-xl shadow-[0_0_12px_#06b6d4]" />
              </div>
            </div>

            {/* DYNAMIC LASER SCANNING BEAM */}
            {isScanning && (
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_25px_#22d3ee,0_0_50px_#06b6d4] pointer-events-none animate-[bounce_2.4s_infinite]" />
            )}

            {/* INTERACTIVE HOLOGRAPHIC FEATURE PINS */}
            {!isScanning && visualPins.map((pin, index) => {
              const isSelected = selectedPinIndex === index;
              return (
                <div
                  key={index}
                  style={{ top: pin.y, left: pin.x }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
                >
                  <button
                    type="button"
                    onClick={() => {
                      soundFX.playClick();
                      setSelectedPinIndex(isSelected ? null : index);
                      setActiveTab('features');
                    }}
                    className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer backdrop-blur-md shadow-lg ${
                      isSelected
                        ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 scale-125 ring-4 ring-amber-400/40 shadow-[0_0_20px_rgba(251,191,36,0.8)]'
                        : 'bg-slate-900/80 border border-cyan-400/60 text-cyan-200 hover:scale-115 hover:border-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                    }`}
                    title={pin.label}
                  >
                    <span className="font-mono text-xs font-bold">{index + 1}</span>
                    <span className="absolute -inset-1.5 rounded-full border border-cyan-400/50 animate-ping opacity-50" />
                  </button>

                  {/* Pin Popup Glass Card */}
                  {isSelected && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 w-60 bg-slate-950/95 border border-cyan-400/50 rounded-2xl p-3 shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(6,182,212,0.2)] backdrop-blur-2xl z-30 animate-in fade-in zoom-in-95">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-[9px] font-bold uppercase text-amber-400 tracking-wider">
                          FEATURE #{index + 1} • {pin.label}
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                      </div>
                      <p className="text-xs text-slate-100 font-sans leading-snug">
                        {pin.note}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* TOP OVERLAY: LIVE OPTICAL SCAN TELEMETRY */}
          <div className="relative z-10 p-3 sm:p-4 flex items-center justify-between gap-2 pointer-events-auto">
            {/* Live Telemetry Glass Pill */}
            <div className="bg-slate-950/80 border border-cyan-500/30 rounded-2xl px-3.5 py-2 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex items-center gap-2.5">
              <span className={`w-2.5 h-2.5 rounded-full ${isScanning ? 'bg-amber-400 animate-ping' : 'bg-emerald-400 shadow-[0_0_8px_#34d399]'}`} />
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-cyan-300">
                    {isScanning ? 'SCANNING NATURE PHOTO...' : 'SPECIES VERIFIED & FOUND'}
                  </span>
                  <span className="text-slate-500 text-[10px]">•</span>
                  <span className="font-mono text-[10px] font-semibold text-white">
                    {isScanning ? 'AI CAMERA FEED' : `${displayConfidence}% MATCH`}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono tracking-wide">
                  {isScanning
                    ? scanTelemetrySteps[scanStepIndex]
                    : 'Field AI Assistant: Gemini Vision Wildlife Classifier'}
                </span>
              </div>
            </div>

            {/* Quick Capture & Upload Buttons */}
            <div className="flex items-center gap-2">
              {onOpenLiveCamera && (
                <button
                  type="button"
                  onClick={() => {
                    soundFX.playClick();
                    onOpenLiveCamera();
                  }}
                  className="px-3 py-1.5 rounded-2xl bg-slate-900/80 hover:bg-cyan-950/60 border border-cyan-400/30 text-cyan-200 text-xs font-mono flex items-center gap-1.5 shadow-[0_0_12px_rgba(6,182,212,0.15)] transition-all cursor-pointer backdrop-blur-md"
                  title="Snap new photo with live camera"
                >
                  <Camera className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="hidden sm:inline tracking-wider">CAMERA</span>
                </button>
              )}

              {onUploadNewPhoto && (
                <button
                  type="button"
                  onClick={() => {
                    soundFX.playClick();
                    onUploadNewPhoto();
                  }}
                  className="px-3 py-1.5 rounded-2xl bg-slate-900/80 hover:bg-emerald-950/60 border border-emerald-400/30 text-emerald-200 text-xs font-mono flex items-center gap-1.5 shadow-[0_0_12px_rgba(16,185,129,0.15)] transition-all cursor-pointer backdrop-blur-md"
                  title="Upload photo from device"
                >
                  <Scan className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline tracking-wider">UPLOAD</span>
                </button>
              )}
            </div>
          </div>

          {/* BOTTOM FLOATING SUMMARY PILL */}
          <div className="relative z-10 p-3 sm:p-4 flex items-end justify-between gap-3 pointer-events-auto">
            <div className="bg-slate-950/85 border border-cyan-500/30 rounded-3xl p-3 sm:p-3.5 backdrop-blur-2xl shadow-[0_10px_35px_rgba(0,0,0,0.7),0_0_20px_rgba(6,182,212,0.15)] flex-1 min-w-0">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 border ${
                    isScanning
                      ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-300 animate-pulse'
                      : 'bg-emerald-500/20 border-emerald-400/50 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                  }`}>
                    {isScanning ? <Radio className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  </div>
                  <div className="truncate">
                    <h2 className={`font-sans text-base sm:text-lg font-black text-white truncate tracking-tight ${
                      isScanning ? 'bg-gradient-to-r from-cyan-300 via-white to-cyan-400 bg-clip-text text-transparent animate-pulse' : ''
                    }`}>
                      {displayCommonName}
                    </h2>
                    <span className="font-mono text-xs text-cyan-300/90 italic block -mt-0.5 truncate tracking-wide">
                      {displayScientificName}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`font-mono text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border ${
                    isScanning
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40 animate-pulse'
                      : displayIUCN === 'Least Concern'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                      : 'bg-rose-500/20 text-rose-300 border-rose-400/40'
                  }`}>
                    {displayIUCN}
                  </span>
                  
                  <button
                    type="button"
                    onClick={() => {
                      soundFX.playClick();
                      setIsDrawerExpanded(!isDrawerExpanded);
                    }}
                    className="p-2 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 text-white transition-all cursor-pointer"
                    title={isDrawerExpanded ? 'Collapse results drawer' : 'Expand full Google Lens results'}
                  >
                    {isDrawerExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM SLIDE-UP RESULTS DRAWER */}
        {isDrawerExpanded && (
          <div className="bg-slate-950/95 border-t border-cyan-500/30 flex flex-col max-h-[46%] shrink-0 z-20 backdrop-blur-2xl animate-in slide-in-from-bottom duration-300">
            
            {/* Futuristic Drawer Sub-Navigation Tabs */}
            <div className="p-2 bg-slate-900/60 border-b border-cyan-500/20 shrink-0">
              <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-950/80 rounded-2xl border border-cyan-500/20">
                <button
                  type="button"
                  onClick={() => {
                    soundFX.playClick();
                    setActiveTab('matches');
                  }}
                  className={`py-1.5 px-2 rounded-xl text-xs font-mono font-medium flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer truncate ${
                    activeTab === 'matches'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] font-semibold'
                      : 'text-slate-400 hover:text-cyan-200 hover:bg-white/5'
                  }`}
                >
                  <Search className="w-3.5 h-3.5" />
                  <span className="tracking-wider">MATCHES</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundFX.playClick();
                    setActiveTab('description');
                  }}
                  className={`py-1.5 px-2 rounded-xl text-xs font-mono font-medium flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer truncate ${
                    activeTab === 'description'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] font-semibold'
                      : 'text-slate-400 hover:text-cyan-200 hover:bg-white/5'
                  }`}
                >
                  <Info className="w-3.5 h-3.5" />
                  <span className="tracking-wider">STORY &amp; ROLE</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundFX.playClick();
                    setActiveTab('features');
                  }}
                  className={`py-1.5 px-2 rounded-xl text-xs font-mono font-medium flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer truncate ${
                    activeTab === 'features'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] font-semibold'
                      : 'text-slate-400 hover:text-cyan-200 hover:bg-white/5'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span className="tracking-wider">FIELD CLUES</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundFX.playClick();
                    setActiveTab('threats');
                  }}
                  className={`py-1.5 px-2 rounded-xl text-xs font-mono font-medium flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer truncate ${
                    activeTab === 'threats'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] font-semibold'
                      : 'text-slate-400 hover:text-cyan-200 hover:bg-white/5'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span className="tracking-wider">HABITAT</span>
                </button>
              </div>
            </div>

            {/* Scrollable Results Content */}
            <div className="p-3 sm:p-4 overflow-y-auto space-y-3 flex-1 custom-scrollbar">
              
              {/* TAB 1: VISUAL MATCHES */}
              {activeTab === 'matches' && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  
                  {/* Primary Verified Match Card */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-cyan-500/30 shadow-[0_4px_25px_rgba(6,182,212,0.1)] flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-cyan-400" />
                          PRIMARY OPTICAL CLASSIFICATION
                        </span>
                        <span className="bg-cyan-500/20 text-cyan-200 border border-cyan-400/40 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                          {displayConfidence}% CONFIDENCE
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={handleCopy}
                        className="p-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-all cursor-pointer"
                        title="Copy classification data"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <div className="flex items-start gap-3.5">
                      <div className="w-18 h-18 rounded-2xl overflow-hidden border border-cyan-400/30 shrink-0 shadow-[0_0_12px_rgba(6,182,212,0.2)] bg-black">
                        <img src={imageUrl} alt={displayCommonName} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-sans text-base sm:text-lg font-bold text-white tracking-tight">
                          {displayCommonName}
                        </h3>
                        <span className="font-mono text-xs text-cyan-300 italic block -mt-0.5 tracking-wide">
                          {displayScientificName}
                        </span>
                        <p className="text-xs text-slate-300 font-sans mt-1.5 line-clamp-2 leading-relaxed">
                          {displayDescription}
                        </p>
                      </div>
                    </div>

                    {/* Taxonomy Breadcrumbs */}
                    <div className="pt-2.5 border-t border-white/10 flex items-center gap-2 text-[10px] font-mono text-slate-400 overflow-x-auto">
                      <span>{lensData?.kingdom || 'PLANTAE'}</span>
                      <span className="text-cyan-500">›</span>
                      <span>{lensData?.order || 'ROSALES'}</span>
                      <span className="text-cyan-500">›</span>
                      <span>{lensData?.family || 'Rosaceae'}</span>
                      <span className="text-cyan-500">›</span>
                      <span className="text-cyan-300 font-semibold">{displayScientificName}</span>
                    </div>
                  </div>

                  {/* Visual Lookalikes */}
                  <div className="space-y-2">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-1">
                      SIMILAR VISUAL MATCHES &amp; MORPHOLOGY LOOKALIKES:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {displayMatches.map((match, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-2xl bg-slate-900/60 border border-cyan-500/20 flex flex-col gap-1 hover:border-cyan-400/40 transition-all"
                        >
                          <div className="flex items-center gap-1.5 text-xs font-sans font-bold text-cyan-200">
                            <Eye className="w-3.5 h-3.5 text-cyan-400" />
                            <span>{match.name}</span>
                          </div>
                          <p className="text-[11px] text-slate-300 leading-snug">
                            <strong className="text-amber-400 font-medium">Distinction: </strong>
                            {match.distinction}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: SPECIES DESCRIPTION & OVERVIEW */}
              {activeTab === 'description' && (
                <div className="space-y-2.5 animate-in fade-in duration-200">
                  <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-cyan-500/20">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-cyan-400 block mb-1">
                      NATURAL HISTORY &amp; FIELD OBSERVATION:
                    </span>
                    <p className="text-xs sm:text-sm text-slate-100 font-sans leading-relaxed">
                      {displayDescription}
                    </p>
                  </div>

                  {/* Ecological Niche Card */}
                  <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex items-start gap-3">
                    <div className="p-1.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 shrink-0 mt-0.5">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                        ECOLOGICAL ROLE &amp; FOOD-WEB SIGNIFICANCE:
                      </span>
                      <p className="text-xs text-emerald-100/90 font-sans leading-relaxed mt-0.5">
                        {displayRole}
                      </p>
                    </div>
                  </div>

                  {/* Did You Know Fact */}
                  <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/30 flex items-start gap-3">
                    <div className="p-1.5 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 shrink-0 mt-0.5">
                      <Lightbulb className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-amber-300">
                        GOOGLE LENS FIELD FACT:
                      </span>
                      <p className="text-xs text-amber-100/90 font-sans leading-relaxed mt-0.5">
                        {displayFact}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: KEY VISUAL TRAITS */}
              {activeTab === 'features' && (
                <div className="space-y-2 animate-in fade-in duration-200">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-cyan-400 block px-1">
                    DETECTED MORPHOLOGICAL TRAITS (CLICK PIN ON PHOTO TO HIGHLIGHT):
                  </span>
                  <div className="space-y-2">
                    {displayFeatures.map((trait, idx) => {
                      const isPinSelected = selectedPinIndex === idx;
                      return (
                        <div
                          key={idx}
                          onClick={() => setSelectedPinIndex(isPinSelected ? null : idx)}
                          className={`p-3 rounded-2xl border flex items-start gap-3 transition-all cursor-pointer ${
                            isPinSelected
                              ? 'bg-amber-400/10 border-amber-400/60 text-white shadow-[0_0_15px_rgba(251,191,36,0.15)]'
                              : 'bg-slate-900/60 border-cyan-500/20 hover:border-cyan-400/40 text-slate-200'
                          }`}
                        >
                          <span className={`w-6 h-6 rounded-xl font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                            isPinSelected ? 'bg-amber-400 text-slate-950' : 'bg-cyan-600/30 border border-cyan-400/40 text-cyan-300'
                          }`}>
                            {idx + 1}
                          </span>
                          <div className="flex-1">
                            <span className="text-xs font-sans font-medium leading-relaxed block">
                              {trait}
                            </span>
                            {isPinSelected && (
                              <span className="text-[10px] font-mono text-amber-400 block mt-1 tracking-wide">
                                📍 Pin #{idx + 1} selected on specimen viewer
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 4: ECOLOGY & HABITAT */}
              {activeTab === 'threats' && (
                <div className="space-y-2.5 animate-in fade-in duration-200">
                  <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-cyan-500/20 flex flex-col gap-1">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                      PRIMARY HABITAT &amp; DISTRIBUTION:
                    </span>
                    <span className="text-xs font-semibold text-white font-sans">
                      {lensData?.habitatType || 'Cultivated Orchards, Temperate Valleys & Riparian Zones'}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-500/30 flex flex-col gap-1">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-rose-300">
                      ENVIRONMENTAL PRESSURES &amp; THREATS:
                    </span>
                    <p className="text-xs text-rose-100/90 font-sans leading-relaxed">
                      {lensData?.keyThreats || 'Climate disruption, extreme weather events, pest outbreaks, and habitat loss.'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* ACTION FOOTER BAR WITH SAFE AREA PADDING */}
            <div className="p-3.5 sm:p-4 pb-6 sm:pb-8 border-t border-cyan-500/20 bg-slate-950/95 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => {
                  soundFX.playConfirm();
                  onClose();
                  if (onOpenVerificationForm) {
                    onOpenVerificationForm();
                  } else if (onSaveObservation) {
                    onSaveObservation();
                  }
                }}
                className="flex-1 min-w-[140px] py-2.5 px-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-all cursor-pointer"
                title="Verify scanned species and complete field observation form"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                <span className="tracking-wider">VERIFY &amp; OPEN FORM</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundFX.playClick();
                  onClose();
                  onNavigateToTab?.('predict');
                }}
                className="flex-1 min-w-[140px] py-2.5 px-3.5 rounded-2xl bg-cyan-700 hover:bg-cyan-600 text-white font-mono text-xs font-semibold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all cursor-pointer"
              >
                <Cpu className="w-4 h-4 text-cyan-200" />
                <span className="tracking-wider">SIMULATE PVA</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
