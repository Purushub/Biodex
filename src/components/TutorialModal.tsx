/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Compass,
  Scan,
  BookOpen,
  LineChart,
  Sparkles,
  Sliders,
  Database,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  X,
  ArrowRight,
  ExternalLink,
  Info,
  Layers,
  Leaf,
  Activity,
  Award,
  Lock,
  Camera,
  MapPin,
  TrendingUp,
  Cpu,
  ShieldCheck,
  Globe,
  Tag,
  Eye,
} from 'lucide-react';
import { soundFX } from '../utils/audio';
import { ChassisTheme, NavTab } from '../types';
import { getThemeConfig } from '../utils/theme';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: ChassisTheme;
  onNavigateToTab?: (tab: NavTab) => void;
}

interface PictorialAnnotation {
  x: string; // percentage
  y: string; // percentage
  label: string;
  sublabel: string;
  arrowDirection: 'top' | 'bottom' | 'left' | 'right';
  badgeColor: string;
}

interface TutorialStep {
  id: string;
  stepNumber: number;
  badge: string;
  title: string;
  tagline: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  summary: string;
  diagramTitle: string;
  diagramSubtitle: string;
  diagramType: 'scanner' | 'biodex' | 'auth_save' | 'pva_levers' | 'cloud_sync';
  annotations: PictorialAnnotation[];
  keyActions: {
    label: string;
    description: string;
  }[];
  interactiveTip: string;
  targetTab?: NavTab;
  tabActionLabel?: string;
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 'scanner',
    stepNumber: 1,
    badge: 'STEP 1 // NATURE VISION SCANNER',
    title: 'Google Lens Optical Scanner & Instant Identification',
    tagline: 'Point device camera, upload field photos, or select 1-click specimens from Jaipur & global preserves.',
    icon: Scan,
    accentColor: 'from-cyan-500 via-teal-500 to-blue-600',
    summary:
      'The BioDex Scanner utilizes neural vision matching to classify flora and fauna instantaneously. It reveals taxonomy, vital population statistics, and ecological niches.',
    diagramTitle: 'OPTICAL VIEWFINDER & CLASSIFICATION RETICLE',
    diagramSubtitle: 'Live sensor telemetry with annotated optical targeting overlays',
    diagramType: 'scanner',
    annotations: [
      {
        x: '18%',
        y: '22%',
        label: 'OPTICAL RETICLE',
        sublabel: 'TensorFlow MobileNet neural focus',
        arrowDirection: 'bottom',
        badgeColor: 'bg-cyan-500 text-slate-950',
      },
      {
        x: '76%',
        y: '28%',
        label: 'AI MATCH CONFIDENCE',
        sublabel: '98.6% - 99.8% precision score',
        arrowDirection: 'left',
        badgeColor: 'bg-emerald-500 text-slate-950',
      },
      {
        x: '24%',
        y: '76%',
        label: 'JAIPUR & INDIA PRESETS',
        sublabel: 'Leopard, Khejri, Peafowl, Tiger',
        arrowDirection: 'top',
        badgeColor: 'bg-amber-400 text-slate-950',
      },
      {
        x: '78%',
        y: '76%',
        label: 'GOOGLE LENS DOSSIER',
        sublabel: 'Ecological role, diet & lookalikes',
        arrowDirection: 'left',
        badgeColor: 'bg-blue-500 text-white',
      },
    ],
    keyActions: [
      {
        label: 'Live Camera & Photo Upload',
        description: 'Point your camera or upload field captures to initiate computer vision classification.',
      },
      {
        label: 'Regional Species Presets',
        description: 'Tap Jaipur/India presets (Indian Leopard, Khejri, Tiger) or global specimens for instant analysis.',
      },
      {
        label: 'Dossier Audio Voiceover',
        description: 'Listen to spoken scientific pronunciations and behavioral characteristics.',
      },
    ],
    interactiveTip: 'Use the 4 Regional + 2 Intl language selector to study species names in Hindi, Rajasthani, or English!',
    targetTab: 'scanner',
    tabActionLabel: 'Open Camera Scanner →',
  },
  {
    id: 'auth_save',
    stepNumber: 2,
    badge: 'STEP 2 // VERIFICATION & SECURE SAVE',
    title: 'Authenticated Species Logging (Logged-in Only)',
    tagline: 'Only authenticated naturalists can record verified specimens into the permanent register.',
    icon: Lock,
    accentColor: 'from-amber-500 via-orange-500 to-rose-600',
    summary:
      'To maintain strict scientific data integrity, saving species observations to the permanent BioDex register requires signing in. Guests can freely test and simulate, but formal record persistence is restricted to verified accounts.',
    diagramTitle: '20-FIELD PBR VERIFICATION & ACCESS CONTROL',
    diagramSubtitle: 'Strict user authentication gate protecting cloud biodiversity database',
    diagramType: 'auth_save',
    annotations: [
      {
        x: '20%',
        y: '24%',
        label: 'SIGN IN REQUIRED',
        sublabel: 'Google account authentication gate',
        arrowDirection: 'bottom',
        badgeColor: 'bg-rose-500 text-white',
      },
      {
        x: '78%',
        y: '28%',
        label: 'UNIQUE RECORD ID',
        sublabel: 'REC-2026-XXXX audit sequence',
        arrowDirection: 'left',
        badgeColor: 'bg-cyan-500 text-slate-950',
      },
      {
        x: '25%',
        y: '74%',
        label: '20-FIELD SOP COMPLIANCE',
        sublabel: 'GPS, habitat, census, disturbance',
        arrowDirection: 'top',
        badgeColor: 'bg-amber-400 text-slate-950',
      },
      {
        x: '76%',
        y: '74%',
        label: 'FIRESTORE PERSISTENCE',
        sublabel: 'Stored under student user UID',
        arrowDirection: 'left',
        badgeColor: 'bg-emerald-500 text-slate-950',
      },
    ],
    keyActions: [
      {
        label: 'One-Click Google Sign-In',
        description: 'Log in with your email to unlock observation registration and cloud synchronization.',
      },
      {
        label: '20-Field Verification',
        description: 'Review species name, coordinates, census counts, and disturbance levels before committing.',
      },
      {
        label: 'Permanent BioDex Protection',
        description: 'Guest sessions are prevented from overwriting official conservation records.',
      },
    ],
    interactiveTip: 'Click "Sign In" in the header or on the observation form to link your findings to your identity.',
    targetTab: 'scanner',
    tabActionLabel: 'View Observation Form →',
  },
  {
    id: 'pva_levers',
    stepNumber: 3,
    badge: 'STEP 3 // EXTINCTION PREDICTOR',
    title: 'Extinction Horizon & Population Viability (PVA)',
    tagline: 'Simulate demographic trajectories and adjust conservation levers to prevent collapse.',
    icon: LineChart,
    accentColor: 'from-rose-500 via-red-500 to-amber-600',
    summary:
      'The AI Extinction Trajectory Model calculates the unmitigated collapse year and extinction risk percentage based on mathematical population viability analysis.',
    diagramTitle: 'PVA TRAJECTORY ENGINE & INTERVENTION LEVERS',
    diagramSubtitle: 'Real-time curve bending: unmitigated crash vs. managed recovery trajectory',
    diagramType: 'pva_levers',
    annotations: [
      {
        x: '18%',
        y: '22%',
        label: 'HAZARD GAUGE',
        sublabel: 'Real-time extinction risk percentage',
        arrowDirection: 'bottom',
        badgeColor: 'bg-rose-500 text-white',
      },
      {
        x: '75%',
        y: '25%',
        label: 'COLLAPSE HORIZON',
        sublabel: 'Estimated year of ecological loss',
        arrowDirection: 'left',
        badgeColor: 'bg-amber-400 text-slate-950',
      },
      {
        x: '25%',
        y: '75%',
        label: 'PRAIRIE BUFFER SLIDER',
        sublabel: 'Expand habitat corridors (0 - 50%)',
        arrowDirection: 'top',
        badgeColor: 'bg-emerald-500 text-slate-950',
      },
      {
        x: '78%',
        y: '75%',
        label: 'INVASIVE REMOVAL RATE',
        sublabel: 'Monthly plant eradication (10 - 95%)',
        arrowDirection: 'left',
        badgeColor: 'bg-cyan-500 text-slate-950',
      },
    ],
    keyActions: [
      {
        label: 'Adjust Restoration Levers',
        description: 'Move buffer expansion and invasive plant removal sliders to observe immediate curve changes.',
      },
      {
        label: 'Compare Trajectory Lines',
        description: 'Red dashed line represents unmitigated collapse; green solid line represents your recovery plan.',
      },
      {
        label: 'Calculate Rebound Target',
        description: 'Target demographic levels needed to achieve long-term genetic resilience.',
      },
    ],
    interactiveTip: 'Watch how expanding corridors by just 25% extends the extinction horizon by over 30 years!',
    targetTab: 'predict',
    tabActionLabel: 'Run Extinction Predictor →',
  },
  {
    id: 'biodex',
    stepNumber: 4,
    badge: 'STEP 4 // HABITATS & JAIPUR SANCTUARIES',
    title: 'Habitat Mapping: Jaipur, Rajasthan & Global Preserves',
    tagline: 'Explore Jhalana Leopard Reserve, Nahargarh, Keoladeo Ghana, and tallgrass corridors.',
    icon: BookOpen,
    accentColor: 'from-emerald-500 via-teal-500 to-cyan-600',
    summary:
      'Browse geo-referenced wildlife corridors with integrity scores, dominant flora/fauna, and human disturbance ratings. Connects urban Jaipur habitats directly to the regional biodiversity index.',
    diagramTitle: 'GEO-SPATIAL HABITAT MATRIX & SIGHTINGS PINS',
    diagramSubtitle: 'Aravalli scrub, wetland fens, and oak savannas with GPS coordinates',
    diagramType: 'biodex',
    annotations: [
      {
        x: '20%',
        y: '22%',
        label: 'JHALANA LEOPARD RESERVE',
        sublabel: 'Jaipur, Rajasthan (26.85°N, 75.82°E)',
        arrowDirection: 'bottom',
        badgeColor: 'bg-amber-400 text-slate-950',
      },
      {
        x: '78%',
        y: '25%',
        label: 'INTEGRITY SCORE (89%)',
        sublabel: 'High biodiversity resilience index',
        arrowDirection: 'left',
        badgeColor: 'bg-emerald-500 text-slate-950',
      },
      {
        x: '24%',
        y: '76%',
        label: 'NAHARGARH BIOLOGICAL PARK',
        sublabel: 'Khejri tree & Chinkara gazelles',
        arrowDirection: 'top',
        badgeColor: 'bg-cyan-500 text-slate-950',
      },
      {
        x: '76%',
        y: '76%',
        label: 'FIELD SIGHTINGS PINS',
        sublabel: 'Verified GPS census observations',
        arrowDirection: 'left',
        badgeColor: 'bg-purple-400 text-slate-950',
      },
    ],
    keyActions: [
      {
        label: 'Jaipur & India Habitats',
        description: 'Select Jhalana, Nahargarh, Keoladeo, or Ranthambore to load associated keystone species.',
      },
      {
        label: 'Survey Density Radar',
        description: 'Inspect verified surveys count, optimal visiting hours, and human disturbance pressures.',
      },
      {
        label: 'Interactive Google Maps Link',
        description: 'Launch external navigation to precise GPS coordinates for ground fieldwork.',
      },
    ],
    interactiveTip: 'Filter by "Habitats" in the top bar to inspect regional species distributions on the interactive map.',
    targetTab: 'map',
    tabActionLabel: 'Explore Habitats Map →',
  },
  {
    id: 'cloud-pbr',
    stepNumber: 5,
    badge: 'STEP 5 // CLOUD REGISTER & AUDIT',
    title: 'Google Cloud Firestore Sync & Standardized Reports',
    tagline: 'Synchronize field observations to Firestore and generate audit-ready PDF dossiers.',
    icon: Database,
    accentColor: 'from-purple-500 via-indigo-500 to-blue-600',
    summary:
      'Every verified species entry is saved to Google Cloud Firestore, enabling multi-student field sharing and professional WWF survey reports.',
    diagramTitle: 'MULTI-USER CLOUD PERSISTENCE ARCHITECTURE',
    diagramSubtitle: 'Google Cloud Firestore real-time sync with PDF export generation',
    diagramType: 'cloud_sync',
    annotations: [
      {
        x: '18%',
        y: '22%',
        label: 'STUDENT GUEST ID',
        sublabel: 'Tagged with observer credentials',
        arrowDirection: 'bottom',
        badgeColor: 'bg-cyan-500 text-slate-950',
      },
      {
        x: '76%',
        y: '24%',
        label: 'FIRESTORE CLOUD DB',
        sublabel: 'Persistent, zero-data-loss storage',
        arrowDirection: 'left',
        badgeColor: 'bg-emerald-500 text-slate-950',
      },
      {
        x: '24%',
        y: '75%',
        label: 'PDF FIELD REPORT',
        sublabel: 'Standardized WWF field audit sheet',
        arrowDirection: 'top',
        badgeColor: 'bg-purple-400 text-slate-950',
      },
      {
        x: '78%',
        y: '75%',
        label: 'CLASSROOM REAL-TIME SYNC',
        sublabel: 'Team observation aggregation',
        arrowDirection: 'left',
        badgeColor: 'bg-amber-400 text-slate-950',
      },
    ],
    keyActions: [
      {
        label: 'Automatic Cloud Backup',
        description: 'Observations are backed up to Firestore instantly upon verification.',
      },
      {
        label: 'Export PDF Reports',
        description: 'Generate formatted field dossiers with graphs, maps, and observation notes.',
      },
      {
        label: 'Classroom Collaboration',
        description: 'Share species sightings with fellow scouts across different sectors.',
      },
    ],
    interactiveTip: 'Visit the Reports tab to download and print your official WWF Biodiversity field certificate.',
    targetTab: 'reports',
    tabActionLabel: 'View Field Reports →',
  },
];

