"use client";

import React, { useState, useRef, useEffect } from "react";
import { Mic, Square, Trash2, Send, X, Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";

interface VoiceRecorderProps {
  onSend: (audioBlob: Blob, audioUrl: string) => void;
  onCancel: () => void;
  className?: string;
}

export default function VoiceRecorder({
  onSend,
  onCancel,
  className,
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<{
    blob: Blob;
    url: string;
  } | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playbackIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (playbackIntervalRef.current)
        clearInterval(playbackIntervalRef.current);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (recordedAudio?.url) URL.revokeObjectURL(recordedAudio.url);
    };
  }, [recordedAudio?.url]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const updateAudioLevel = () => {
    if (analyserRef.current) {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
      setAudioLevel(average / 255);
    }
    if (isRecording) {
      animationRef.current = requestAnimationFrame(updateAudioLevel);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudio({ blob: audioBlob, url: audioUrl });

        // Create audio element to get duration
        const audio = new Audio(audioUrl);
        audio.addEventListener("loadedmetadata", () => {
          setDuration(audio.duration);
        });
        audioRef.current = audio;

        stream.getTracks().forEach((track) => track.stop());
        audioContext.close();
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      intervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      updateAudioLevel();
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current || !recordedAudio) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current);
      }
    } else {
      audioRef.current.play();
      setIsPlaying(true);

      playbackIntervalRef.current = setInterval(() => {
        if (audioRef.current) {
          setPlaybackTime(audioRef.current.currentTime);
          if (audioRef.current.ended) {
            setIsPlaying(false);
            setPlaybackTime(0);
            if (playbackIntervalRef.current) {
              clearInterval(playbackIntervalRef.current);
            }
          }
        }
      }, 100);
    }
  };

  const handleSend = () => {
    if (recordedAudio) {
      onSend(recordedAudio.blob, recordedAudio.url);
    }
  };

  const handleDiscard = () => {
    if (recordedAudio?.url) {
      URL.revokeObjectURL(recordedAudio.url);
    }
    setRecordedAudio(null);
    setRecordingTime(0);
    onCancel();
  };

  // Auto-start recording when component mounts
  React.useEffect(() => {
    startRecording();
  }, []);

  // Generate waveform bars
  const generateWaveformBars = () => {
    const barCount = 40;
    const bars = [];

    for (let i = 0; i < barCount; i++) {
      const isActive = isRecording
        ? Math.random() > 0.3 && audioLevel > 0.1
        : i / barCount < playbackTime / duration;

      const height = isRecording
        ? isActive
          ? Math.random() * 20 + 10
          : 8
        : isActive
        ? 20
        : 8;

      bars.push(
        <div
          key={i}
          className="flex-shrink-0"
          style={{
            width: "3px",
            height: `${height}px`,
            backgroundColor: isActive ? "#3b82f6" : "#94a3b8",
            transition: "all 0.1s ease-out",
          }}
        />
      );
    }
    return bars;
  };

  return (
    <div className={cn("bg-gray-800 rounded-xl p-4", className)}>
      {!recordedAudio && isRecording && (
        // Recording state
        <div className="space-y-3">
          <div className="text-gray-400 text-sm">Recording...</div>

          <div className="flex items-center gap-3 bg-gray-900/50 rounded-lg p-3">
            <button
              onClick={stopRecording}
              className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors animate-pulse"
            >
              <Square className="w-4 h-4 text-white fill-white" />
            </button>

            <div className="flex items-center gap-1 flex-1 h-8">
              {generateWaveformBars()}
            </div>

            <div className="text-white font-mono text-sm min-w-[3rem] text-right">
              {formatTime(recordingTime)}
            </div>
          </div>

          <button
            onClick={handleDiscard}
            className="text-gray-400 hover:text-white text-sm transition-colors"
          >
            Cancel
          </button>
        </div>
      )}

      {recordedAudio && (
        // Preview state - matching the design in your screenshot
        <div className="space-y-3">
          <div className="text-gray-400 text-sm">Message Nick</div>

          <div className="flex items-center gap-3 bg-gray-900/50 rounded-lg p-3">
            <button
              onClick={togglePlayback}
              className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 text-white fill-white" />
              ) : (
                <Play className="w-4 h-4 text-white fill-white ml-0.5" />
              )}
            </button>

            <div className="flex items-center gap-1 flex-1 h-8">
              {generateWaveformBars()}
            </div>

            <div className="text-white font-mono text-sm min-w-[3rem] text-right">
              {formatTime(isPlaying ? playbackTime : duration)}
            </div>
          </div>

          <div className="flex justify-center gap-2">
            <button
              onClick={handleDiscard}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              title="Delete"
            >
              <Trash2 className="w-5 h-5 text-gray-400" />
            </button>

            <button
              onClick={handleSend}
              className="p-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
              title="Send"
            >
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
