import React from 'react';
import { NavTab, ChassisTheme } from '../types';
import { soundFX } from '../utils/audio';
import {
  Scan,
  BookOpen,
  MapPin,
  LineChart,
  MessageSquareCode,
  FileText,
} from 'lucide-react';
import { SupportedLanguage, getTranslation } from '../utils/i18n';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  theme?: ChassisTheme;
  language?: SupportedLanguage;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange, language = 'en' }) => {
  const t = getTranslation((language || 'en') as SupportedLanguage);

  const handleTabSelect = (tab: NavTab) => {
    soundFX.playClick();
    onTabChange(tab);
  };

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 pb-safe bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-2px_10px_rgba(0,0,0,0.02)] transition-colors duration-300">
      <div className="h-14 px-3 flex items-center justify-around max-w-lg mx-auto">
        {/* SCANNER */}
        <button
          type="button"
          onClick={() => handleTabSelect('scanner')}
          className={`flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors cursor-pointer ${
            activeTab === 'scanner' ? 'text-emerald-700 font-semibold' : 'text-slate-500 hover:text-slate-800'
          }`}
          aria-label="Scanner"
        >
          <Scan className="w-5 h-5" />
          <span className="text-[11px] leading-tight">{t.scannerTab || 'Scanner'}</span>
        </button>

        {/* BIODEX */}
        <button
          type="button"
          onClick={() => handleTabSelect('biodex')}
          className={`flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors cursor-pointer ${
            activeTab === 'biodex' ? 'text-emerald-700 font-semibold' : 'text-slate-500 hover:text-slate-800'
          }`}
          aria-label="BioDex"
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[11px] leading-tight">{t.biodexTab || 'BioDex'}</span>
        </button>

        {/* MAP */}
        <button
          type="button"
          onClick={() => handleTabSelect('map')}
          className={`flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors cursor-pointer ${
            activeTab === 'map' ? 'text-emerald-700 font-semibold' : 'text-slate-500 hover:text-slate-800'
          }`}
          aria-label="Maps"
        >
          <MapPin className="w-5 h-5" />
          <span className="text-[11px] leading-tight">{t.mapTab || 'Map'}</span>
        </button>

        {/* PREDICT / PVA */}
        <button
          type="button"
          onClick={() => handleTabSelect('predict')}
          className={`flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors cursor-pointer ${
            activeTab === 'predict' ? 'text-emerald-700 font-semibold' : 'text-slate-500 hover:text-slate-800'
          }`}
          aria-label="Predict"
        >
          <LineChart className="w-5 h-5" />
          <span className="text-[11px] leading-tight">{t.predictTab || 'Predict'}</span>
        </button>

        {/* CHAT */}
        <button
          type="button"
          onClick={() => handleTabSelect('chat')}
          className={`flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors cursor-pointer ${
            activeTab === 'chat' ? 'text-emerald-700 font-semibold' : 'text-slate-500 hover:text-slate-800'
          }`}
          aria-label="Chat"
        >
          <MessageSquareCode className="w-5 h-5" />
          <span className="text-[11px] leading-tight">{t.chatTab || 'Chat'}</span>
        </button>

        {/* REPORTS */}
        <button
          type="button"
          onClick={() => handleTabSelect('reports')}
          className={`flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors cursor-pointer ${
            activeTab === 'reports' ? 'text-emerald-700 font-semibold' : 'text-slate-500 hover:text-slate-800'
          }`}
          aria-label="Reports"
        >
          <FileText className="w-5 h-5" />
          <span className="text-[11px] leading-tight">{t.reportsTab || 'Reports'}</span>
        </button>
      </div>
    </nav>
  );
};
