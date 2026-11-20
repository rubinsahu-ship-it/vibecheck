'use client';

import React from 'react';
import { Camera, CameraOff, AlertTriangle, RefreshCw, VolumeX } from 'lucide-react';
import type { CameraStatus } from '@/hooks/useCamera';

interface MirrorViewProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  cameraStatus: CameraStatus;
  errorMessage: string | null;
  onStopCamera: () => void;
  onRestartCamera: () => void;
  isAnalyzing: boolean;
  isMirrored: boolean;
  toggleMirror: () => void;
}

export function MirrorView({
  videoRef,
  canvasRef,
  cameraStatus,
  errorMessage,
  onStopCamera,
  onRestartCamera,
  isAnalyzing,
  isMirrored,
}: MirrorViewProps) {
  const isVideoActive = cameraStatus === 'active';

  return (
    <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] max-h-[70vh] bg-neutral-950 rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl flex items-center justify-center group">
      {/* Hidden canvas for high-quality single frame snapshot capture */}
      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />

      {/* Video Element for live preview */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isMirrored ? 'mirrored-video' : ''
        } ${isVideoActive ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* Camera Inactive / Error Overlay */}
      {!isVideoActive && (
        <div className="absolute inset-0 bg-neutral-950/95 flex flex-col items-center justify-center p-6 text-center z-20">
          <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-500 mb-4">
            {cameraStatus === 'denied' || cameraStatus === 'error' ? (
              <AlertTriangle className="w-8 h-8 text-amber-500" />
            ) : cameraStatus === 'stopped' ? (
              <CameraOff className="w-8 h-8 text-neutral-400" />
            ) : (
              <Camera className="w-8 h-8 text-neutral-400" />
            )}
          </div>

          <h3 className="text-lg font-bold text-white mb-2">
            {cameraStatus === 'stopped'
              ? 'Mirror Camera Paused'
              : cameraStatus === 'denied'
              ? 'Camera Access Denied'
              : cameraStatus === 'not_found'
              ? 'No Webcam Found'
              : cameraStatus === 'insecure'
              ? 'Insecure Browser Context'
              : cameraStatus === 'requesting'
              ? 'Connecting to Camera...'
              : 'Camera Inactive'}
          </h3>

          <p className="text-xs sm:text-sm text-neutral-400 max-w-md mb-6 leading-relaxed">
            {errorMessage ||
              (cameraStatus === 'stopped'
                ? 'The camera stream is paused. You can restart the preview at any time.'
                : 'Please enable camera access in your browser to view your live outfit mirror.')}
          </p>

          <button
            onClick={onRestartCamera}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Restart Camera</span>
          </button>
        </div>
      )}

      {/* Analyzing Laser Sweep Animation */}
      {isAnalyzing && (
        <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
          {/* Subtle scanning glow line */}
          <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_15px_#f59e0b] animate-scan-sweep" />
          <div className="absolute inset-0 bg-amber-500/5 backdrop-brightness-110" />
        </div>
      )}

      {/* Mirror Overlays & Status Pill */}
      {isVideoActive && (
        <>
          {/* Top Control Bar inside mirror */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-auto">
            {/* Live Indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-950/70 backdrop-blur-md border border-neutral-800/80 text-[11px] font-medium text-neutral-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live Mirror</span>
              <span className="text-neutral-500">|</span>
              <span className="flex items-center gap-1 text-neutral-400">
                <VolumeX className="w-3 h-3" />
                Muted
              </span>
            </div>

            {/* Stop Camera Button */}
            <button
              onClick={onStopCamera}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-950/70 hover:bg-red-950/80 text-neutral-300 hover:text-red-300 border border-neutral-800/80 hover:border-red-500/40 text-xs font-semibold backdrop-blur-md transition-all shadow-sm cursor-pointer"
              title="Stop camera stream"
            >
              <CameraOff className="w-3.5 h-3.5" />
              <span>Stop Camera</span>
            </button>
          </div>

          {/* Bottom Mirror Guideline */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-center pointer-events-none z-20">
            <span className="text-[11px] font-medium px-3 py-1 rounded-full bg-neutral-950/70 backdrop-blur-md border border-neutral-800/60 text-neutral-400">
              Tip: Stand back so your upper body and clothing are centered in the frame.
            </span>
          </div>
        </>
      )}
    </div>
  );
}
