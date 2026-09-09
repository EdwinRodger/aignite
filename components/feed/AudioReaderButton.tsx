'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface AudioReaderButtonProps {
  textToRead: string;
  title: string;
}

export function AudioReaderButton({ textToRead, title }: AudioReaderButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        setIsSupported(true);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleTogglePlay = () => {
    if (!isSupported) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    // Stop any existing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(`${title}. ${textToRead}`);
    utterance.rate = 1.05; // natural slightly brisk pace
    utterance.pitch = 1.0;

    // Pick a natural English voice if available
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(
      (v) => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('David'))
    ) || voices.find((v) => v.lang.startsWith('en'));

    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!isSupported) return null;

  return (
    <button
      type="button"
      onClick={handleTogglePlay}
      aria-label={isPlaying ? 'Stop audio readout' : 'Listen to 30-second audio summary'}
      title={isPlaying ? 'Stop audio' : 'Listen hands-free'}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm font-medium border transition-all ${
        isPlaying
          ? 'bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/30 animate-pulse'
          : 'bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted border-border'
      } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
    >
      {isPlaying ? (
        <>
          <VolumeX className="w-3.5 h-3.5 animate-spin" />
          <span className="text-[11px] font-mono">Listening...</span>
        </>
      ) : (
        <>
          <Volume2 className="w-3.5 h-3.5 text-primary" />
          <span className="text-[11px]">Listen</span>
        </>
      )}
    </button>
  );
}
