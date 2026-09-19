/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  SupportedLanguage,
  SUPPORTED_LANGUAGES,
  LanguageOption,
  TRANSLATIONS,
} from '../utils/i18n';
import { soundFX } from '../utils/audio';
import { Globe, Languages, Check, ArrowRight, Sparkles, Compass } from 'lucide-react';
import { ChassisTheme } from '../types';
import { getThemeConfig } from '../utils/theme';

interface LanguageSelectionModalProps {
  isOpen: boolean;
  currentLanguage: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
  onConfirm: () => void;
  theme?: ChassisTheme;
  isInitialAfterSplash?: boolean;
}

export const LanguageSelectionModal: React.FC<LanguageSelectionModalProps> = ({
  isOpen,
  currentLanguage,
  onSelectLanguage,
  onConfirm,
  theme = 'ruby',
  isInitialAfterSplash = false,
}) => {
  if (!isOpen) return null;

  const themeCfg = getThemeConfig(theme);
  const currentTranslation = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  const regionalLanguages = SUPPORTED_LANGUAGES.filter((l) => l.category === 'regional');
  const internationalLanguages = SUPPORTED_LANGUAGES.filter((l) => l.category === 'international');

  const handleLanguageClick = (langCode: SupportedLanguage) => {
    soundFX.playClick();
    onSelectLanguage(langCode);
  };

  const handleConfirm = () => {
    soundFX.playConfirm();
    onConfirm();
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`w-full max-w-xl rounded-2xl overflow-hidden border-2 ${
          themeCfg.isLight
            ? 'bg-[#fdfaf3] border-amber-300 shadow-[0_20px_60px_rgba(0,0,0,0.4)] text-stone-900'
            : 'bg-[#0e1626] border-cyan-500/40 shadow-[0_20px_60px_rgba(0,0,0,0.8)] text-white'
        } flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200`}
      >
        {/* Terminal Header */}
        <div className="relative px-5 py-3.5 border-b border-white/15 bg-gradient-to-r from-emerald-950 via-slate-950 to-teal-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-emerald-400 p-0.5 shadow-md flex items-center justify-center shrink-0">
              <Languages className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-telemetry text-[10px] font-black tracking-widest uppercase text-emerald-300">
                  {isInitialAfterSplash ? 'STEP 1 // EXPEDITION SETUP' : 'LANGUAGE SETTINGS'}
                </span>
              </div>
              <h2 className="font-display text-base sm:text-lg font-black tracking-tight text-white">
                Select Expedition Language / भाषा चुनें
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900/90 border border-emerald-500/40 px-2.5 py-1 rounded-full text-[11px] font-telemetry font-bold text-emerald-200">
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>4 Regional + 2 Intl</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {/* Subtitle / Instructions */}
          <div className={`p-3 rounded-xl border text-xs leading-relaxed font-telemetry flex items-start gap-2.5 ${
            themeCfg.isLight
              ? 'bg-amber-50/80 border-amber-200 text-stone-800'
              : 'bg-slate-900/60 border-cyan-900/40 text-slate-200'
          }`}>
            <Compass className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">
                Choose your expedition dialect for species identification &amp; PVA survival analysis:
              </strong>
            </div>
          </div>

          {/* Section 1: 4 Regional Indian Languages */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className={`font-telemetry text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 ${
                themeCfg.isLight ? 'text-amber-900' : 'text-amber-400'
              }`}>
                <span>🇮🇳</span>
                REGIONAL INDIAN LANGUAGES (4)
              </span>
              <span className={`text-[10px] font-telemetry font-medium ${
                themeCfg.isLight ? 'text-stone-600' : 'text-slate-400'
              }`}>
                Jaipur, Rajasthan &amp; India
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {regionalLanguages.map((lang) => {
                const isSelected = currentLanguage === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleLanguageClick(lang.code)}
                    className={`p-3 rounded-xl border-2 text-left transition-all relative flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? themeCfg.isLight
                          ? 'border-emerald-600 bg-emerald-50 text-stone-950 shadow-md shadow-emerald-500/15'
                          : 'border-emerald-400 bg-emerald-500/20 text-white shadow-md shadow-emerald-500/20'
                        : themeCfg.isLight
                        ? 'border-stone-300 bg-white hover:border-emerald-500 hover:bg-emerald-50/40 text-stone-900'
                        : 'border-white/10 bg-slate-900/40 hover:border-cyan-500/40 hover:bg-slate-800/40 text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{lang.flag}</span>
                      <div>
                        <div className="font-display font-bold text-sm leading-tight flex items-center gap-1.5">
                          <span>{lang.nativeName}</span>
                          <span className={`text-[11px] font-telemetry ${
                            themeCfg.isLight ? 'text-stone-600' : 'text-slate-400'
                          }`}>({lang.name})</span>
                        </div>
                        <span className={`text-[11px] font-telemetry font-bold block mt-0.5 ${
                          themeCfg.isLight ? 'text-emerald-800' : 'text-emerald-400'
                        }`}>
                          {lang.regionLabel}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                        isSelected
                          ? 'bg-emerald-600 border-emerald-500 text-white font-bold'
                          : themeCfg.isLight
                          ? 'border-stone-400 bg-stone-100 text-transparent'
                          : 'border-white/20 bg-black/40 text-transparent'
                      }`}
                    >
                      <Check className="w-3 h-3" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: 2 International Languages */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className={`font-telemetry text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 ${
                themeCfg.isLight ? 'text-sky-900' : 'text-cyan-400'
              }`}>
                <Globe className="w-3.5 h-3.5" />
                INTERNATIONAL LANGUAGES (2)
              </span>
              <span className={`text-[10px] font-telemetry font-medium ${
                themeCfg.isLight ? 'text-stone-600' : 'text-slate-400'
              }`}>
                Global Standards
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {internationalLanguages.map((lang) => {
                const isSelected = currentLanguage === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleLanguageClick(lang.code)}
                    className={`p-3 rounded-xl border-2 text-left transition-all relative flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? themeCfg.isLight
                          ? 'border-sky-600 bg-sky-50 text-stone-950 shadow-md shadow-sky-500/15'
                          : 'border-cyan-400 bg-cyan-500/20 text-white shadow-md shadow-cyan-500/20'
                        : themeCfg.isLight
                        ? 'border-stone-300 bg-white hover:border-sky-500 hover:bg-sky-50/40 text-stone-900'
                        : 'border-white/10 bg-slate-900/40 hover:border-cyan-500/40 hover:bg-slate-800/40 text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{lang.flag}</span>
                      <div>
                        <div className="font-display font-bold text-sm leading-tight flex items-center gap-1.5">
                          <span>{lang.nativeName}</span>
                          <span className={`text-[11px] font-telemetry ${
                            themeCfg.isLight ? 'text-stone-600' : 'text-slate-400'
                          }`}>({lang.name})</span>
                        </div>
                        <span className={`text-[11px] font-telemetry font-bold block mt-0.5 ${
                          themeCfg.isLight ? 'text-sky-800' : 'text-cyan-300'
                        }`}>
                          {lang.regionLabel}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                        isSelected
                          ? 'bg-sky-600 border-sky-500 text-white font-bold'
                          : themeCfg.isLight
                          ? 'border-stone-400 bg-stone-100 text-transparent'
                          : 'border-white/20 bg-black/40 text-transparent'
                      }`}
                    >
                      <Check className="w-3 h-3" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Live Preview of Selected Language */}
          <div className={`p-3 rounded-xl border ${
            themeCfg.isLight
              ? 'bg-amber-50/70 border-amber-200'
              : 'bg-black/40 border-white/10'
          }`}>
            <span className={`font-telemetry text-[10px] font-bold uppercase tracking-wider block mb-1.5 ${
              themeCfg.isLight ? 'text-stone-700' : 'text-slate-400'
            }`}>
              LIVE DIALECT PREVIEW:
            </span>
            <div className="flex flex-wrap gap-2 text-xs font-telemetry">
              <span className={`px-2.5 py-1 rounded-md font-extrabold border shadow-xs ${
                themeCfg.isLight
                  ? 'bg-emerald-100 text-emerald-950 border-emerald-400'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              }`}>
                {currentTranslation.scannerTab}
              </span>
              <span className={`px-2.5 py-1 rounded-md font-extrabold border shadow-xs ${
                themeCfg.isLight
                  ? 'bg-sky-100 text-sky-950 border-sky-400'
                  : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
              }`}>
                {currentTranslation.predictTab}
              </span>
              <span className={`px-2.5 py-1 rounded-md font-extrabold border shadow-xs ${
                themeCfg.isLight
                  ? 'bg-amber-100 text-amber-950 border-amber-400'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              }`}>
                {currentTranslation.fruitsAndVeggies}
              </span>
              <span className={`px-2.5 py-1 rounded-md font-extrabold border shadow-xs ${
                themeCfg.isLight
                  ? 'bg-purple-100 text-purple-950 border-purple-400'
                  : 'bg-purple-500/20 text-purple-300 border-purple-500/40'
              }`}>
                {currentTranslation.peacockSample}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Confirm Action */}
        <div className={`px-5 py-3.5 border-t flex items-center justify-between gap-3 ${
          themeCfg.isLight
            ? 'border-stone-200 bg-stone-100 text-stone-900'
            : 'border-white/10 bg-black/60 text-white backdrop-blur-md'
        }`}>
          <div className="text-xs font-telemetry flex items-center gap-1.5">
            <span className={themeCfg.isLight ? 'text-stone-600' : 'text-slate-400'}>Active:</span>
            <strong className={`px-2 py-0.5 rounded-md font-extrabold border ${
              themeCfg.isLight
                ? 'bg-emerald-100 text-emerald-950 border-emerald-300'
                : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
            }`}>
              {SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage)?.nativeName} ({SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage)?.name})
            </strong>
          </div>

          <button
            type="button"
            onClick={handleConfirm}
            className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 active:scale-95 text-slate-950 font-display text-xs font-black flex items-center gap-2 shadow-lg border border-emerald-300 cursor-pointer transition-all"
          >
            <span>CONFIRM &amp; ENTER BIODEX →</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