export const TutorialModal: React.FC<TutorialModalProps> = ({
  isOpen,
  onClose,
  theme = 'ruby',
  onNavigateToTab,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'pictorial' | 'details'>('pictorial');
  const themeCfg = getThemeConfig(theme);

  if (!isOpen) return null;

  const currentStep = TUTORIAL_STEPS[currentStepIndex];
  const StepIcon = currentStep.icon;
  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === TUTORIAL_STEPS.length - 1;

  const handleNext = () => {
    soundFX.playClick();
    if (!isLast) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      soundFX.playConfirm();
      onClose();
    }
  };

  const handlePrev = () => {
    soundFX.playClick();
    if (!isFirst) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleJumpToTab = (tab?: NavTab) => {
    if (!tab || !onNavigateToTab) return;
    soundFX.playConfirm();
    onNavigateToTab(tab);
    onClose();
  };

  // Render the tailored pictorial diagram for the current step
  const renderPictorialDiagram = () => {
    switch (currentStep.diagramType) {
      case 'scanner':
        return (
          <div className="relative w-full aspect-[16/9] max-h-[260px] sm:max-h-[300px] rounded-xl overflow-hidden bg-slate-950 border-2 border-cyan-500/40 shadow-inner flex items-center justify-center select-none">
            {/* Background simulated specimen image */}
            <img
              src="https://images.unsplash.com/photo-1456926631375-92c8ce872def?auto=format&fit=crop&w=800&q=80"
              alt="Indian Leopard in Jhalana Reserve"
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

            {/* Grid & Scanning Line Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#06b6d4] animate-pulse" />

            {/* Camera Reticle Corners */}
            <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-cyan-400" />
            <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-cyan-400" />
            <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-cyan-400" />
            <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-cyan-400" />

            {/* Central Targeting Box */}
            <div className="relative z-10 w-28 h-28 border-2 border-dashed border-cyan-300 rounded-xl flex flex-col items-center justify-center p-2 bg-black/40 backdrop-blur-xs">
              <Eye className="w-6 h-6 text-cyan-400 animate-pulse" />
              <span className="text-[9px] font-telemetry font-bold text-cyan-200 mt-1 uppercase">
                TARGET LOCKED
              </span>
            </div>

            {/* SVG Interactive Arrows & Callouts */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
              <defs>
                <marker id="cyan-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#06b6d4" />
                </marker>
                <marker id="emerald-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
                </marker>
              </defs>
              {/* Arrow from top left badge to center reticle */}
              <path d="M 120 40 L 170 85" stroke="#06b6d4" strokeWidth="2" strokeDasharray="3,3" markerEnd="url(#cyan-arrow)" />
              {/* Arrow from right badge to center */}
              <path d="M 360 65 L 290 95" stroke="#10b981" strokeWidth="2" strokeDasharray="3,3" markerEnd="url(#emerald-arrow)" />
            </svg>

            {/* Callout Badges with Arrows and Labels */}
            <div className="absolute top-2.5 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-950/90 border border-cyan-400/60 shadow-lg text-[10px] font-telemetry">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="font-bold text-cyan-200">POINT &amp; RETICLE FOCUS</span>
            </div>

            <div className="absolute top-2.5 right-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/90 border border-emerald-400/60 shadow-lg text-[10px] font-telemetry">
              <span className="font-bold text-emerald-300">AI MATCH: 99.1% (Panthera pardus)</span>
            </div>

            <div className="absolute bottom-2.5 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-950/90 border border-amber-400/60 shadow-lg text-[10px] font-telemetry">
              <span>🇮🇳</span>
              <span className="font-bold text-amber-300">JAIPUR PRESET // JHALANA RESERVE</span>
            </div>

            <div className="absolute bottom-2.5 right-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-950/90 border border-blue-400/60 shadow-lg text-[10px] font-telemetry">
              <span className="font-bold text-blue-300">IUCN: VULNERABLE</span>
            </div>
          </div>
        );

      case 'auth_save':
        return (
          <div className="relative w-full aspect-[16/9] max-h-[260px] sm:max-h-[300px] rounded-xl overflow-hidden bg-slate-950 border-2 border-amber-500/40 shadow-inner flex items-center justify-center select-none p-4">
            {/* Visual Auth Diagram with Arrows */}
            <div className="w-full max-w-md flex items-center justify-between gap-3 relative z-10">
              {/* Box 1: Guest Scan */}
              <div className="flex-1 p-3 rounded-xl bg-slate-900/90 border border-slate-700 text-center flex flex-col items-center">
                <Camera className="w-6 h-6 text-slate-400 mb-1" />
                <span className="font-telemetry font-bold text-[11px] text-slate-200">1. FIELD SCAN</span>
                <span className="text-[9px] text-slate-400 mt-0.5">Open to all students</span>
                <span className="mt-1.5 text-[8px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                  GUEST ALLOWED
                </span>
              </div>

              {/* Connecting Arrow */}
              <div className="flex flex-col items-center justify-center shrink-0">
                <div className="w-8 h-0.5 bg-amber-400 relative">
                  <ArrowRight className="w-4 h-4 text-amber-400 absolute -right-2 -top-2" />
                </div>
                <span className="text-[8px] font-mono text-amber-300 mt-2 font-bold">COMMIT</span>
              </div>

              {/* Box 2: Auth Gate (Security Lock) */}
              <div className="flex-1 p-3 rounded-xl bg-amber-950/90 border-2 border-amber-400 text-center flex flex-col items-center shadow-[0_0_20px_rgba(245,158,11,0.2)] scale-105">
                <Lock className="w-6 h-6 text-amber-400 mb-1 animate-bounce" />
                <span className="font-telemetry font-bold text-[11px] text-amber-200">2. AUTH GATE</span>
                <span className="text-[9px] text-amber-300/80 mt-0.5">Google account login</span>
                <span className="mt-1.5 text-[8px] font-extrabold px-1.5 py-0.5 rounded bg-amber-400 text-slate-950">
                  REQUIRED TO SAVE
                </span>
              </div>

              {/* Connecting Arrow */}
              <div className="flex flex-col items-center justify-center shrink-0">
                <div className="w-8 h-0.5 bg-emerald-400 relative">
                  <ArrowRight className="w-4 h-4 text-emerald-400 absolute -right-2 -top-2" />
                </div>
                <span className="text-[8px] font-mono text-emerald-300 mt-2 font-bold">VERIFY</span>
              </div>

              {/* Box 3: Permanent Register */}
              <div className="flex-1 p-3 rounded-xl bg-emerald-950/90 border border-emerald-400 text-center flex flex-col items-center">
                <Database className="w-6 h-6 text-emerald-400 mb-1" />
                <span className="font-telemetry font-bold text-[11px] text-emerald-200">3. BIODEX DB</span>
                <span className="text-[9px] text-emerald-300/80 mt-0.5">20-Field SOP Firestore</span>
                <span className="mt-1.5 text-[8px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                  STORED PERMANENT
                </span>
              </div>
            </div>

            {/* Bottom Label Bar */}
            <div className="absolute bottom-2 inset-x-3 py-1 px-2.5 rounded-lg bg-black/60 border border-white/10 flex items-center justify-between text-[10px] font-telemetry">
              <span className="text-amber-300 font-bold flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-amber-400" />
                Guest Mode: Explore &amp; Simulate Only
              </span>
              <span className="text-emerald-400 font-bold">
                Logged-In Mode: Official BioDex Recording Active ✓
              </span>
            </div>
          </div>
        );

      case 'pva_levers':
        return (
          <div className="relative w-full aspect-[16/9] max-h-[260px] sm:max-h-[300px] rounded-xl overflow-hidden bg-slate-950 border-2 border-rose-500/40 shadow-inner flex flex-col justify-between p-3 select-none">
            {/* Top Stats Bar */}
            <div className="flex items-center justify-between text-[10px] font-telemetry z-10">
              <div className="px-2 py-0.5 rounded bg-rose-950/90 border border-rose-500/60 text-rose-300 font-bold flex items-center gap-1">
                <span>RISK: 74.2%</span>
                <span className="text-[8px] opacity-75">(CRITICAL)</span>
              </div>
              <div className="px-2 py-0.5 rounded bg-amber-950/90 border border-amber-500/60 text-amber-300 font-bold">
                UNMITIGATED COLLAPSE: 2038
              </div>
              <div className="px-2 py-0.5 rounded bg-emerald-950/90 border border-emerald-500/60 text-emerald-300 font-bold flex items-center gap-1">
                <span>MANAGED EXTENSION: +32 YRS</span>
              </div>
            </div>

            {/* Trajectory Simulation Curve SVG */}
            <div className="relative flex-1 my-1">
              <svg className="w-full h-full" viewBox="0 0 400 120" preserveAspectRatio="none">
                {/* Horizontal Threshold Line */}
                <line x1="20" y1="90" x2="380" y2="90" stroke="#f43f5e" strokeWidth="1" strokeDasharray="4,4" />
                <text x="25" y="85" fill="#f43f5e" fontSize="9" fontFamily="monospace">COLLAPSE FLOOR</text>

                {/* Crash Curve (Red dashed) */}
                <path d="M 30 20 Q 150 40 220 90 T 360 110" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="5,3" />

                {/* Recovery Curve with Levers (Green solid) */}
                <path d="M 30 20 Q 120 50 200 65 T 370 35" fill="none" stroke="#10b981" strokeWidth="3" />

                {/* Arrow pointing to recovery curve */}
                <path d="M 270 15 L 290 32" stroke="#10b981" strokeWidth="2" markerEnd="url(#emerald-arrow)" />
                <text x="230" y="12" fill="#10b981" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
                  RECOVERY INTERVENTION
                </text>
              </svg>
            </div>

            {/* Interactive Levers Control Bar (Pictorial) */}
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/10 z-10">
              <div className="p-1.5 rounded bg-slate-900/80 border border-emerald-500/30 flex items-center justify-between text-[10px] font-telemetry">
                <span className="text-emerald-300 font-bold flex items-center gap-1">
                  <span>◀</span> BUFFER EXPANSION: 25% <span>▶</span>
                </span>
                <span className="text-[9px] text-emerald-400 font-mono">+12% Corridors</span>
              </div>
              <div className="p-1.5 rounded bg-slate-900/80 border border-cyan-500/30 flex items-center justify-between text-[10px] font-telemetry">
                <span className="text-cyan-300 font-bold flex items-center gap-1">
                  <span>◀</span> INVASIVE REMOVAL: 60% <span>▶</span>
                </span>
                <span className="text-[9px] text-cyan-400 font-mono">-18% Risk</span>
              </div>
            </div>
          </div>
        );

      case 'biodex':
        return (
          <div className="relative w-full aspect-[16/9] max-h-[260px] sm:max-h-[300px] rounded-xl overflow-hidden bg-slate-950 border-2 border-emerald-500/40 shadow-inner p-3 flex flex-col justify-between select-none">
            {/* Jaipur & India Map Schematic with Callout Pins */}
            <div className="flex items-center justify-between border-b border-white/10 pb-1.5 text-[10px] font-telemetry">
              <span className="text-emerald-300 font-bold flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                JAIPUR, RAJASTHAN &amp; INDIA SANCTUARY MATRIX
              </span>
              <span className="text-slate-400">4 REGIONAL BIOTOPES</span>
            </div>

            {/* 4 Sanctuary Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 flex-1 my-1.5">
              <div className="p-2 rounded-lg bg-slate-900/90 border border-amber-500/40 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-bold text-amber-400 block font-telemetry">JAIPUR</span>
                  <strong className="text-[11px] text-white block leading-tight">Jhalana Reserve</strong>
                  <span className="text-[9px] text-slate-300 block mt-0.5">Indian Leopard &amp; Nilgai</span>
                </div>
                <div className="flex items-center justify-between mt-1 text-[8px] font-mono text-emerald-400">
                  <span>SCORE 89%</span>
                  <span>0.5 km</span>
                </div>
              </div>

              <div className="p-2 rounded-lg bg-slate-900/90 border border-cyan-500/40 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-bold text-cyan-400 block font-telemetry">JAIPUR</span>
                  <strong className="text-[11px] text-white block leading-tight">Nahargarh Park</strong>
                  <span className="text-[9px] text-slate-300 block mt-0.5">Khejri &amp; Chinkara</span>
                </div>
                <div className="flex items-center justify-between mt-1 text-[8px] font-mono text-emerald-400">
                  <span>SCORE 85%</span>
                  <span>2.3 km</span>
                </div>
              </div>

              <div className="p-2 rounded-lg bg-slate-900/90 border border-blue-500/40 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-bold text-blue-400 block font-telemetry">CORRIDOR</span>
                  <strong className="text-[11px] text-white block leading-tight">Keoladeo Ghana</strong>
                  <span className="text-[9px] text-slate-300 block mt-0.5">Sarus Crane &amp; Stork</span>
                </div>
                <div className="flex items-center justify-between mt-1 text-[8px] font-mono text-emerald-400">
                  <span>SCORE 94%</span>
                  <span>8.4 km</span>
                </div>
              </div>

              <div className="p-2 rounded-lg bg-slate-900/90 border border-orange-500/40 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-bold text-orange-400 block font-telemetry">RAJASTHAN</span>
                  <strong className="text-[11px] text-white block leading-tight">Ranthambore</strong>
                  <span className="text-[9px] text-slate-300 block mt-0.5">Bengal Tiger &amp; Sambar</span>
                </div>
                <div className="flex items-center justify-between mt-1 text-[8px] font-mono text-emerald-400">
                  <span>SCORE 92%</span>
                  <span>14.1 km</span>
                </div>
              </div>
            </div>

            {/* Bottom Callout */}
            <div className="py-1 px-2 rounded bg-black/60 border border-white/10 flex items-center justify-between text-[9px] font-telemetry">
              <span className="text-cyan-300">Clicking any sanctuary automatically centers census radar and key species.</span>
              <span className="text-emerald-400 font-bold">GPS Geocoded ✓</span>
            </div>
          </div>
        );

      case 'cloud_sync':
        return (
          <div className="relative w-full aspect-[16/9] max-h-[260px] sm:max-h-[300px] rounded-xl overflow-hidden bg-slate-950 border-2 border-purple-500/40 shadow-inner p-3 flex flex-col justify-between select-none">
            {/* Top Title */}
            <div className="flex items-center justify-between border-b border-white/10 pb-1.5 text-[10px] font-telemetry">
              <span className="text-purple-300 font-bold flex items-center gap-1">
                <Database className="w-3.5 h-3.5 text-purple-400" />
                GOOGLE CLOUD FIRESTORE CLOUD INTEGRATION
              </span>
              <span className="text-emerald-400 font-mono text-[9px]">PROJECT ID: ai-studio-wwf...</span>
            </div>

            {/* Flow Diagram from App to Cloud to Audit PDF */}
            <div className="flex items-center justify-around gap-2 my-2 z-10">
              <div className="p-2 rounded-lg bg-slate-900/90 border border-cyan-500/40 text-center flex-1">
                <Scan className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
                <span className="text-[10px] font-bold text-cyan-200 block">1. Field Survey</span>
                <span className="text-[8px] text-slate-400 font-mono">20-Field SOP Entry</span>
              </div>

              <ArrowRight className="w-5 h-5 text-purple-400 shrink-0" />

              <div className="p-2 rounded-lg bg-purple-950/90 border-2 border-purple-400 text-center flex-1 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                <Database className="w-5 h-5 text-purple-300 mx-auto mb-1 animate-pulse" />
                <span className="text-[10px] font-bold text-purple-200 block">2. Firestore Sync</span>
                <span className="text-[8px] text-emerald-400 font-mono">Real-Time Write</span>
              </div>

              <ArrowRight className="w-5 h-5 text-emerald-400 shrink-0" />

              <div className="p-2 rounded-lg bg-emerald-950/90 border border-emerald-500/40 text-center flex-1">
                <Award className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                <span className="text-[10px] font-bold text-emerald-200 block">3. Audit PDF</span>
                <span className="text-[8px] text-slate-400 font-mono">Official WWF Report</span>
              </div>
            </div>

            {/* Bottom Callout */}
            <div className="py-1 px-2 rounded bg-black/60 border border-white/10 flex items-center justify-between text-[9px] font-telemetry">
              <span className="text-purple-300">All observations persist across reloads and multi-device field sessions.</span>
              <span className="text-emerald-400 font-bold">Zero Data Loss ✓</span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-2xl rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-2xl text-slate-900 flex flex-col max-h-[94vh] animate-in zoom-in-95 duration-200">
        {/* Terminal Header */}
        <div className="relative px-4 sm:px-5 py-3.5 border-b border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 shadow-sm flex items-center justify-center shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[9px] font-bold tracking-wider uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                  PICTORIAL FIELD MANUAL &amp; GUIDES
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  {currentStepIndex + 1} / {TUTORIAL_STEPS.length}
                </span>
              </div>
              <h2 className="font-sans text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                Naturalist Visual Guide with Arrows &amp; Labels
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle Button */}
            <div className="hidden sm:flex items-center bg-slate-100 border border-slate-200 rounded-lg p-0.5 text-[10px] font-mono">
              <button
                type="button"
                onClick={() => {
                  soundFX.playClick();
                  setViewMode('pictorial');
                }}
                className={`px-2 py-1 rounded transition-all cursor-pointer ${
                  viewMode === 'pictorial' ? 'bg-white text-slate-900 font-bold shadow-sm' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Pictorial Diagrams
              </button>
              <button
                type="button"
                onClick={() => {
                  soundFX.playClick();
                  setViewMode('details');
                }}
                className={`px-2 py-1 rounded transition-all cursor-pointer ${
                  viewMode === 'details' ? 'bg-white text-slate-900 font-bold shadow-sm' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Field Steps
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                soundFX.playCancel();
                onClose();
              }}
              className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
              aria-label="Close tutorial"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Step Roadmap Pipeline with Arrows */}
        <div className="px-3 sm:px-4 py-2 flex items-center justify-between gap-1 border-b border-white/10 bg-black/30 overflow-x-auto shrink-0">
          {TUTORIAL_STEPS.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            return (
              <React.Fragment key={step.id}>
                <button
                  type="button"
                  onClick={() => {
                    soundFX.playClick();
                    setCurrentStepIndex(idx);
                  }}
                  className={`py-1 px-2 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                    isCurrent
                      ? 'bg-cyan-500/20 border border-cyan-400/60 shadow-sm text-cyan-300 font-bold'
                      : isCompleted
                      ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300'
                      : 'hover:bg-white/5 opacity-50 text-slate-400'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full text-[9px] font-telemetry font-extrabold flex items-center justify-center ${
                      isCurrent
                        ? 'bg-cyan-400 text-slate-950 shadow'
                        : isCompleted
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-white/10 text-slate-300'
                    }`}
                  >
                    {isCompleted ? '✓' : step.stepNumber}
                  </span>
                  <span className="font-telemetry text-[10px] hidden md:inline truncate max-w-[80px]">
                    {step.id.replace('_', ' ').toUpperCase()}
                  </span>
                </button>

                {idx < TUTORIAL_STEPS.length - 1 && (
                  <ArrowRight className="w-3 h-3 text-white/20 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-3 sm:p-4 overflow-y-auto space-y-3.5 flex-1">
          {/* Header Info for Current Step */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className={`font-telemetry text-[10px] font-extrabold tracking-wider uppercase block mb-0.5 text-cyan-400`}>
                {currentStep.badge}
              </span>
              <h3 className="font-display text-base sm:text-lg font-extrabold tracking-tight leading-tight text-white">
                {currentStep.title}
              </h3>
              <p className="font-telemetry text-xs mt-0.5 text-slate-300 leading-snug">
                {currentStep.tagline}
              </p>
            </div>
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${currentStep.accentColor} p-2 shadow-md flex items-center justify-center shrink-0 text-white`}>
              <StepIcon className="w-5 h-5" />
            </div>
          </div>

          {/* PICTORIAL DIAGRAM CARD */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-telemetry">
              <span className="font-bold text-amber-400 flex items-center gap-1.5 uppercase">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                {currentStep.diagramTitle}
              </span>
              <span className="text-[10px] text-slate-400 hidden sm:inline">
                {currentStep.diagramSubtitle}
              </span>
            </div>

            {/* Render Tailored Pictorial Diagram */}
            {renderPictorialDiagram()}
          </div>

          {/* ANNOTATED LABELS & ARROWS BREAKDOWN */}
          <div className="space-y-2">
            <h4 className="font-telemetry text-[10px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-cyan-400" />
              ANNOTATED DIAGRAM LABELS &amp; POINTERS:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentStep.annotations.map((ann, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-xl border border-white/10 bg-slate-900/60 flex items-start gap-2 text-xs font-telemetry"
                >
                  <span className={`px-1.5 py-0.5 rounded font-extrabold text-[9px] shrink-0 ${ann.badgeColor}`}>
                    {ann.label}
                  </span>
                  <div className="min-w-0">
                    <span className="text-[11px] text-slate-300 block leading-tight">
                      {ann.sublabel}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Step Actions Checklist */}
          <div className="space-y-1.5">
            <h4 className="font-telemetry text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              SOP FIELD EXECUTION CHECKLIST:
            </h4>
            <div className="space-y-1.5">
              {currentStep.keyActions.map((action, i) => (
                <div
                  key={i}
                  className="p-2 rounded-lg border border-white/10 bg-black/30 flex items-start gap-2"
                >
                  <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold font-telemetry flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <div>
                    <h5 className="font-display text-xs font-bold text-white">
                      {action.label}
                    </h5>
                    <p className="font-telemetry text-[11px] text-slate-300 leading-snug">
                      {action.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pro Tip Box */}
          <div className="p-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-200 flex items-start gap-2">
            <Sparkles className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
            <div className="text-[11px] font-telemetry leading-snug">
              <strong className="font-bold uppercase text-[10px] block text-amber-300">
                PICTORIAL GUIDE TIP:
              </strong>
              {currentStep.interactiveTip}
            </div>
          </div>

          {/* Direct Tab Action Button */}
          {currentStep.targetTab && (
            <div>
              <button
                type="button"
                onClick={() => handleJumpToTab(currentStep.targetTab)}
                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 active:scale-98 text-white font-display text-xs font-bold border border-cyan-400/40 shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span>{currentStep.tabActionLabel}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Modal Navigation Footer */}
        <div className="px-4 sm:px-5 py-2.5 sm:py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={handlePrev}
            disabled={isFirst}
            className={`py-1.5 px-3.5 rounded-xl border border-slate-200 font-mono text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
              isFirst
                ? 'opacity-30 cursor-not-allowed bg-transparent text-slate-400'
                : 'bg-white hover:bg-slate-100 active:scale-95 text-slate-700 shadow-sm'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Prev</span>
          </button>

          <div className="flex items-center gap-1.5">
            {TUTORIAL_STEPS.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentStepIndex
                    ? 'w-5 bg-emerald-600'
                    : 'w-1.5 bg-slate-300'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="py-1.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer transition-all"
          >
            <span>{isLast ? 'Complete Guide' : 'Next Step'}</span>
            {isLast ? <CheckCircle2 className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
