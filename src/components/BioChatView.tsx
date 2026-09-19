/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  ChatMessage,
  ChatRole,
  GeminiModelId,
  GroundingChunk,
  StudentSession,
  SpeciesData,
  SurveyRecord,
  ChassisTheme,
  NavTab,
} from '../types';
import { soundFX } from '../utils/audio';
import { getThemeConfig } from '../utils/theme';
import {
  Bot,
  User,
  Send,
  Sparkles,
  MapPin,
  Globe,
  RefreshCw,
  ExternalLink,
  Cpu,
  Layers,
  HelpCircle,
  Leaf,
  Activity,
  Compass,
  ChevronRight,
  Scan,
  LineChart,
  Info,
} from 'lucide-react';

export interface BioChatViewProps {
  session: StudentSession;
  currentSpecies?: SpeciesData;
  surveyRecords?: SurveyRecord[];
  theme?: ChassisTheme;
  onThemeChange?: (theme: ChassisTheme) => void;
  onNavigateToTab?: (tab: NavTab) => void;
  onSelectSpecies?: (species: SpeciesData) => void;
  catalog?: SpeciesData[];
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-welcome',
    role: 'model',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    content: 'Greetings Field Investigator! Which species or ecosystem are we investigating today?',
  },
];

const ROLES: { id: ChatRole; title: string; subtitle: string; icon: any; themeSuggested: ChassisTheme }[] = [
  {
    id: 'field_ecologist',
    title: 'Dr. Elena Vance',
    subtitle: 'Field Ecologist & Nature Guide',
    icon: Leaf,
    themeSuggested: 'emerald',
  },
  {
    id: 'extinction_modeler',
    title: 'Dr. Marcus Chen',
    subtitle: 'Population Survival Modeler (PVA)',
    icon: Activity,
    themeSuggested: 'ruby',
  },
  {
    id: 'taxonomy_expert',
    title: 'Prof. Astrid Thorne',
    subtitle: 'Species & Taxonomy Curator',
    icon: Layers,
    themeSuggested: 'gold',
  },
];

const SUGGESTIONS = [
  'Why did the Western Prairie Fringed Orchid decline 76% since 2012?',
  'How does planting wildflower buffers help save endangered species?',
  'What is Population Viability Analysis (PVA) and how does it predict survival?',
  'Are tomatoes and grapes considered fruits or berries botanically?',
];

