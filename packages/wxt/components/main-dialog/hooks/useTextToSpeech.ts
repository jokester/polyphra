import { useState } from 'react';
import { StyleSpec } from '../types';

export const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const speak = (text: string, actor?: StyleSpec | null) => {
    if (!text.trim()) return;

    setIsSpeaking(true);

    // Use Web Speech API
    const utterance = new SpeechSynthesisUtterance(text);

    // Try to set voice based on actor's accent
    const voices = speechSynthesis.getVoices();
    if (actor?.accent === 'British') {
      const britishVoice = voices.find((voice) => voice.lang.includes('en-GB') || voice.name.includes('British'));
      if (britishVoice) utterance.voice = britishVoice;
    }

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechSynthesis.speak(utterance);
  };

  return {
    isSpeaking,
    speak,
  };
};
