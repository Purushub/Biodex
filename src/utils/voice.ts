/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * High-quality Natural Voice Synthesis for Student Naturalists (6th Grade Friendly)
 * Prioritizes expressive, clear, human-sounding neural voices with natural pauses.
 */

// Preferred high-quality voices across Chrome, Edge, Safari, Android, and iOS
const PREFERRED_VOICE_NAMES = [
  'Google US English',
  'Google UK English Female',
  'Google UK English Male',
  'Microsoft Jenny Online (Natural)',
  'Microsoft Aria Online (Natural)',
  'Microsoft Guy Online (Natural)',
  'Samantha',
  'Karen',
  'Victoria',
  'Daniel',
  'Moira',
  'Tessa',
  'Serena',
  'Google हिन्दी',
  'Rishi',
  'Veena',
];

/**
 * Retrieves the best available natural speech synthesis voice
 */
export function getBestNaturalVoice(lang: string = 'en'): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return null;
  }

  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) {
    return null;
  }

  // 1. Look for preferred high-quality voices
  for (const preferred of PREFERRED_VOICE_NAMES) {
    const match = voices.find(
      (v) => v.name.toLowerCase().includes(preferred.toLowerCase())
    );
    if (match) return match;
  }

  // 2. Look for any voice labeled "Natural" or "Neural" or "Online"
  const naturalVoice = voices.find(
    (v) =>
      (v.name.toLowerCase().includes('natural') ||
       v.name.toLowerCase().includes('neural') ||
       v.name.toLowerCase().includes('premium')) &&
      (v.lang.startsWith(lang) || v.lang.startsWith('en'))
  );
  if (naturalVoice) return naturalVoice;

  // 3. Fall back to any voice matching requested language prefix
  const langVoice = voices.find((v) => v.lang.startsWith(lang));
  if (langVoice) return langVoice;

  // 4. Default to first English voice or first available voice
  const englishVoice = voices.find((v) => v.lang.startsWith('en'));
  return englishVoice || voices[0] || null;
}

/**
 * Cleans and simplifies scientific narration for 6th graders
 */
export function formatSpeechFor6thGrader(rawText: string): string {
  let text = rawText;

  // Replace stiff acronyms and collegiate terms with friendly words
  text = text.replace(/\bIUCN\b/gi, 'International Wildlife Protection');
  text = text.replace(/\bPVA\b/gi, 'Survival Forecast');
  text = text.replace(/\bPBR\b/gi, 'Biodiversity Record');
  text = text.replace(/\bconf\b/gi, 'confidence');
  text = text.replace(/\bkm²\b/gi, ' square kilometers ');
  text = text.replace(/\bha\b/gi, ' hectares ');
  text = text.replace(/([0-9]+)%/g, '$1 percent');
  text = text.replace(/\bLeast Concern\b/gi, 'Safe and healthy');
  text = text.replace(/\bEndangered\b/gi, 'Endangered, meaning it needs strong protection');
  text = text.replace(/\bCritically Endangered\b/gi, 'Critically endangered, meaning very few are left in the wild');
  text = text.replace(/\bVulnerable\b/gi, 'Vulnerable, meaning population is dropping');

  // Add natural commas for friendly breathing pauses
  text = text.replace(/\.\s+/g, '. ... ');

  return text;
}

/**
 * Plays speech using the best voice with 6th-grade friendly cadence
 */
export function speakWithBestVoice(
  text: string,
  options?: {
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (err: unknown) => void;
    rate?: number;
    pitch?: number;
    lang?: string;
  }
): SpeechSynthesisUtterance | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return null;
  }

  // Cancel any existing speech cleanly
  window.speechSynthesis.cancel();

  const formattedText = formatSpeechFor6thGrader(text);
  const utterance = new SpeechSynthesisUtterance(formattedText);

  // Friendly, engaging cadence: slightly paced for clear middle-school comprehension
  utterance.rate = options?.rate ?? 0.93;
  utterance.pitch = options?.pitch ?? 1.02;

  const bestVoice = getBestNaturalVoice(options?.lang || 'en');
  if (bestVoice) {
    utterance.voice = bestVoice;
    utterance.lang = bestVoice.lang;
  }

  utterance.onstart = () => {
    options?.onStart?.();
  };

  utterance.onend = () => {
    options?.onEnd?.();
  };

  utterance.onerror = (e) => {
    options?.onError?.(e);
  };

  // Speak
  window.speechSynthesis.speak(utterance);
  return utterance;
}

/**
 * Stop any active speech synthesis
 */
export function stopVoiceSpeech(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