export const BioChatView: React.FC<BioChatViewProps> = ({
  session,
  currentSpecies,
  surveyRecords = [],
  theme = 'ruby',
  onThemeChange,
  onNavigateToTab,
  onSelectSpecies,
  catalog = [],
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [activeRole, setActiveRole] = useState<ChatRole>('field_ecologist');
  // Fixed default model: Gemini 3.1 Flash Lite
  const activeModel: GeminiModelId = 'gemini-3.1-flash-lite';
  const [useSearch, setUseSearch] = useState(false);
  const [useMaps, setUseMaps] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOfflineKnowledgeActive, setIsOfflineKnowledgeActive] = useState(false);
  const [showConfigPanel, setShowConfigPanel] = useState(false);

  const themeCfg = getThemeConfig(theme);
  const accentClass = `${themeCfg.accentBg} ${themeCfg.accentText}`;

  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const queryText = (textToSend || inputText).trim();
    if (!queryText || isLoading) return;

    soundFX.playConfirm();
    setInputText('');

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setIsLoading(true);

    try {
      // Prepare message payload formatted for server endpoint (filter initial welcome)
      const formattedHistory = newHistory
        .filter((m) => m.id !== 'msg-welcome')
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: formattedHistory,
          role: activeRole,
          model: activeModel,
          useSearch,
          useMaps,
          speciesContext: currentSpecies
            ? {
                name: currentSpecies.commonName,
                scientificName: currentSpecies.scientificName,
                iucnStatus: currentSpecies.iucnStatus,
                currentPop: currentSpecies.currentPop2026,
                baselinePop2012: currentSpecies.historicalPop2012,
                habitat: currentSpecies.habitat,
                biodiversityRank: currentSpecies.biodiversityRank,
              }
            : undefined,
          latitude: 44.8142,
          longitude: -93.3524,
        }),
      });

      const data = await res.json();

      if (data.success) {
        soundFX.playScanBeep();
        if (data.isOfflineKnowledge) {
          setIsOfflineKnowledgeActive(true);
        }
        const modelMessage: ChatMessage = {
          id: `mod-${Date.now()}`,
          role: 'model',
          content: data.reply || 'Analysis completed with no output text.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          groundingChunks: data.groundingChunks || [],
        };
        setMessages((prev) => [...prev, modelMessage]);
      } else {
        const errorMessage: ChatMessage = {
          id: `err-${Date.now()}`,
          role: 'model',
          content: `⚠️ Error from AI Server: ${data.error || 'Unable to connect to Gemini API'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (err: unknown) {
      console.error('Chat error:', err);
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        content: '⚠️ Network connection failure to Gemini BioDex service. Please check your connection.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    soundFX.playCancel();
    setMessages(INITIAL_MESSAGES);
  };

  return (
    <div className="w-full flex flex-col gap-3.5 pb-12 animate-in fade-in duration-300">
      {/* View Header */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-emerald-100 bg-emerald-50 text-emerald-700 shadow-sm">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-mono text-[10px] uppercase tracking-wider font-bold text-emerald-700">
                WWF Gemini AI Copilot
              </span>
              {isOfflineKnowledgeActive && (
                <span className="font-mono text-[8px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded-full font-bold">
                  WWF Engine
                </span>
              )}
            </div>
            <h1 className="font-sans font-bold text-base text-slate-900 leading-tight">
              Ecological Intelligence &amp; Reasoning
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          {/* Info Toggle Button (i) */}
          <button
            type="button"
            onClick={() => {
              soundFX.playClick();
              setShowConfigPanel((prev) => !prev);
            }}
            className={`flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs font-semibold border transition-all cursor-pointer shadow-xs ${
              showConfigPanel
                ? 'bg-emerald-600 text-white border-emerald-600 ring-2 ring-emerald-500/20'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
            }`}
            title={showConfigPanel ? 'Hide Specimen & Persona Controls' : 'Show Specimen & Persona Controls'}
            aria-label="Specimen and Persona Controls"
          >
            <Info className={`w-4 h-4 ${showConfigPanel ? 'text-white' : 'text-emerald-600'}`} />
            <span className="font-mono text-[11px] font-bold">Info</span>
          </button>

          {onNavigateToTab && (
            <button
              onClick={() => onNavigateToTab('scanner')}
              className="flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-all cursor-pointer shadow-sm"
            >
              <Scan className="w-3.5 h-3.5" />
              <span>Scanner</span>
            </button>
          )}
          <button
            onClick={handleClearHistory}
            className="flex items-center gap-1 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 transition-all cursor-pointer shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset Chat</span>
          </button>
        </div>
      </div>

      {/* CONFIGURATION PANEL: ACTIVE SPECIMEN & SPECIALIST PERSONA (Revealed via (i) Info icon) */}
      {showConfigPanel && (
        <div className="flex flex-col gap-3.5 animate-in fade-in slide-in-from-top-2 duration-200">
      {/* ACTIVE FIELD SPECIMEN CONTEXT HUD */}
      {currentSpecies && (
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src={currentSpecies.imageUrl}
              alt={currentSpecies.commonName}
              className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-sm shrink-0 bg-slate-100"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[9px] uppercase tracking-wider font-bold text-emerald-700">
                  ACTIVE FIELD SPECIMEN
                </span>
                {currentSpecies.biodiversityRank && (
                  <span className="font-mono text-[9px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.2 rounded">
                    Rank #{currentSpecies.biodiversityRank}
                  </span>
                )}
              </div>
              <h2 className="font-sans font-bold text-sm text-slate-900 truncate leading-tight">
                {currentSpecies.commonName}
              </h2>
              <span className="text-xs italic font-mono text-slate-500 truncate block">
                {currentSpecies.scientificName} &bull; {currentSpecies.iucnStatus}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
            <button
              type="button"
              onClick={() =>
                handleSendMessage(
                  `Explain the primary ecological threats causing the decline of ${currentSpecies.commonName} in ${session.sectorCoord} and what classroom conservation interventions will prevent collapse.`
                )
              }
              disabled={isLoading}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-100" />
              <span>Ask About {currentSpecies.commonName.split(' ')[0]}</span>
            </button>
            {onNavigateToTab && (
              <button
                type="button"
                onClick={() => onNavigateToTab('predict')}
                className="text-xs font-semibold px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center gap-1 transition-all active:scale-95 cursor-pointer shadow-sm"
              >
                <LineChart className="w-3.5 h-3.5 text-emerald-600" />
                <span>PVA</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Control Strip: Specialist persona selection & Grounding Toggles */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-3">
        {/* Role Selector Tabs */}
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider block mb-2 text-slate-500">
            1. Select Specialist Persona:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {ROLES.map((r) => {
              const Icon = r.icon;
              const isSelected = activeRole === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => {
                    soundFX.playScanBeep();
                    setActiveRole(r.id);
                    if (onThemeChange) {
                      onThemeChange(r.themeSuggested);
                    }
                  }}
                  className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50/70 border-emerald-500 shadow-sm'
                      : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white border border-slate-200 text-slate-500'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate leading-tight">{r.title}</p>
                    <p className="text-[10px] text-slate-500 truncate font-mono">{r.subtitle}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Model Indicator & Grounding Options */}
        <div className="pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5 text-xs font-mono">
          {/* Default Model Indicator */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase flex items-center gap-1 text-slate-500">
              <Cpu className="w-3.5 h-3.5 text-emerald-600" /> Model:
            </span>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-slate-200 bg-slate-50 text-slate-700 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Gemini 3.1 Flash Lite</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full uppercase font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Default
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs cursor-pointer font-semibold transition-all ${
                useSearch
                  ? 'bg-blue-50 border-blue-300 text-blue-700'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <input
                type="checkbox"
                checked={useSearch}
                onChange={(e) => {
                  setUseSearch(e.target.checked);
                  if (e.target.checked) setUseMaps(false);
                }}
                className="hidden"
              />
              <Globe className="w-3.5 h-3.5" />
              <span>Google Search</span>
            </label>

            <label
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs cursor-pointer font-semibold transition-all ${
                useMaps
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <input
                type="checkbox"
                checked={useMaps}
                onChange={(e) => {
                  setUseMaps(e.target.checked);
                  if (e.target.checked) setUseSearch(false);
                }}
                className="hidden"
              />
              <Compass className="w-3.5 h-3.5" />
              <span>Google Maps</span>
            </label>
          </div>
        </div>
      </div>
      </div>
      )}

      {/* Main Chat Terminal Display */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col h-[520px]">
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 items-start ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar Icon */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border shadow-sm ${
                    isUser
                      ? 'bg-emerald-600 text-white border-emerald-700'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-emerald-600" />}
                </div>

                {/* Bubble */}
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-sm ${
                    isUser
                      ? 'bg-emerald-600 text-white rounded-tr-none font-medium'
                      : 'bg-slate-50 border border-slate-200/80 text-slate-800 rounded-tl-none font-normal'
                  }`}
                >
                  <div className={`flex items-center justify-between gap-2 mb-1 pb-1 border-b text-[10px] font-mono ${
                    isUser ? 'border-white/20 text-emerald-100' : 'border-slate-200/80 text-slate-400'
                  }`}>
                    <span className="font-bold">{isUser ? session.guestId : 'WWF BIODEX AI'}</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <div className="whitespace-pre-line font-sans">{msg.content}</div>

                  {/* Grounding URL Chips if returned */}
                  {msg.groundingChunks && msg.groundingChunks.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-slate-200 space-y-1">
                      <span className="text-[9px] font-mono uppercase tracking-wider block text-blue-700 font-bold">
                        Grounding Sources:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.groundingChunks.map((chunk, cIdx) => {
                          const uri = chunk.web?.uri || chunk.maps?.uri;
                          const title = chunk.web?.title || chunk.maps?.title || 'Source Reference';
                          if (!uri) return null;
                          return (
                            <a
                              key={cIdx}
                              href={uri}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-[10px] font-mono transition-colors"
                            >
                              <ExternalLink className="w-2.5 h-2.5" />
                              <span className="truncate max-w-[180px]">{title}</span>
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center border border-slate-200 bg-slate-100 text-slate-700">
                <Bot className="w-4 h-4 animate-spin-slow text-emerald-600" />
              </div>
              <div className="p-3 rounded-2xl rounded-tl-none text-xs font-mono flex items-center gap-2 border border-slate-200 bg-slate-50 text-slate-600">
                <span className="w-2 h-2 rounded-full animate-ping bg-emerald-500"></span>
                <span>Synthesizing ecological analysis via Gemini 3.1 Flash Lite...</span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="pt-2 pb-1 border-t border-slate-100 overflow-x-auto flex items-center gap-1.5 scrollbar-none">
          <span className="text-[10px] font-mono uppercase shrink-0 flex items-center gap-1 font-bold text-slate-500">
            <HelpCircle className="w-3 h-3 text-emerald-600" /> Quick Prompts:
          </span>
          {SUGGESTIONS.map((sug, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSendMessage(sug)}
              disabled={isLoading}
              className="shrink-0 border border-slate-200 bg-slate-50 hover:bg-slate-100 px-2.5 py-1 rounded-full text-[11px] font-mono text-slate-700 transition-colors cursor-pointer"
            >
              {sug}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Ask about species health, extinction forecasts, habitat restoration..."
            disabled={isLoading}
            className="flex-1 border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans transition-colors placeholder:text-slate-400 text-slate-900"
          />
          <button
            type="button"
            onClick={() => handleSendMessage()}
            disabled={isLoading || !inputText.trim()}
            className="h-10 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-semibold rounded-xl shadow-sm flex items-center justify-center transition-all cursor-pointer disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BioChatView;
