import { ChassisTheme } from '../types';

export interface ThemeConfig {
  id: ChassisTheme;
  name: string;
  badge: string;
  swatchBg: string;
  isLight: boolean;

  // Global Page & Chassis
  chassisBg: string;
  chassisText: string;

  // Outer Bezel / Module Containers
  containerBg: string;
  containerBorder: string;
  containerShadow: string;

  // Primary Content Cards & Panels
  cardBg: string;
  cardBorder: string;
  cardHoverBorder: string;

  // Inner Recessed LCD / Observation Panes
  innerScreenBg: string;
  innerScreenBorder: string;
  innerScreenText: string;

  // Typography & Text Colors
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  fontClass: string;
  fontDisplay: string;

  // Accents & Buttons
  accentBg: string;
  accentHover: string;
  accentText: string;
  accentBorder: string;

  // Header & Bottom Navigation
  headerBg: string;
  headerBorder: string;
  headerSecondaryBg: string;
  headerSecondaryText: string;
  bottomNavBg: string;
  bottomNavBorder: string;
  bottomNavActive: string;
  bottomNavInactive: string;

  // Input & Filter Pills
  pillActiveBg: string;
  pillActiveText: string;
  pillInactiveBg: string;
  pillInactiveText: string;
  inputBg: string;
  inputBorder: string;
  inputText: string;
  inputPlaceholder: string;
}

