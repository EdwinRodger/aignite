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
  Sparkles,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { transcribeAudioAction } from '@/app/actions/coach';

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
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [mode, setMode] = useState<'voice' | 'text'>('voice');
  const [transcript, setTranscript] = useState('');
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [speechApiAvailable, setSpeechApiAvailable] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // References to decouple timer and recognition from re-renders
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const isRecordingRef = useRef(false);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const transcriptRef = useRef('');

  // Keep transcriptRef in sync with transcript state
  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  // Detect Web Speech API availability on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const windowWithSpeech = window as unknown as {
        SpeechRecognition?: new () => SpeechRecognitionInstance;
        webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
      };
      const SpeechRecognitionConstructor =
        windowWithSpeech.SpeechRecognition || windowWithSpeech.webkitSpeechRecognition;

      setSpeechApiAvailable(Boolean(SpeechRecognitionConstructor));
    }

    return () => {
      isRecordingRef.current = false;
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
        recognitionRef.current = null;
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
        mediaStreamRef.current = null;
      }
    };
  }, []);

  const startRecording = async () => {
    setMicError(null);
    setValidationError(null);
    audioChunksRef.current = [];

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      mediaStreamRef.current = stream;
    } catch (err) {
      console.warn('Microphone permission check failed:', err);
      setMicError(
        'Microphone access was denied. Please allow microphone permissions in your browser or switch to Text Entry mode.'
      );
      return;
    }

    setTranscript('');
    transcriptRef.current = '';
    setSecondsElapsed(0);
    setIsRecording(true);
    isRecordingRef.current = true;

    // Start timer interval
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);

    // Start MediaRecorder for rock-solid audio capture
    try {
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : 'audio/mp4';

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(250);
    } catch (mediaErr) {
      console.warn('MediaRecorder error:', mediaErr);
    }

    // Start fresh Web Speech API instance for real-time live preview
    if (typeof window !== 'undefined') {
      const windowWithSpeech = window as unknown as {
        SpeechRecognition?: new () => SpeechRecognitionInstance;
        webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
      };
      const SpeechRecognitionConstructor =
        windowWithSpeech.SpeechRecognition || windowWithSpeech.webkitSpeechRecognition;

      if (SpeechRecognitionConstructor) {
        try {
          if (recognitionRef.current) {
            try {
              recognitionRef.current.stop();
            } catch {
              // ignore
            }
            recognitionRef.current = null;
          }

          const recognition = new SpeechRecognitionConstructor();
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.lang = 'en-US';

          recognition.onresult = (event: SpeechRecognitionEvent) => {
            let liveText = '';
            for (let i = 0; i < event.results.length; i++) {
              if (event.results[i] && event.results[i][0]) {
                liveText += event.results[i][0].transcript + ' ';
              }
            }
            const trimmed = liveText.trim();
            if (trimmed) {
              setTranscript(trimmed);
              transcriptRef.current = trimmed;
              setValidationError(null);
            }
          };

          recognition.onerror = (event: { error: string }) => {
            console.warn('SpeechRecognition live event:', event.error);
          };

          recognition.onend = () => {
            if (isRecordingRef.current && recognitionRef.current) {
              try {
                recognitionRef.current.start();
              } catch {
                // Ignore in-flight restarts
              }
            }
          };

          recognitionRef.current = recognition;
          recognition.start();
        } catch (speechErr) {
          console.warn('Could not start live speech recognition:', speechErr);
        }
      }
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    isRecordingRef.current = false;
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    }

    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== 'inactive') {
      recorder.onstop = async () => {
        // Release audio stream tracks
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((track) => track.stop());
          mediaStreamRef.current = null;
        }

        const blob = new Blob(audioChunksRef.current, {
          type: recorder.mimeType || 'audio/webm',
        });

        // Transcribe audio blob via Whisper STT
        if (blob.size > 500) {
          setIsTranscribing(true);
          try {
            const formData = new FormData();
            formData.append('audio', blob, 'candidate_answer.webm');
            const res = await transcribeAudioAction(formData);

            if (res.success && res.transcript && res.transcript.trim()) {
              setTranscript(res.transcript.trim());
              transcriptRef.current = res.transcript.trim();
              setValidationError(null);
            } else if (!transcriptRef.current.trim()) {
              setValidationError(
                res.error || 'Could not detect clear speech. Please speak louder or switch to Text Entry mode.'
              );
            }
          } catch (err) {
            console.error('Transcription error:', err);
            if (!transcriptRef.current.trim()) {
              setValidationError('Voice transcription failed. Please use Text Entry mode.');
            }
          } finally {
            setIsTranscribing(false);
          }
        } else if (!transcriptRef.current.trim()) {
          setValidationError('No audio recorded. Please hold the mic button and speak clearly.');
        }
      };

      try {
        recorder.stop();
      } catch {
        // ignore
      }
    } else if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
  };

  const handleReset = () => {
    stopRecording();
    setTranscript('');
    transcriptRef.current = '';
    setSecondsElapsed(0);
    setValidationError(null);
    setMicError(null);
  };

  const wordCount = transcript.trim().split(/\s+/).filter(Boolean).length;

  const handleSubmit = () => {
    if (wordCount < 10) {
      setValidationError(
        `Please provide a more complete answer (minimum 10 words required, currently ${wordCount} words). Explain the concept so the AI can evaluate your response.`
      );
      return;
    }
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
                disabled={isEvaluating || isTranscribing}
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
                <span>Finish Spoken Answer</span>
              </Button>
            )}

            {(transcript || secondsElapsed > 0) && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleReset}
                disabled={isTranscribing || isEvaluating}
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
              ? 'Listening live... Speak clearly and watch your speech transcribe in real-time below.'
              : isTranscribing
              ? 'Refining audio with Whisper STT...'
              : 'Tap to record. Speak at a confident, deliberate pace (120-150 WPM).'}
          </p>

          {isTranscribing && (
            <div className="flex items-center gap-2 text-sm text-primary font-semibold bg-primary/10 px-3.5 py-1.5 rounded-lg border border-primary/20 animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Transcribing speech with Whisper STT...</span>
            </div>
          )}

          {micError && (
            <div className="flex items-center gap-1.5 text-sm text-destructive bg-destructive/10 px-3 py-1.5 rounded-lg border border-destructive/20 text-left">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{micError}</span>
            </div>
          )}
        </div>
      )}

      {/* Transcript Editor / Fallback Text Input */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-sm font-semibold text-foreground">
          <div className="flex items-center gap-2">
            <span>{mode === 'voice' ? 'Spoken Transcript (Editable):' : 'Type Your Technical Answer:'}</span>
            {isRecording && (
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-sm font-medium animate-pulse">
                Live Transcribing
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-sm font-mono">
            <span
              className={
                wordCount >= 10
                  ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                  : 'text-muted-foreground'
              }
            >
              {wordCount} / 10 words min
            </span>
            {wordCount >= 10 && (
              <span className="text-emerald-600 dark:text-emerald-400 text-sm">✓</span>
            )}
          </div>
        </div>

        <Textarea
          value={transcript}
          onChange={(e) => {
            setTranscript(e.target.value);
            if (validationError && e.target.value.trim().split(/\s+/).filter(Boolean).length >= 10) {
              setValidationError(null);
            }
          }}
          placeholder={
            mode === 'voice'
              ? 'Your speech will transcribe here in real-time as you speak, or you can edit it before submission...'
              : 'Provide your technical response explaining the architecture, trade-offs, and failure cases...'
          }
          rows={4}
          className="w-full p-3.5 rounded-xl text-sm"
        />

        {validationError && (
          <div className="flex items-center gap-1.5 text-sm text-destructive bg-destructive/10 px-3 py-1.5 rounded-lg border border-destructive/20">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}
      </div>

      {/* Submission Action Bar */}
      <div className="flex items-center justify-between pt-1 border-t border-border/60">
        <div className="flex items-center gap-2">
          {isRecording ? (
            <span className="flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live speech preview active
            </span>
          ) : isTranscribing ? (
            <span className="flex items-center gap-1.5 text-sm text-primary font-medium animate-pulse">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Refining with Whisper STT...
            </span>
          ) : transcript.trim() ? (
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              Transcript ready for review
            </span>
          ) : (
            <span className="text-sm text-muted-foreground">
              Ready to record or type
            </span>
          )}
        </div>

        <Button
          type="button"
          onClick={handleSubmit}
          disabled={!transcript.trim() || isEvaluating || isTranscribing}
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
