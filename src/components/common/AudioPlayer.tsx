"use client";

import React, { useRef, useState } from "react";
import WaveSurfer from "@wavesurfer/react";
import { cn } from "@/lib/utils";
import { Pause, Play } from "lucide-react";

interface AudioPlayerProps {
  audioUrl: string;
  className?: string;
}

export default function AudioPlayer({ audioUrl, className }: AudioPlayerProps) {
  const wavesurferRef = useRef<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState("0:00");

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${secs}`;
  };

  const onReady = (ws: any) => {
    wavesurferRef.current = ws;
    setDuration(formatTime(ws.getDuration()));
  };

  const onPlay = () => {
    setIsPlaying(true);
  };

  const onPause = () => {
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.playPause();
    }
  };

  return (
    <div
      className={cn(
        "flex items-center bg-gray-200 p-3 rounded-lg w-80 text-white",
        className
      )}
    >
      <button
        onClick={togglePlay}
        className="bg-blue-500 hover:bg-blue-600 border-none rounded-full w-8 h-8 flex items-center justify-center cursor-pointer mr-3 text-white transition-colors"
      >
        {isPlaying ? (
          <Pause className="w-4 h-4" />
        ) : (
          <Play className="w-4 h-4" />
        )}
      </button>

      <div className="flex-1">
        <WaveSurfer
          height={40}
          waveColor="#999"
          progressColor="#00aaff"
          url={audioUrl}
          onReady={onReady}
          onPlay={onPlay}
          onPause={onPause}
          barWidth={2}
        />
      </div>

      <span className="ml-3 text-sm text-gray-800">{duration}</span>
    </div>
  );
}
