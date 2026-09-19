import React from 'react';
import { ChassisTheme, StudentSession } from '../types';
import { soundFX } from '../utils/audio';
import { Volume2, VolumeX, User, Film, Compass, Globe } from 'lucide-react';
import { getThemeConfig } from '../utils/theme';
import { SupportedLanguage, SUPPORTED_LANGUAGES } from '../utils/i18n';

interface HeaderProps {
  theme: ChassisTheme;
  onThemeChange: (theme: ChassisTheme) => void;
  session: StudentSession;
  onOpenAuth: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onReplaySplash?: () => void;
  onOpenTutorial?: () => void;
  language?: SupportedLanguage;
  onLanguageChange?: (lang: SupportedLanguage) => void;
  onOpenLanguageModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onThemeChange,
  session,
  onOpenAuth,
  soundEnabled,
  onToggleSound,
  onReplaySplash,
  onOpenTutorial,
  language = 'en',
  onLanguageChange,
  onOpenLanguageModal,
}) => {
  const themeCfg = getThemeConfig(theme);

  const handleThemeClick = (newTheme: ChassisTheme) => {
    soundFX.playChime();
    onThemeChange(newTheme);
  };

  return (
    <header
      id="chassisHeader"
      className="fixed top-0 inset-x-0 z-50 pt-safe bg-white/95 backdrop-blur-md border-b border-slate-200 transition-colors duration-300 shadow-xs"
    >
      <div className="max-w-2xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Left: BioDex Brand & Student Profile */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-600 shadow-xs shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          <div className="flex flex-col min-w-0">
            <span className="font-bold text-slate-900 text-sm sm:text-base tracking-tight leading-tight">
              BioDex
            </span>
            <button
              type="button"
              onClick={() => {
                soundFX.playClick();
                onOpenAuth();
              }}
              className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-emerald-700 mt-0.5 text-left cursor-pointer truncate transition-colors"
              title="Click to view/change Student Profile"
            >
              <User className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="font-mono font-medium truncate max-w-[120px] sm:max-w-[160px]">
                {session.guestId}
              </span>
            </button>
          </div>
        </div>

        {/* Right: Language Selector, Theme Switcher, Tutorial, Sound */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Language Picker */}
          {onOpenLanguageModal ? (
            <button
              type="button"
              onClick={() => {
                soundFX.playClick();
                onOpenLanguageModal();
              }}
              className="flex items-center gap-1 bg-slate-100/90 hover:bg-slate-200/80 px-2.5 py-1.5 rounded-full border border-slate-200 text-slate-700 text-[11px] font-sans font-semibold transition-all active:scale-95 cursor-pointer shadow-xs"
              title="Change Language (4 Regional + 2 International)"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>
                {SUPPORTED_LANGUAGES.find((l) => l.code === language)?.flag || '🌐'}{' '}
                <span className="hidden sm:inline">
                  {SUPPORTED_LANGUAGES.find((l) => l.code === language)?.name || 'Language'}
                </span>
              </span>
            </button>
          ) : onLanguageChange && (
            <div className="relative flex items-center bg-slate-100/90 px-2 py-1 rounded-full border border-slate-200 text-slate-700 text-[11px]">
              <Globe className="w-3.5 h-3.5 text-emerald-600 mr-1 shrink-0" />
              <select
                value={language}
                onChange={(e) => {
                  soundFX.playClick();
                  onLanguageChange(e.target.value as SupportedLanguage);
                }}
                className="bg-transparent text-slate-700 text-[11px] font-sans font-medium focus:outline-none cursor-pointer pr-1"
                aria-label="Select App Language"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-white text-slate-900">
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Palette Selector (Compact Dots) */}
          <div className="flex items-center gap-1 bg-slate-100/90 px-2 py-1.5 rounded-full border border-slate-200">
            <button
              className={`w-3 h-3 rounded-full bg-[#059669] transition-transform active:scale-90 ${
                theme === 'ruby' || theme === 'emerald' ? 'ring-2 ring-emerald-500 scale-110' : 'opacity-60 hover:opacity-100'
              }`}
              onClick={() => handleThemeClick('emerald')}
              title="Emerald Minimal"
              aria-label="Switch to Emerald Minimal theme"
            />
            <button
              className={`w-3 h-3 rounded-full bg-[#2563eb] transition-transform active:scale-90 ${
                theme === 'slate' ? 'ring-2 ring-blue-500 scale-110' : 'opacity-60 hover:opacity-100'
              }`}
              onClick={() => handleThemeClick('slate')}
              title="Sapphire Blue"
              aria-label="Switch to Sapphire Blue theme"
            />
            <button
              className={`w-3 h-3 rounded-full bg-[#d97706] transition-transform active:scale-90 ${
                theme === 'gold' ? 'ring-2 ring-amber-500 scale-110' : 'opacity-60 hover:opacity-100'
              }`}
              onClick={() => handleThemeClick('gold')}
              title="Amber Solar"
              aria-label="Switch to Amber Solar theme"
            />
          </div>

          {/* Tutorial Button */}
          {onOpenTutorial && (
            <button
              onClick={() => {
                soundFX.playConfirm();
                onOpenTutorial();
              }}
              className="h-8 px-2.5 rounded-full bg-slate-100/90 hover:bg-slate-200/80 border border-slate-200 flex items-center justify-center gap-1 text-slate-700 active:scale-95 transition-all text-[11px] font-sans font-semibold cursor-pointer shadow-xs"
              title="Field Naturalist Guide & Tutorial"
            >
              <Compass className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Guide</span>
            </button>
          )}

          {/* Intro Video Replay */}
          {onReplaySplash && (
            <button
              onClick={() => {
                soundFX.playClick();
                onReplaySplash();
              }}
              className="w-8 h-8 rounded-full bg-slate-100/90 hover:bg-slate-200/80 border border-slate-200 flex items-center justify-center text-slate-700 active:scale-95 transition-all text-[11px] font-sans font-bold cursor-pointer shadow-xs"
              title="Replay Intro"
            >
              <Film className="w-3.5 h-3.5 text-amber-600" />
            </button>
          )}

          {/* Sound Toggle */}
          <button
            onClick={() => {
              onToggleSound();
              soundFX.playClick();
            }}
            className="w-8 h-8 rounded-full bg-slate-100/90 hover:bg-slate-200/80 border border-slate-200 flex items-center justify-center text-slate-700 active:scale-95 transition-all cursor-pointer shadow-xs"
            title={soundEnabled ? 'Mute sound' : 'Enable sound'}
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
