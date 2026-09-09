'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Keyboard,
  RotateCcw,
  Send,
  Loader2,
  AlertCircle,
  Volume2,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

interface VoiceRecorderProps {
  onSubmitAnswer: (transcript: string, durationSeconds: number) => void;
  isEvaluating: boolean;
}

interface SpeechRecognitionResultItem {
  transcript: string;
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: { 0: SpeechRecognitionResultItem };
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

const WAVE_BAR_HEIGHTS = [35, 70, 95, 60, 85, 100, 45, 90, 65, 30];

export function VoiceRecorder({ onSubmitAnswer, isEvaluating }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [mode, setMode] = useState<'voice' | 'text'>('voice');
  const [transcript, setTranscript] = useState('');
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [speechApiAvailable, setSpeechApiAvailable] = useState(false);

  // References
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  useEffect(() => {
    const checkTimer = setTimeout(() => {
      if (typeof window !== 'undefined') {
        const windowWithSpeech = window as unknown as {
          SpeechRecognition?: new () => SpeechRecognitionInstance;
          webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
        };
        const SpeechRecognitionConstructor =
          windowWithSpeech.SpeechRecognition || windowWithSpeech.webkitSpeechRecognition;

        if (SpeechRecognitionConstructor) {
          setSpeechApiAvailable(true);
          const recognition = new SpeechRecognitionConstructor();
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.lang = 'en-US';

          recognition.onresult = (event: SpeechRecognitionEvent) => {
            let currentTranscript = '';
            for (let i = 0; i < event.results.length; i++) {
              currentTranscript += event.results[i][0].transcript + ' ';
            }
            setTranscript(currentTranscript.trim());
          };

          recognition.onerror = (event: { error: string }) => {
            console.warn('Speech recognition error:', event.error);
          };

          recognition.onend = () => {
            if (isRecording) {
              try {
                recognition.start();
              } catch {
                // ignore
              }
            }
          };

          recognitionRef.current = recognition;
        } else {
          setSpeechApiAvailable(false);
        }
      }
    }, 0);

    return () => {
      clearTimeout(checkTimer);
      if (timerRef.current) clearInterval(timerRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, [isRecording]);

  const startRecording = () => {
    setTranscript('');
    setSecondsElapsed(0);
    setIsRecording(true);

    // Start timer
    timerRef.current = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);

    // Start speech recognition if available
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.warn('Recognition start issue:', err);
      }
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
  };

  const handleReset = () => {
    stopRecording();
    setTranscript('');
    setSecondsElapsed(0);
  };

  const handleSubmit = () => {
    if (!transcript.trim()) return;
    stopRecording();
    onSubmitAnswer(transcript.trim(), Math.max(5, secondsElapsed));
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remaining = sec % 60;
    return `${mins}:${remaining < 10 ? '0' : ''}${remaining}`;
  };

  return (
    <Card className="w-full rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden space-y-5">
      {/* Header & Mode Switcher */}
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-foreground flex items-center gap-1.5">
            <Volume2 className="w-4 h-4 text-primary" />
            <span>Candidate Response Workspace</span>
          </span>
          {isRecording && (
            <Badge variant="destructive" className="gap-1 text-sm font-mono px-2 py-0.5 rounded-full animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              <span>LIVE RECORDING ({formatTimer(secondsElapsed)})</span>
            </Badge>
          )}
        </div>

        {/* Input Mode Toggle */}
        <div className="flex items-center rounded-lg bg-muted/60 p-1 border border-border text-sm">
          <button
            type="button"
            onClick={() => setMode('voice')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all font-medium text-sm ${
              mode === 'voice'
                ? 'bg-card text-foreground font-semibold shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Mic className="w-3.5 h-3.5 text-primary" />
            <span>Voice Mic</span>
          </button>
          <button
            type="button"
            onClick={() => {
              stopRecording();
              setMode('text');
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all font-medium text-sm ${
              mode === 'text'
                ? 'bg-card text-foreground font-semibold shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Keyboard className="w-3.5 h-3.5 text-secondary-foreground" />
            <span>Text Entry</span>
          </button>
        </div>
      </div>

      {/* Voice Mode: Live Animated Waveform & Mic Button */}
      {mode === 'voice' && (
        <div className="flex flex-col items-center justify-center py-6 px-4 rounded-xl bg-muted/20 border border-dashed border-border text-center space-y-4">
          {/* Animated Waveform Visualization */}
          <div className="flex items-center justify-center gap-1.5 h-12 w-48">
            {WAVE_BAR_HEIGHTS.map((height, i) => (
              <span
                key={i}
                className={`w-1.5 rounded-full transition-all duration-300 ${
                  isRecording
                    ? 'bg-primary animate-pulse'
                    : 'bg-muted-foreground/30'
                }`}
                style={{
                  height: isRecording ? `${height}%` : '20%',
                  animationDelay: `${i * 90}ms`,
                }}
              />
            ))}
          </div>

          {/* Primary Record Button */}
          <div className="flex items-center gap-3">
            {!isRecording ? (
              <Button
                type="button"
                onClick={startRecording}
                disabled={isEvaluating}
                className="px-6 py-3.5 rounded-2xl font-bold text-sm gap-2"
                size="lg"
              >
                <Mic className="w-4 h-4" />
                <span>Start Spoken Answer</span>
              </Button>
            ) : (
              <Button
                type="button"
                variant="destructive"
                onClick={stopRecording}
                className="px-6 py-3.5 rounded-2xl font-bold text-sm gap-2"
                size="lg"
              >
                <MicOff className="w-4 h-4" />
                <span>Pause Spoken Answer</span>
              </Button>
            )}

            {(transcript || secondsElapsed > 0) && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleReset}
                aria-label="Re-record answer"
                className="rounded-2xl"
                title="Clear and Re-record"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            )}
          </div>

          <p className="text-sm text-muted-foreground max-w-sm">
            {isRecording
              ? 'Speaking... The AI coach analyzes clarity, terminology, pace, and filler words.'
              : 'Tap to record. Speak at a confident, deliberate pace (120-150 WPM).'}
          </p>

          {!speechApiAvailable && (
            <div className="flex items-center gap-1.5 text-sm text-amber-500 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Speech recognition unavailable in this browser. Switch to Text Entry mode to type your answer!</span>
            </div>
          )}
        </div>
      )}

      {/* Transcript Editor / Fallback Text Input */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-sm font-semibold text-foreground">
          <span>{mode === 'voice' ? 'Spoken Transcript (Editable):' : 'Type Your Technical Answer:'}</span>
          <span className="text-sm font-mono text-muted-foreground">
            {transcript.trim().split(/\s+/).filter(Boolean).length} words
          </span>
        </div>

        <Textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder={
            mode === 'voice'
              ? 'Your speech will transcribe here in real-time as you speak, or you can edit it before submission...'
              : 'Provide your technical response explaining the architecture, trade-offs, and failure cases...'
          }
          rows={4}
          className="w-full p-3.5 rounded-xl text-sm"
        />
      </div>

      {/* Submission Action Bar */}
      <div className="flex items-center justify-between pt-1 border-t border-border/60">
        <span className="text-sm text-muted-foreground">
          🎯 Target duration: 45-90s - Graded on 5 axes
        </span>

        <Button
          type="button"
          onClick={handleSubmit}
          disabled={!transcript.trim() || isEvaluating}
          className="px-5 py-2.5 rounded-xl text-sm font-bold gap-2"
        >
          {isEvaluating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Evaluating Speech with AI...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Submit for AI Report Card</span>
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}
