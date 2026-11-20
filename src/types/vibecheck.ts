export type PresetVibe = 'Corporate' | 'Casual' | 'Party' | 'Festive';

export const PRESET_VIBES: { id: PresetVibe; label: string; description: string; icon: string }[] = [
  {
    id: 'Corporate',
    label: 'Corporate',
    description: 'Professional, structured, business-ready',
    icon: 'Briefcase',
  },
  {
    id: 'Casual',
    label: 'Casual',
    description: 'Relaxed, effortless, everyday comfort',
    icon: 'Coffee',
  },
  {
    id: 'Party',
    label: 'Party',
    description: 'Vibrant, bold, night-out ready',
    icon: 'Sparkles',
  },
  {
    id: 'Festive',
    label: 'Festive',
    description: 'Celebratory, elevated, occasion-wear',
    icon: 'PartyPopper',
  },
];

export interface AdviceRequest {
  image: string; // Base64 JPEG data URL: data:image/jpeg;base64,...
  vibe: string;
}

export interface AdviceResponse {
  success: boolean;
  observation?: string;
  suggestions?: string[];
  isOutfitVisible?: boolean;
  feedbackMessage?: string;
  vibe?: string;
  error?: string;
  notConfigured?: boolean;
  isMock?: boolean;
  modelUsed?: string;
}

export interface SystemStatusResponse {
  configured: boolean;
  model: string;
  maxPayloadBytes: number;
}
