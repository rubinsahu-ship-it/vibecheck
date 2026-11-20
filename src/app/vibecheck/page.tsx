'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useCamera } from '@/hooks/useCamera';
import { Header } from '@/components/vibecheck/Header';
import { ConsentScreen } from '@/components/vibecheck/ConsentScreen';
import { MirrorView } from '@/components/vibecheck/MirrorView';
import { VibeSelector } from '@/components/vibecheck/VibeSelector';
import { AdviceCard } from '@/components/vibecheck/AdviceCard';
import { TestFixturesModal } from '@/components/vibecheck/TestFixturesModal';
import type { AdviceResponse, SystemStatusResponse } from '@/types/vibecheck';
import { Sparkles, AlertCircle, ShieldAlert } from 'lucide-react';

export default function VibeCheckPage() {
  // Session & Flow States
  const [hasConsented, setHasConsented] = useState<boolean>(false);
  const [selectedVibe, setSelectedVibe] = useState<string>('Casual');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [advice, setAdvice] = useState<AdviceResponse | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  // System & API status
  const [aiConfigured, setAiConfigured] = useState<boolean | null>(null);
  const [modelName, setModelName] = useState<string>('gemini-2.5-flash');

  // Test drawer state
  const [isTestDrawerOpen, setIsTestDrawerOpen] = useState<boolean>(false);

  // Custom Camera Hook
  const {
    videoRef,
    canvasRef,
    status: cameraStatus,
    errorMessage: cameraErrorMessage,
    startCamera,
    stopCamera,
    captureFrame,
    isMirrored,
    toggleMirror,
  } = useCamera();

  // Check server configuration status on mount
  useEffect(() => {
    async function checkServerStatus() {
      try {
        const res = await fetch('/api/vibecheck/status');
        if (res.ok) {
          const data: SystemStatusResponse = await res.json();
          setAiConfigured(data.configured);
          if (data.model) setModelName(data.model);
        } else {
          setAiConfigured(false);
        }
      } catch (err) {
        console.warn('Could not query /api/status:', err);
        setAiConfigured(false);
      }
    }

    checkServerStatus();
  }, []);

  // Step 1: User agrees to consent and opens the mirror
  const handleConsentAndOpen = async () => {
    setGeneralError(null);
    const success = await startCamera();
    if (success) {
      setHasConsented(true);
    }
  };

  // Step 4: Check My Outfit
  const handleCheckOutfit = async () => {
    if (isAnalyzing) return; // Prevent duplicate requests

    setGeneralError(null);

    // 1. Capture single frame from live video
    const frameBase64 = captureFrame();
    if (!frameBase64) {
      setGeneralError(
        'Could not capture a frame from the camera. Please make sure your mirror preview is active and try again.'
      );
      return;
    }

    setIsAnalyzing(true);

    try {
      // 2. Send single frame + selected vibe to /api/vibecheck/advice
      const response = await fetch('/api/vibecheck/advice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: frameBase64,
          vibe: selectedVibe,
        }),
      });

      const data: AdviceResponse = await response.json();

      if (response.ok && data) {
        setAdvice(data);
      } else {
        setAdvice({
          success: false,
          vibe: selectedVibe,
          error:
            data?.error ||
            `The styling server returned an error (HTTP ${response.status}). Please try again.`,
          isOutfitVisible: false,
        });
      }
    } catch (err) {
      console.error('Outfit check fetch error:', err);
      setAdvice({
        success: false,
        vibe: selectedVibe,
        error:
          'Network error contacting the style advisor. Please check your connection and try again.',
        isOutfitVisible: false,
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Try again: Keeps camera active, clears current advice
  const handleTryAgain = () => {
    setAdvice(null);
    setGeneralError(null);
  };

  // Next visitor: Clears advice, images, and session data, and stops camera
  const handleNextVisitor = useCallback(() => {
    stopCamera();
    setAdvice(null);
    setGeneralError(null);
    setSelectedVibe('Casual');
    setHasConsented(false);
    setIsAnalyzing(false);
  }, [stopCamera]);

  return (
    <div className="min-h-screen bg-[#090d16] text-neutral-100 flex flex-col font-sans selection:bg-amber-500 selection:text-neutral-950">
      {/* Header Bar */}
      <Header
        cameraStatus={cameraStatus}
        aiConfigured={aiConfigured}
        onNextVisitor={handleNextVisitor}
        showNextVisitor={hasConsented}
        onOpenTestDrawer={() => setIsTestDrawerOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-start">
        {!hasConsented ? (
          /* Step 1: Welcome & Consent Screen */
          <ConsentScreen
            onConsentAndOpen={handleConsentAndOpen}
            isStartingCamera={cameraStatus === 'requesting'}
            cameraError={cameraErrorMessage}
            aiConfigured={aiConfigured}
          />
        ) : (
          /* Step 2-5: Live Mirror, Vibe Selection & Advice */
          <div className="w-full max-w-5xl flex flex-col gap-6 animate-fade-in">
            {/* Offline AI Notice Banner (if API key missing, but camera preview fully functional) */}
            {aiConfigured === false && !advice && (
              <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs sm:text-sm flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    <strong>Camera Preview Active:</strong> Live AI advice is offline because{' '}
                    <code className="text-amber-300 bg-neutral-900 px-1 py-0.5 rounded">
                      GEMINI_API_KEY
                    </code>{' '}
                    is unset. Set the key in <code className="text-amber-300">.env.local</code> to
                    enable AI styling.
                  </span>
                </div>
              </div>
            )}

            {/* General In-page Error Banner */}
            {generalError && (
              <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs sm:text-sm flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{generalError}</span>
              </div>
            )}

            {/* Mirror Preview Component */}
            <MirrorView
              videoRef={videoRef}
              canvasRef={canvasRef}
              cameraStatus={cameraStatus}
              errorMessage={cameraErrorMessage}
              onStopCamera={stopCamera}
              onRestartCamera={startCamera}
              isAnalyzing={isAnalyzing}
              isMirrored={isMirrored}
              toggleMirror={toggleMirror}
            />

            {/* Show Advice Card if advice exists */}
            {advice ? (
              <AdviceCard
                advice={advice}
                onTryAgain={handleTryAgain}
                onNextVisitor={handleNextVisitor}
                isAnalyzing={isAnalyzing}
              />
            ) : (
              /* Vibe Selector & "Check My Outfit" Action */
              <div className="flex flex-col gap-5">
                {/* Vibe Selector Component */}
                <VibeSelector
                  selectedVibe={selectedVibe}
                  onSelectVibe={setSelectedVibe}
                  disabled={isAnalyzing}
                />

                {/* Primary Action Button: Check My Outfit */}
                <div className="flex flex-col items-center gap-2 pt-2">
                  <button
                    onClick={handleCheckOutfit}
                    disabled={isAnalyzing || cameraStatus !== 'active'}
                    className={`w-full sm:w-auto min-w-[280px] sm:min-w-[340px] py-4 px-8 rounded-2xl font-extrabold text-base sm:text-lg flex items-center justify-center gap-3 transition-all duration-200 shadow-xl ${
                      cameraStatus === 'active' && !isAnalyzing
                        ? 'bg-amber-500 hover:bg-amber-400 text-neutral-950 shadow-amber-500/25 hover:shadow-amber-500/40 transform hover:-translate-y-0.5 cursor-pointer'
                        : 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700/60'
                    }`}
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                        <span>Scanning Your Look...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 fill-neutral-950 text-neutral-950" />
                        <span>Check My Outfit</span>
                      </>
                    )}
                  </button>

                  <p className="text-xs text-neutral-400 text-center max-w-md">
                    Captures a single still frame to analyze for the{' '}
                    <strong className="text-amber-400">{selectedVibe}</strong> vibe. Continuous video
                    is never recorded or stored.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer / Privacy note */}
      <footer className="w-full border-t border-neutral-800/60 bg-neutral-950/60 py-4 px-6 text-center text-xs text-neutral-500 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            VibeCheck &bull; Friendly style observations &bull; Configured model:{' '}
            <span className="text-neutral-400">{modelName}</span>
          </p>
          <p className="text-[11px] text-neutral-500">
            Style advice is subjective. No biometric tracking or rating.
          </p>
        </div>
      </footer>

      {/* Test Fixtures Drawer */}
      <TestFixturesModal
        isOpen={isTestDrawerOpen}
        onClose={() => setIsTestDrawerOpen(false)}
        onApplyMockAdvice={(mockData) => {
          setHasConsented(true);
          setAdvice(mockData);
        }}
        onSimulateCameraError={(type) => {
          setHasConsented(false);
          setGeneralError(
            type === 'denied'
              ? 'SIMULATED ERROR: Camera permission denied by user settings.'
              : type === 'not_found'
              ? 'SIMULATED ERROR: No camera hardware found on device.'
              : 'SIMULATED ERROR: Insecure origin detected.'
          );
        }}
        onSimulateLoading={() => {
          setHasConsented(true);
          setIsAnalyzing(true);
          setTimeout(() => {
            setIsAnalyzing(false);
            setAdvice({
              success: true,
              isMock: true,
              vibe: selectedVibe,
              isOutfitVisible: true,
              observation:
                'A clean monochrome ensemble with sharp contrast and balanced proportions.',
              suggestions: [
                `Elevate your ${selectedVibe} look with a subtle metallic or leather accessory.`,
                'Ensure garment shoulder seams align naturally with your posture.',
                'Select footwear that complements the palette without competing for visual focus.',
              ],
              feedbackMessage: 'Style is subjective—wear what feels right for you.',
            });
          }, 3500);
        }}
        onResetSession={handleNextVisitor}
      />
    </div>
  );
}
