'use client';

import React, { useState, useSyncExternalStore } from 'react';
import {
  Sparkles,
  Camera,
  ShieldCheck,
  Eye,
  Lock,
  AlertTriangle,
  ArrowRight,
  Info,
} from 'lucide-react';

interface ConsentScreenProps {
  onConsentAndOpen: () => void;
  isStartingCamera: boolean;
  cameraError?: string | null;
  aiConfigured: boolean | null;
}

export function ConsentScreen({
  onConsentAndOpen,
  isStartingCamera,
  cameraError,
  aiConfigured,
}: ConsentScreenProps) {
  const [agreed, setAgreed] = useState<boolean>(false);
  const isSecureContext = useSyncExternalStore(
    () => () => {},
    () => (typeof window !== 'undefined' ? window.isSecureContext : true),
    () => true
  );

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8 sm:py-12 animate-fade-in">
      {/* Hero Card */}
      <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        {/* Decorative warm ambient accent */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-8 relative z-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-4 shadow-lg shadow-amber-500/10">
            <Sparkles className="w-7 h-7" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
            Welcome to <span className="text-amber-400">VibeCheck</span>
          </h2>
          <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
            Your live webcam style mirror. Select your vibe, check your look, and receive friendly,
            practical styling advice focused solely on your outfit.
          </p>
        </div>

        {/* Insecure Context Warning */}
        {!isSecureContext && (
          <div className="mb-6 p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs sm:text-sm flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-300 mb-1">Insecure Browser Context Detected</p>
              <p className="text-neutral-300">
                Browsers restrict camera access to secure origins. Please access VibeCheck via{' '}
                <code className="bg-neutral-800 px-1.5 py-0.5 rounded text-amber-300">
                  http://localhost:3000
                </code>{' '}
                or an HTTPS URL.
              </p>
            </div>
          </div>
        )}

        {/* Camera Error Message */}
        {cameraError && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs sm:text-sm flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-300 mb-1">Camera Access Issue</p>
              <p className="text-neutral-300">{cameraError}</p>
            </div>
          </div>
        )}

        {/* Explanation & Transparency Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 relative z-10">
          <div className="bg-neutral-950/60 border border-neutral-800/80 rounded-xl p-4 sm:p-5">
            <div className="flex items-center gap-2.5 text-amber-400 font-semibold text-sm mb-2">
              <Eye className="w-4 h-4" />
              <span>On-Device Mirror Preview</span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              The live mirror preview runs locally on your device. Audio is completely disabled, and
              no continuous video stream is ever sent or recorded.
            </p>
          </div>

          <div className="bg-neutral-950/60 border border-neutral-800/80 rounded-xl p-4 sm:p-5">
            <div className="flex items-center gap-2.5 text-amber-400 font-semibold text-sm mb-2">
              <Camera className="w-4 h-4" />
              <span>Single-Frame Check</span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Tapping <span className="text-neutral-200 font-medium">&quot;Check my outfit&quot;</span> captures
              exactly one still camera frame and securely sends it to Google&apos;s Gemini API for outfit
              analysis.
            </p>
          </div>

          <div className="bg-neutral-950/60 border border-neutral-800/80 rounded-xl p-4 sm:p-5">
            <div className="flex items-center gap-2.5 text-amber-400 font-semibold text-sm mb-2">
              <Lock className="w-4 h-4" />
              <span>Our Storage Policy</span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Our app does not intentionally store images or session logs on disk or databases.
              Provider data handling follows Google&apos;s applicable terms (we make no claims that
              Google never retains or uses data).
            </p>
          </div>

          <div className="bg-neutral-950/60 border border-neutral-800/80 rounded-xl p-4 sm:p-5">
            <div className="flex items-center gap-2.5 text-amber-400 font-semibold text-sm mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Outfit Focus &amp; Respect</span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              No attractiveness scores, body criticism, or identity recognition. We focus strictly on
              visible garments, layering, colors, and accessories.
            </p>
          </div>
        </div>

        {/* AI Key Notice */}
        {aiConfigured === false && (
          <div className="mb-6 p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-400 flex items-center gap-2.5">
            <Info className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong className="text-neutral-200">Notice:</strong> The server currently has no{' '}
              <code className="text-amber-300">GEMINI_API_KEY</code> set. You can still test the
              live camera mirror preview!
            </span>
          </div>
        )}

        {/* Consent Agreement Box */}
        <div className="bg-neutral-950/80 border border-neutral-800 rounded-xl p-4 mb-6 relative z-10">
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-neutral-700 bg-neutral-900 text-amber-500 focus:ring-amber-500 focus:ring-offset-neutral-950 transition-colors cursor-pointer"
            />
            <span className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              I understand how my camera preview and single-frame outfit check work, agree to the
              terms above, and consent to open the live mirror.
            </span>
          </label>
        </div>

        {/* CTA Button */}
        <div className="text-center relative z-10">
          <button
            onClick={onConsentAndOpen}
            disabled={!agreed || isStartingCamera}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-base font-bold transition-all duration-200 shadow-lg ${
              agreed && !isStartingCamera
                ? 'bg-amber-500 hover:bg-amber-400 text-neutral-950 shadow-amber-500/25 hover:shadow-amber-500/40 transform hover:-translate-y-0.5 cursor-pointer'
                : 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700/60'
            }`}
          >
            {isStartingCamera ? (
              <>
                <div className="w-5 h-5 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                <span>Opening Camera Mirror...</span>
              </>
            ) : (
              <>
                <Camera className="w-5 h-5" />
                <span>Open Mirror</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
          {!agreed && (
            <p className="text-xs text-neutral-500 mt-2">
              Please check the consent box above to activate the mirror.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
