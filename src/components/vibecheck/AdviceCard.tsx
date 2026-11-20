'use client';

import React from 'react';
import type { AdviceResponse } from '@/types/vibecheck';
import {
  Sparkles,
  AlertCircle,
  RotateCcw,
  UserCheck,
  CheckCircle2,
  HelpCircle,
  Layers,
  Palette,
  Footprints,
  Info,
} from 'lucide-react';

interface AdviceCardProps {
  advice: AdviceResponse;
  onTryAgain: () => void;
  onNextVisitor: () => void;
  isAnalyzing: boolean;
}

export function AdviceCard({
  advice,
  onTryAgain,
  onNextVisitor,
  isAnalyzing,
}: AdviceCardProps) {
  const {
    observation,
    suggestions,
    isOutfitVisible,
    feedbackMessage,
    vibe,
    notConfigured,
    isMock,
    error,
  } = advice;

  // Custom icon for suggestion index
  const getSuggestionIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Layers className="w-4 h-4 text-amber-400" />;
      case 1:
        return <Palette className="w-4 h-4 text-amber-400" />;
      case 2:
        return <Footprints className="w-4 h-4 text-amber-400" />;
      default:
        return <CheckCircle2 className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="w-full bg-neutral-900/95 border border-neutral-800 rounded-2xl p-5 sm:p-7 backdrop-blur-xl shadow-2xl animate-fade-in relative overflow-hidden">
      {/* Top Banner for Test Fixture or Missing Config */}
      {isMock && (
        <div className="mb-4 -mt-2 -mx-2 px-3 py-1.5 rounded-lg bg-purple-950/70 border border-purple-500/40 text-purple-200 text-xs font-semibold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-400" />
          <span>LABELED TEST FIXTURE: Simulated Result (Not a Live AI Request)</span>
        </div>
      )}

      {notConfigured && (
        <div className="mb-5 p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs sm:text-sm">
          <div className="flex items-center gap-2 font-bold text-amber-300 mb-1">
            <Info className="w-4 h-4" />
            <span>AI Advice Not Connected</span>
          </div>
          <p className="text-neutral-300 mb-2">
            The mirror preview is running, but no styling advice can be generated because{' '}
            <code className="text-amber-300 bg-neutral-900 px-1 py-0.5 rounded">GEMINI_API_KEY</code>{' '}
            is not set in your server&apos;s environment (<code className="text-amber-300">.env.local</code>).
          </p>
          <p className="text-neutral-400 text-xs">
            Per app design, we do not generate fake simulated responses in production mode.
          </p>
        </div>
      )}

      {/* General Error Banner */}
      {error && !notConfigured && (
        <div className="mb-5 p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs sm:text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-300 mb-0.5">Advice Service Notice</p>
            <p className="text-neutral-300">{error}</p>
          </div>
        </div>
      )}

      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-4 border-b border-neutral-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white">Outfit Advice</h3>
            <p className="text-xs text-neutral-400">
              Target Vibe: <span className="text-amber-300 font-bold">{vibe || 'Selected'}</span>
            </p>
          </div>
        </div>

        {isOutfitVisible !== false && (
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-medium">
            Outfit Captured
          </span>
        )}
      </div>

      {/* Insufficient Outfit Visibility Warning */}
      {isOutfitVisible === false && (
        <div className="mb-5 p-4 sm:p-5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-neutral-200">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm mb-2">
            <HelpCircle className="w-4 h-4" />
            <span>Adjust Camera Framing</span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-3">
            {feedbackMessage ||
              'Your clothing is not sufficiently visible in the mirror. Please step back or tilt your webcam downward so your outfit can be seen clearly.'}
          </p>
          <div className="bg-neutral-950/60 rounded-lg p-3 text-xs text-neutral-400 border border-neutral-800/80">
            <strong className="text-neutral-300">Quick Tips:</strong>
            <ul className="list-disc list-inside mt-1 space-y-0.5 text-neutral-400">
              <li>Step 2-3 paces back from your laptop or phone.</li>
              <li>Ensure your room has adequate front-facing light.</li>
              <li>Angle camera to show your torso, layers, and jacket/top.</li>
            </ul>
          </div>
        </div>
      )}

      {/* Outfit Observation Section */}
      {observation && (
        <div className="mb-5">
          <span className="text-xs uppercase tracking-wider font-semibold text-neutral-400 block mb-1.5">
            Mirror Observation
          </span>
          <div className="bg-neutral-950/70 border border-neutral-800 rounded-xl p-4 text-sm text-neutral-200 leading-relaxed">
            &ldquo;{observation}&rdquo;
          </div>
        </div>
      )}

      {/* 3 Practical Styling Suggestions */}
      {suggestions && suggestions.length > 0 && isOutfitVisible !== false && (
        <div className="mb-6">
          <span className="text-xs uppercase tracking-wider font-semibold text-neutral-400 block mb-2.5">
            Styling Suggestions for {vibe}
          </span>
          <div className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="bg-neutral-950/50 border border-neutral-800/80 hover:border-neutral-700/80 rounded-xl p-3.5 sm:p-4 flex items-start gap-3 transition-colors"
              >
                <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 shrink-0 mt-0.5">
                  {getSuggestionIcon(index)}
                </div>
                <div className="flex-1">
                  <div className="text-xs font-semibold text-amber-400 mb-0.5">
                    Suggestion #{index + 1}
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                    {suggestion}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subjective Fashion Disclaimer */}
      <div className="p-3 rounded-xl bg-neutral-950/40 border border-neutral-800/60 mb-6 text-[11px] text-neutral-400 flex items-center gap-2">
        <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span>
          Style advice is purely subjective. Fashion is personal expression—wear what makes you feel
          confident and comfortable.
        </span>
      </div>

      {/* Actions: Try Again & Next Visitor */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <button
          onClick={onTryAgain}
          disabled={isAnalyzing}
          className="w-full sm:flex-1 py-3.5 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-amber-500/20 cursor-pointer disabled:opacity-50"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Try Again</span>
        </button>

        <button
          onClick={onNextVisitor}
          disabled={isAnalyzing}
          className="w-full sm:flex-1 py-3.5 px-5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white font-semibold text-sm border border-neutral-700 hover:border-neutral-600 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <UserCheck className="w-4 h-4 text-amber-400" />
          <span>Next Visitor</span>
        </button>
      </div>
    </div>
  );
}
