import { useState, useEffect, useCallback, useRef } from "react";

interface UseVoiceNarrationOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  voiceName?: string;
}

export function useVoiceNarration(options: UseVoiceNarrationOptions = {}) {
  const { rate = 0.9, pitch = 1, volume = 1, voiceName } = options;
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const queueRef = useRef<string[]>([]);
  const queueIndexRef = useRef(0);
  const speakSessionIdRef = useRef(0);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setIsSupported(true);
      
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
      };

      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;

      return () => {
        window.speechSynthesis.cancel();
      };
    }
  }, []);

  const getPreferredVoice = useCallback(() => {
    if (voiceName) {
      const namedVoice = voices.find(v => v.name.includes(voiceName));
      if (namedVoice) return namedVoice;
    }
    
    // Prefer English voices with good quality
    const preferredVoices = [
      "Google UK English Female",
      "Google US English",
      "Microsoft Zira",
      "Samantha",
      "Karen",
      "Daniel",
    ];
    
    for (const name of preferredVoices) {
      const voice = voices.find(v => v.name.includes(name));
      if (voice) return voice;
    }
    
    // Fallback to first English voice
    const englishVoice = voices.find(v => v.lang.startsWith("en"));
    return englishVoice || voices[0];
  }, [voices, voiceName]);

  const splitIntoChunks = useCallback((text: string) => {
    // Many browsers are unreliable with long utterances; chunking greatly improves stability.
    const cleaned = text
      .replace(/\s+/g, " ")
      .replace(/\n+/g, "\n")
      .trim();

    if (!cleaned) return [] as string[];

    // Prefer sentence boundaries, then fall back to hard character chunking.
    // (Avoid regex lookbehind for broader browser compatibility.)
    const roughSentences = (cleaned.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [])
      .map((s) => s.trim())
      .filter(Boolean);

    const MAX_CHARS = 160;
    const chunks: string[] = [];

    for (const s of roughSentences.length ? roughSentences : [cleaned]) {
      if (s.length <= MAX_CHARS) {
        chunks.push(s);
        continue;
      }

      // Break long sentences by words.
      const words = s.split(" ");
      let current = "";
      for (const w of words) {
        const next = current ? `${current} ${w}` : w;
        if (next.length > MAX_CHARS) {
          if (current) chunks.push(current);
          current = w;
        } else {
          current = next;
        }
      }
      if (current) chunks.push(current);
    }

    return chunks;
  }, []);

  const speakNextChunk = useCallback(
    (sessionId: number) => {
      if (!isSupported) return;
      if (sessionId !== speakSessionIdRef.current) return;

      const chunk = queueRef.current[queueIndexRef.current];
      if (!chunk) {
        setIsSpeaking(false);
        setIsPaused(false);
        return;
      }

      // Cancel anything pending before speaking the next chunk.
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(chunk);
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = volume;

      const voice = getPreferredVoice();
      if (voice) utterance.voice = voice;

      utterance.onstart = () => {
        if (sessionId !== speakSessionIdRef.current) return;
        setIsSpeaking(true);
        setIsPaused(false);
      };

      utterance.onend = () => {
        if (sessionId !== speakSessionIdRef.current) return;
        queueIndexRef.current += 1;
        speakNextChunk(sessionId);
      };

      utterance.onerror = () => {
        if (sessionId !== speakSessionIdRef.current) return;
        // Skip the problematic chunk and continue.
        queueIndexRef.current += 1;
        speakNextChunk(sessionId);
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [getPreferredVoice, isSupported, pitch, rate, volume]
  );

  const speak = useCallback(
    (text: string) => {
      if (!isSupported || !text) return;

      speakSessionIdRef.current += 1;
      const sessionId = speakSessionIdRef.current;

      queueRef.current = splitIntoChunks(text);
      queueIndexRef.current = 0;
      setIsSpeaking(queueRef.current.length > 0);
      setIsPaused(false);
      speakNextChunk(sessionId);
    },
    [isSupported, speakNextChunk, splitIntoChunks]
  );

  const pause = useCallback(() => {
    if (isSupported && isSpeaking) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  }, [isSupported, isSpeaking]);

  const resume = useCallback(() => {
    if (isSupported && isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  }, [isSupported, isPaused]);

  const stop = useCallback(() => {
    if (isSupported) {
      speakSessionIdRef.current += 1;
      queueRef.current = [];
      queueIndexRef.current = 0;
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  }, [isSupported]);

  const toggle = useCallback(() => {
    if (isPaused) {
      resume();
    } else if (isSpeaking) {
      pause();
    }
  }, [isPaused, isSpeaking, pause, resume]);

  return {
    speak,
    pause,
    resume,
    stop,
    toggle,
    isSpeaking,
    isPaused,
    isSupported,
    voices,
  };
}