export const THEME_CONFIGS: Record<ChassisTheme, ThemeConfig> = {
  ruby: {
    id: 'ruby',
    name: 'BioDex Bright Minimal',
    badge: 'DEFAULT',
    swatchBg: '#059669',
    isLight: true,

    chassisBg: 'bg-[#f8fafc]',
    chassisText: 'text-slate-900',

    containerBg: 'bg-white',
    containerBorder: 'border-slate-200',
    containerShadow: 'shadow-sm',

    cardBg: 'bg-white',
    cardBorder: 'border-slate-200',
    cardHoverBorder: 'hover:border-emerald-500',

    innerScreenBg: 'bg-slate-50',
    innerScreenBorder: 'border-slate-200',
    innerScreenText: 'text-slate-900',

    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-600',
    textMuted: 'text-slate-400',
    fontClass: 'font-sans',
    fontDisplay: 'font-display',

    accentBg: 'bg-[#059669]',
    accentHover: 'hover:bg-[#047857]',
    accentText: 'text-white',
    accentBorder: 'border-emerald-500',

    headerBg: 'bg-white/95',
    headerBorder: 'border-slate-200',
    headerSecondaryBg: 'bg-slate-100',
    headerSecondaryText: 'text-slate-700',

    bottomNavBg: 'bg-white/95',
    bottomNavBorder: 'border-slate-200',
    bottomNavActive: 'text-emerald-600 bg-emerald-50 font-bold',
    bottomNavInactive: 'text-slate-600 hover:text-slate-800',

    pillActiveBg: 'bg-slate-900',
    pillActiveText: 'text-white',
    pillInactiveBg: 'bg-slate-50',
    pillInactiveText: 'text-slate-600 hover:bg-slate-100',
    inputBg: 'bg-slate-50',
    inputBorder: 'border-slate-200 focus:border-emerald-500',
    inputText: 'text-slate-900',
    inputPlaceholder: 'placeholder:text-slate-400',
  },

  emerald: {
    id: 'emerald',
    name: 'Emerald Sanctuary',
    badge: 'ECO BRIGHT',
    swatchBg: '#10b981',
    isLight: true,

    chassisBg: 'bg-[#f8fafc]',
    chassisText: 'text-slate-900',

    containerBg: 'bg-white',
    containerBorder: 'border-slate-200',
    containerShadow: 'shadow-sm',

    cardBg: 'bg-white',
    cardBorder: 'border-slate-200',
    cardHoverBorder: 'hover:border-emerald-500',

    innerScreenBg: 'bg-emerald-50/50',
    innerScreenBorder: 'border-emerald-100',
    innerScreenText: 'text-slate-900',

    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-600',
    textMuted: 'text-slate-400',
    fontClass: 'font-sans',
    fontDisplay: 'font-display',

    accentBg: 'bg-[#059669]',
    accentHover: 'hover:bg-[#047857]',
    accentText: 'text-white',
    accentBorder: 'border-emerald-500',

    headerBg: 'bg-white/95',
    headerBorder: 'border-slate-200',
    headerSecondaryBg: 'bg-emerald-50',
    headerSecondaryText: 'text-emerald-800',

    bottomNavBg: 'bg-white/95',
    bottomNavBorder: 'border-slate-200',
    bottomNavActive: 'text-emerald-600 bg-emerald-50 font-bold',
    bottomNavInactive: 'text-slate-600 hover:text-slate-800',

    pillActiveBg: 'bg-emerald-600',
    pillActiveText: 'text-white',
    pillInactiveBg: 'bg-slate-50',
    pillInactiveText: 'text-slate-600 hover:bg-slate-100',
    inputBg: 'bg-slate-50',
    inputBorder: 'border-slate-200 focus:border-emerald-500',
    inputText: 'text-slate-900',
    inputPlaceholder: 'placeholder:text-slate-400',
  },

  gold: {
    id: 'gold',
    name: 'Amber Solar',
    badge: 'EXPEDITION',
    swatchBg: '#d97706',
    isLight: true,

    chassisBg: 'bg-[#f8fafc]',
    chassisText: 'text-slate-900',

    containerBg: 'bg-white',
    containerBorder: 'border-slate-200',
    containerShadow: 'shadow-sm',

    cardBg: 'bg-white',
    cardBorder: 'border-slate-200',
    cardHoverBorder: 'hover:border-amber-500',

    innerScreenBg: 'bg-amber-50/40',
    innerScreenBorder: 'border-amber-100',
    innerScreenText: 'text-slate-900',

    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-600',
    textMuted: 'text-slate-400',
    fontClass: 'font-sans',
    fontDisplay: 'font-display',

    accentBg: 'bg-[#d97706]',
    accentHover: 'hover:bg-[#b45309]',
    accentText: 'text-white',
    accentBorder: 'border-amber-500',

    headerBg: 'bg-white/95',
    headerBorder: 'border-slate-200',
    headerSecondaryBg: 'bg-amber-50',
    headerSecondaryText: 'text-amber-800',

    bottomNavBg: 'bg-white/95',
    bottomNavBorder: 'border-slate-200',
    bottomNavActive: 'text-amber-600 bg-amber-50 font-bold',
    bottomNavInactive: 'text-slate-600 hover:text-slate-800',

    pillActiveBg: 'bg-amber-600',
    pillActiveText: 'text-white',
    pillInactiveBg: 'bg-slate-50',
    pillInactiveText: 'text-slate-600 hover:bg-slate-100',
    inputBg: 'bg-slate-50',
    inputBorder: 'border-slate-200 focus:border-amber-500',
    inputText: 'text-slate-900',
    inputPlaceholder: 'placeholder:text-slate-400',
  },

  slate: {
    id: 'slate',
    name: 'Sapphire Horizon',
    badge: 'OCEANIC',
    swatchBg: '#2563eb',
    isLight: true,

    chassisBg: 'bg-[#f8fafc]',
    chassisText: 'text-slate-900',

    containerBg: 'bg-white',
    containerBorder: 'border-slate-200',
    containerShadow: 'shadow-sm',

    cardBg: 'bg-white',
    cardBorder: 'border-slate-200',
    cardHoverBorder: 'hover:border-blue-500',

    innerScreenBg: 'bg-blue-50/40',
    innerScreenBorder: 'border-blue-100',
    innerScreenText: 'text-slate-900',

    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-600',
    textMuted: 'text-slate-400',
    fontClass: 'font-sans',
    fontDisplay: 'font-display',

    accentBg: 'bg-[#2563eb]',
    accentHover: 'hover:bg-[#1d4ed8]',
    accentText: 'text-white',
    accentBorder: 'border-blue-500',

    headerBg: 'bg-white/95',
    headerBorder: 'border-slate-200',
    headerSecondaryBg: 'bg-blue-50',
    headerSecondaryText: 'text-blue-800',

    bottomNavBg: 'bg-white/95',
    bottomNavBorder: 'border-slate-200',
    bottomNavActive: 'text-blue-600 bg-blue-50 font-bold',
    bottomNavInactive: 'text-slate-600 hover:text-slate-800',

    pillActiveBg: 'bg-blue-600',
    pillActiveText: 'text-white',
    pillInactiveBg: 'bg-slate-50',
    pillInactiveText: 'text-slate-600 hover:bg-slate-100',
    inputBg: 'bg-slate-50',
    inputBorder: 'border-slate-200 focus:border-blue-500',
    inputText: 'text-slate-900',
    inputPlaceholder: 'placeholder:text-slate-400',
  },

  beige: {
    id: 'beige',
    name: 'Flora Minimal',
    badge: 'MINIMALIST',
    swatchBg: '#059669',
    isLight: true,

    chassisBg: 'bg-[#f8fafc]',
    chassisText: 'text-slate-900',

    containerBg: 'bg-white',
    containerBorder: 'border-slate-200',
    containerShadow: 'shadow-sm',

    cardBg: 'bg-white',
    cardBorder: 'border-slate-200',
    cardHoverBorder: 'hover:border-emerald-500',

    innerScreenBg: 'bg-slate-50',
    innerScreenBorder: 'border-slate-200',
    innerScreenText: 'text-slate-900',

    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-600',
    textMuted: 'text-slate-400',
    fontClass: 'font-sans',
    fontDisplay: 'font-display',

    accentBg: 'bg-[#059669]',
    accentHover: 'hover:bg-[#047857]',
    accentText: 'text-white',
    accentBorder: 'border-emerald-500',

    headerBg: 'bg-white/95',
    headerBorder: 'border-slate-200',
    headerSecondaryBg: 'bg-slate-100',
    headerSecondaryText: 'text-slate-700',

    bottomNavBg: 'bg-white/95',
    bottomNavBorder: 'border-slate-200',
    bottomNavActive: 'text-emerald-600 bg-emerald-50 font-bold',
    bottomNavInactive: 'text-slate-600 hover:text-slate-800',

    pillActiveBg: 'bg-slate-900',
    pillActiveText: 'text-white',
    pillInactiveBg: 'bg-slate-50',
    pillInactiveText: 'text-slate-600 hover:bg-slate-100',
    inputBg: 'bg-slate-50',
    inputBorder: 'border-slate-200 focus:border-emerald-500',
    inputText: 'text-slate-900',
    inputPlaceholder: 'placeholder:text-slate-400',
  },
};

export const getThemeConfig = (theme?: ChassisTheme | string): ThemeConfig => {
  if (!theme) return THEME_CONFIGS.ruby;
  return THEME_CONFIGS[theme as ChassisTheme] || THEME_CONFIGS.ruby;
};
