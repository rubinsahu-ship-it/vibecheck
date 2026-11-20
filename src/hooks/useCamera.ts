'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

export type CameraStatus =
  | 'idle'
  | 'requesting'
  | 'active'
  | 'denied'
  | 'not_found'
  | 'insecure'
  | 'error'
  | 'stopped';

export interface UseCameraReturn {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  status: CameraStatus;
  errorMessage: string | null;
  startCamera: () => Promise<boolean>;
  stopCamera: () => void;
  captureFrame: () => string | null;
  isMirrored: boolean;
  toggleMirror: () => void;
}

export function useCamera(): UseCameraReturn {
  const [status, setStatus] = useState<CameraStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isMirrored, setIsMirrored] = useState<boolean>(true);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Stop camera tracks cleanly
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (e) {
          console.warn('Error stopping camera track:', e);
        }
      });
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setStatus('stopped');
  }, []);

  // Start camera stream
  const startCamera = useCallback(async (): Promise<boolean> => {
    // 1. Check secure context (camera requires HTTPS or localhost)
    if (typeof window !== 'undefined' && !window.isSecureContext) {
      setStatus('insecure');
      setErrorMessage(
        'Webcam access requires a secure connection (HTTPS) or localhost. Please access via http://localhost:3000 or HTTPS.'
      );
      return false;
    }

    // 2. Check browser support
    if (
      typeof navigator === 'undefined' ||
      !navigator.mediaDevices ||
      !navigator.mediaDevices.getUserMedia
    ) {
      setStatus('error');
      setErrorMessage(
        'Your browser does not support mediaDevices.getUserMedia. Please try a modern browser like Chrome, Edge, Safari, or Firefox.'
      );
      return false;
    }

    // Stop any existing stream before starting a new one
    stopCamera();

    setStatus('requesting');
    setErrorMessage(null);

    try {
      // Audio explicitly DISABLED as required by flow specification
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        try {
          await videoRef.current.play();
        } catch (playErr) {
          console.warn('Autoplay failed, awaiting user interaction:', playErr);
        }
      }

      setStatus('active');
      return true;
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Camera access error:', error);

      if (
        error.name === 'NotAllowedError' ||
        error.name === 'PermissionDeniedError'
      ) {
        setStatus('denied');
        setErrorMessage(
          'Camera permission was denied. Please allow camera access in your browser address bar settings to use the mirror.'
        );
      } else if (
        error.name === 'NotFoundError' ||
        error.name === 'DevicesNotFoundError'
      ) {
        setStatus('not_found');
        setErrorMessage(
          'No camera was found on your device. Please connect a webcam or check device connections.'
        );
      } else if (
        error.name === 'NotReadableError' ||
        error.name === 'TrackStartError'
      ) {
        setStatus('error');
        setErrorMessage(
          'Camera is currently in use by another application. Please close other camera apps and try again.'
        );
      } else {
        setStatus('error');
        setErrorMessage(
          error.message || 'Could not start camera preview. Please check permissions.'
        );
      }

      return false;
    }
  }, [stopCamera]);

  // Capture a single frame resized to reasonable dimensions (max 1024px)
  const captureFrame = useCallback((): string | null => {
    const video = videoRef.current;
    if (!video || !streamRef.current || video.readyState < 2) {
      console.warn('Video element is not ready for capture');
      return null;
    }

    const canvas = canvasRef.current || document.createElement('canvas');
    const videoWidth = video.videoWidth || 1280;
    const videoHeight = video.videoHeight || 720;

    // Scale to max dimension 1024px to ensure crisp analysis while keeping payload under ~200KB
    const maxDim = 1024;
    let targetWidth = videoWidth;
    let targetHeight = videoHeight;

    if (targetWidth > maxDim || targetHeight > maxDim) {
      if (targetWidth > targetHeight) {
        targetHeight = Math.round((targetHeight * maxDim) / targetWidth);
        targetWidth = maxDim;
      } else {
        targetWidth = Math.round((targetWidth * maxDim) / targetHeight);
        targetHeight = maxDim;
      }
    }

    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Draw video frame to canvas
    // Note: Do NOT mirror horizontally for AI analysis so text/logos on clothing are normal orientation,
    // or keep true orientation. Either is fine, but true orientation makes brand/slogan reading standard.
    ctx.drawImage(video, 0, 0, targetWidth, targetHeight);

    // Export as standard JPEG with 0.82 quality
    return canvas.toDataURL('image/jpeg', 0.82);
  }, []);

  const toggleMirror = useCallback(() => {
    setIsMirrored((prev) => !prev);
  }, []);

  // Handle page visibility change and teardown
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // When tab is hidden, stop camera tracks to respect user privacy and save resources
        if (streamRef.current && status === 'active') {
          stopCamera();
        }
      }
    };

    const handleBeforeUnload = () => {
      stopCamera();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      stopCamera();
    };
  }, [status, stopCamera]);

  return {
    videoRef,
    canvasRef,
    status,
    errorMessage,
    startCamera,
    stopCamera,
    captureFrame,
    isMirrored,
    toggleMirror,
  };
}
