"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  X,
  Plus,
  Minus,
  RotateCw,
  Download as DownloadIcon,
  ExternalLink,
} from "lucide-react";

interface ImageViewerProps {
  url: string;
  alt?: string;
  onClose: () => void;
}

export default function ImageViewer({ url, alt, onClose }: ImageViewerProps) {
  const [scale, setScale] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0); // degrees

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const isPanningRef = useRef(false);
  const panStartRef = useRef<{
    x: number;
    y: number;
    left: number;
    top: number;
  }>({
    x: 0,
    y: 0,
    left: 0,
    top: 0,
  });

  const handleZoomIn = () =>
    setScale((s) => Math.min(5, +(s + 0.25).toFixed(2)));
  const handleZoomOut = () =>
    setScale((s) => Math.max(0.25, +(s - 0.25).toFixed(2)));
  const handleRotate = () => setRotation((r) => (r + 90) % 360);

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = url;
    const filename = url.split("/").pop() || "image";
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleOpenNew = () => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScale((s) => (s === 1 ? 2 : 1));
  };

  const onMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return;
    e.preventDefault();
    e.stopPropagation();
    const sc = scrollRef.current;
    if (!sc) return;
    isPanningRef.current = true;
    panStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      left: sc.scrollLeft,
      top: sc.scrollTop,
    };
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isPanningRef.current) return;
    const sc = scrollRef.current;
    if (!sc) return;
    const dx = e.clientX - panStartRef.current.x;
    const dy = e.clientY - panStartRef.current.y;
    sc.scrollLeft = panStartRef.current.left - dx;
    sc.scrollTop = panStartRef.current.top - dy;
  };

  const onMouseUp = () => {
    isPanningRef.current = false;
  };

  const onWheel = (e: React.WheelEvent) => {
    if (!e.ctrlKey) return; // allow pinch-to-zoom gesture (trackpads)
    e.preventDefault();
    if (e.deltaY < 0) handleZoomIn();
    else handleZoomOut();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <button
        aria-label="Close"
        className="absolute top-4 right-4 text-white/80 hover:text-white p-2 cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        <X className="size-6" />
      </button>

      {/* Toolbar */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/10 backdrop-blur-md text-white rounded-full px-3 py-2 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="p-2 rounded-full hover:bg-white/10"
          aria-label="Zoom out"
          onClick={handleZoomOut}
        >
          <Minus className="size-5" />
        </button>
        <button
          className="p-2 rounded-full hover:bg-white/10"
          aria-label="Zoom in"
          onClick={handleZoomIn}
        >
          <Plus className="size-5" />
        </button>
        <div className="mx-2 h-5 w-px bg-white/20" />
        <button
          className="p-2 rounded-full hover:bg-white/10"
          aria-label="Rotate"
          onClick={handleRotate}
        >
          <RotateCw className="size-5" />
        </button>
        <div className="mx-2 h-5 w-px bg-white/20" />
        <button
          className="p-2 rounded-full hover:bg-white/10"
          aria-label="Download"
          onClick={handleDownload}
        >
          <DownloadIcon className="size-5" />
        </button>
        <button
          className="p-2 rounded-full hover:bg-white/10"
          aria-label="Open in new window"
          onClick={handleOpenNew}
        >
          <ExternalLink className="size-5" />
        </button>
      </div>

      {/* Image viewport with scroll for panning when zoomed */}
      <div
        ref={scrollRef}
        className="max-w-[90vw] max-h-[85vh] overflow-auto cursor-grab active:cursor-grabbing"
        onClick={(e) => e.stopPropagation()}
        onDoubleClick={handleDoubleClick}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onWheel={onWheel}
      >
        <Image
          src={url}
          alt={alt || "image"}
          className="rounded-lg shadow-2xl select-none"
          style={{
            transform: `scale(${scale}) rotate(${rotation}deg)`,
            transformOrigin: "center center",
            maxWidth: "90vw",
            maxHeight: "85vh",
            objectFit: "contain",
          }}
          draggable={false}
        />
      </div>
    </div>
  );
}
