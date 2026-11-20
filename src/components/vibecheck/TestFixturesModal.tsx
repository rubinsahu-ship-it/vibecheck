'use client';

import React from 'react';
import {
  X,
  FlaskConical,
  CheckCircle,
  HelpCircle,
  AlertTriangle,
  CameraOff,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import type { AdviceResponse } from '@/types/vibecheck';

interface TestFixturesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyMockAdvice: (advice: AdviceResponse) => void;
  onSimulateCameraError: (type: 'denied' | 'not_found' | 'insecure') => void;
  onSimulateLoading: () => void;
  onResetSession: () => void;
}

export function TestFixturesModal({
  isOpen,
  onClose,
  onApplyMockAdvice,
  onSimulateCameraError,
  onSimulateLoading,
  onResetSession,
}: TestFixturesModalProps) {
  if (!isOpen) return null;

  // 1. Fixture: Successful advice (Casual vibe)
  const applySuccessCasualFixture = () => {
    onApplyMockAdvice({
      success: true,
      isMock: true,
      vibe: 'Casual',
      isOutfitVisible: true,
      observation:
        'A charcoal relaxed-fit waffle-knit sweater paired with light-wash denim and a minimalist silver cuff bracelet.',
      suggestions: [
        'Layer a crisp white crewneck tee underneath so the collar peeks through for effortless contrast.',
        'Consider cuffing the denim hem once to highlight low-profile clean white sneakers or desert boots.',
        'Add a structured olive overshirt or canvas tote bag for an intentional texture contrast.',
      ],
      feedbackMessage:
        'Style advice is subjective—wear what makes you feel relaxed and confident.',
    });
    onClose();
  };

  // 2. Fixture: Successful advice (Corporate vibe)
  const applySuccessCorporateFixture = () => {
    onApplyMockAdvice({
      success: true,
      isMock: true,
      vibe: 'Corporate',
      isOutfitVisible: true,
      observation:
        'A tailored navy blazer worn over an off-white button-up shirt with subtle pinstripes.',
      suggestions: [
        'Add a subtle silk pocket square in champagne or dusty rose to break up the monochromatic navy.',
        'Ensure the sleeve length of the shirt extends about 1/4 inch past the blazer cuff for a sharp finish.',
        'Pair with dark oxblood or cognac oxford shoes and a matching leather belt to tie the ensemble together.',
      ],
      feedbackMessage:
        'Style advice is subjective—wear what empowers your professional presence.',
    });
    onClose();
  };

  // 3. Fixture: Outfit not visible (e.g. face close-up or obscured)
  const applyNotVisibleFixture = () => {
    onApplyMockAdvice({
      success: true,
      isMock: true,
      vibe: 'Party',
      isOutfitVisible: false,
      observation:
        'Only facial features and upper collar are visible in the frame; clothing silhouette is cropped out.',
      suggestions: [],
      feedbackMessage:
        'Your outfit is not sufficiently visible in the mirror frame. Please step back 2-3 paces or tilt your webcam downward so your clothing layers are in view, then tap "Check my outfit" again.',
    });
    onClose();
  };

  // 4. Fixture: AI key not configured on server
  const applyNotConfiguredFixture = () => {
    onApplyMockAdvice({
      success: false,
      notConfigured: true,
      isMock: true,
      vibe: 'Festive',
      isOutfitVisible: false,
      error: 'AI advice is not connected. GEMINI_API_KEY is not configured on the server.',
      observation: 'Mirror preview is active, but AI styling advice is offline.',
      suggestions: [
        'To connect AI analysis, set GEMINI_API_KEY in .env.local on the server.',
        'Obtain an API key from Google AI Studio (https://aistudio.google.com/).',
        'Restart the development server after adding your key.',
      ],
      feedbackMessage:
        'The live mirror preview is functional, but Gemini API access requires an API key.',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-neutral-900 border border-neutral-700/80 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2 text-amber-400 font-bold">
            <FlaskConical className="w-5 h-5" />
            <span className="text-white">Developer Test Fixtures</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-neutral-400 mt-3 mb-5 leading-relaxed">
          Use these labeled test fixtures to verify UI rendering, responsive layouts, error
          handling, and edge cases without making live API calls or requiring physical camera movement.
        </p>

        {/* Fixture options */}
        <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
          {/* Mock Casual Advice */}
          <button
            onClick={applySuccessCasualFixture}
            className="w-full text-left p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-amber-500/50 hover:bg-neutral-800/50 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <CheckCircle className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block group-hover:text-amber-300">
                  Mock Successful Advice (Casual Vibe)
                </span>
                <span className="text-[11px] text-neutral-400">
                  Tests 1 observation + 3 styled suggestions layout
                </span>
              </div>
            </div>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/30">
              Mock
            </span>
          </button>

          {/* Mock Corporate Advice */}
          <button
            onClick={applySuccessCorporateFixture}
            className="w-full text-left p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-amber-500/50 hover:bg-neutral-800/50 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block group-hover:text-amber-300">
                  Mock Successful Advice (Corporate Vibe)
                </span>
                <span className="text-[11px] text-neutral-400">
                  Tests professional tailoring suggestions
                </span>
              </div>
            </div>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/30">
              Mock
            </span>
          </button>

          {/* Mock Outfit Not Visible */}
          <button
            onClick={applyNotVisibleFixture}
            className="w-full text-left p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-amber-500/50 hover:bg-neutral-800/50 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block group-hover:text-amber-300">
                  Mock &quot;Outfit Not Visible&quot; Notice
                </span>
                <span className="text-[11px] text-neutral-400">
                  Tests camera repositioning and framing tips
                </span>
              </div>
            </div>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/30">
              Mock
            </span>
          </button>

          {/* Mock Server Offline / No Key */}
          <button
            onClick={applyNotConfiguredFixture}
            className="w-full text-left p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-amber-500/50 hover:bg-neutral-800/50 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-neutral-800 text-neutral-400">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block group-hover:text-amber-300">
                  Simulate &quot;AI Key Offline&quot; Response
                </span>
                <span className="text-[11px] text-neutral-400">
                  Tests honest notice when GEMINI_API_KEY is unset
                </span>
              </div>
            </div>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/30">
              Offline
            </span>
          </button>

          {/* Simulate Camera Permission Denied */}
          <button
            onClick={() => {
              onSimulateCameraError('denied');
              onClose();
            }}
            className="w-full text-left p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-red-500/50 hover:bg-neutral-800/50 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/10 text-red-400">
                <CameraOff className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block group-hover:text-red-300">
                  Simulate Camera Permission Refusal
                </span>
                <span className="text-[11px] text-neutral-400">
                  Tests NotAllowedError UI with troubleshooting steps
                </span>
              </div>
            </div>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-500/30">
              Error
            </span>
          </button>

          {/* Simulate Loading Scan State */}
          <button
            onClick={() => {
              onSimulateLoading();
              onClose();
            }}
            className="w-full text-left p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-amber-500/50 hover:bg-neutral-800/50 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                <RotateCcw className="w-4 h-4 animate-spin" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block group-hover:text-amber-300">
                  Simulate In-Flight Analysis Scan (5s)
                </span>
                <span className="text-[11px] text-neutral-400">
                  Tests laser sweep animation and button disabling
                </span>
              </div>
            </div>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 border border-neutral-700">
              State
            </span>
          </button>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-neutral-800 flex justify-between items-center">
          <button
            onClick={() => {
              onResetSession();
              onClose();
            }}
            className="text-xs text-neutral-400 hover:text-white underline cursor-pointer"
          >
            Reset Session to Consent Screen
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-white transition-colors"
          >
            Close Drawer
          </button>
        </div>
      </div>
    </div>
  );
}
