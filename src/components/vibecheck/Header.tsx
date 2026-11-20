'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Camera, ShieldCheck, AlertCircle, RefreshCw, FlaskConical } from 'lucide-react';
import type { CameraStatus } from '@/hooks/useCamera';

interface HeaderProps {
  cameraStatus: CameraStatus;
  aiConfigured: boolean | null;
  onNextVisitor: () => void;
  showNextVisitor: boolean;
  onOpenTestDrawer: () => void;
}

export function Header({
  cameraStatus,
  aiConfigured,
  onNextVisitor,
  showNextVisitor,
  onOpenTestDrawer,
}: HeaderProps) {
  return (
    <header className="w-full border-b border-neutral-800/80 bg-neutral-950/80 backdrop-blur-md px-4 sm:px-6 py-3.5 z-40 sticky top-0 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-neutral-950 shadow-md shadow-amber-500/20">
            <Sparkles className="w-5 h-5 fill-neutral-950 text-neutral-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white">VibeCheck</h1>
              <span className="text-[10px] tracking-wider uppercase font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                AI Mirror
              </span>
            </div>
            <p className="text-xs text-neutral-400 hidden sm:block">
              Webcam styling advice for your chosen vibe
            </p>
          </div>
        </div>

        {/* Status Indicators & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Camera Status Badge */}
          <div
            className={`hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
              cameraStatus === 'active'
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                : cameraStatus === 'requesting'
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                : 'bg-neutral-800/60 text-neutral-400 border-neutral-700/60'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>
              {cameraStatus === 'active'
                ? 'Camera Live'
                : cameraStatus === 'requesting'
                ? 'Starting Camera...'
                : 'Camera Off'}
            </span>
          </div>

          {/* AI Connection Badge */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
              aiConfigured === true
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                : aiConfigured === false
                ? 'bg-neutral-800 text-neutral-400 border-neutral-700'
                : 'bg-neutral-800/40 text-neutral-500 border-neutral-700/40'
            }`}
            title={
              aiConfigured === true
                ? 'Google Gemini API key configured server-side'
                : 'GEMINI_API_KEY not configured on server (Preview only)'
            }
          >
            {aiConfigured === true ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Gemini AI</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </>
            ) : aiConfigured === false ? (
              <>
                <AlertCircle className="w-3.5 h-3.5 text-neutral-400" />
                <span className="hidden sm:inline">Preview Only</span>
                <span className="text-[10px] text-amber-400/90 hidden lg:inline">(No API Key)</span>
              </>
            ) : (
              <span>Checking AI...</span>
            )}
          </div>

          {/* Test Fixtures Drawer Toggle */}
          <button
            onClick={onOpenTestDrawer}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-300 bg-neutral-800/70 hover:bg-neutral-800 border border-neutral-700 hover:border-neutral-600 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            title="Open Developer Test Fixtures"
          >
            <FlaskConical className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Test Fixtures</span>
          </button>

          {/* Fitting Room Studio Link */}
          <Link
            href="/studio"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-400 hover:text-neutral-200 bg-neutral-900/60 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 transition-colors"
            title="Open VirtuFit Fitting Room Studio"
          >
            <span>Fitting Room ↗</span>
          </Link>

          {/* Next Visitor Button */}
          {showNextVisitor && (
            <button
              onClick={onNextVisitor}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-600 hover:border-neutral-500 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
              <span>Next Visitor</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
