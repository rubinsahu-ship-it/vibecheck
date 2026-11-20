'use client';

import React, { useState } from 'react';
import { PRESET_VIBES, PresetVibe } from '@/types/vibecheck';
import { Briefcase, Coffee, Sparkles, PartyPopper, Edit3, Check } from 'lucide-react';

interface VibeSelectorProps {
  selectedVibe: string;
  onSelectVibe: (vibe: string) => void;
  disabled?: boolean;
}

export function VibeSelector({ selectedVibe, onSelectVibe, disabled }: VibeSelectorProps) {
  const [isCustomMode, setIsCustomMode] = useState<boolean>(
    !PRESET_VIBES.some((v) => v.id === selectedVibe)
  );
  const [customInputValue, setCustomInputValue] = useState<string>(
    PRESET_VIBES.some((v) => v.id === selectedVibe) ? '' : selectedVibe
  );

  const handlePresetSelect = (vibeId: PresetVibe) => {
    if (disabled) return;
    setIsCustomMode(false);
    onSelectVibe(vibeId);
  };

  const handleCustomModeToggle = () => {
    if (disabled) return;
    setIsCustomMode(true);
    if (customInputValue.trim().length > 0) {
      onSelectVibe(customInputValue.trim());
    }
  };

  const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.slice(0, 50);
    setCustomInputValue(val);
    if (val.trim().length > 0) {
      onSelectVibe(val.trim());
    }
  };

  const getIcon = (vibeId: PresetVibe) => {
    switch (vibeId) {
      case 'Corporate':
        return <Briefcase className="w-4 h-4" />;
      case 'Casual':
        return <Coffee className="w-4 h-4" />;
      case 'Party':
        return <Sparkles className="w-4 h-4" />;
      case 'Festive':
        return <PartyPopper className="w-4 h-4" />;
    }
  };

  return (
    <div className="w-full bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3">
        <div>
          <span className="text-xs uppercase tracking-wider font-bold text-amber-400">
            Step 1: Choose Your Vibe
          </span>
          <p className="text-xs text-neutral-400">
            You choose your intended aesthetic; we never infer mood or personality from your face.
          </p>
        </div>
        <div className="text-xs text-neutral-400 font-medium">
          Active: <span className="text-white font-bold">{selectedVibe}</span>
        </div>
      </div>

      {/* Preset Buttons Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-3">
        {PRESET_VIBES.map((preset) => {
          const isSelected = !isCustomMode && selectedVibe === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => handlePresetSelect(preset.id)}
              disabled={disabled}
              className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all duration-150 relative ${
                isSelected
                  ? 'bg-amber-500/15 border-amber-500 text-white shadow-md shadow-amber-500/10'
                  : 'bg-neutral-950/60 border-neutral-800 text-neutral-300 hover:border-neutral-700 hover:bg-neutral-900'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {isSelected && (
                <div className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-amber-500 text-neutral-950 flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
              )}
              <div
                className={`p-2 rounded-lg mb-2 ${
                  isSelected ? 'bg-amber-500 text-neutral-950' : 'bg-neutral-800 text-amber-400'
                }`}
              >
                {getIcon(preset.id)}
              </div>
              <span className="text-sm font-bold block">{preset.label}</span>
              <span className="text-[11px] text-neutral-400 leading-tight mt-0.5 line-clamp-1">
                {preset.description}
              </span>
            </button>
          );
        })}
      </div>

      {/* Custom Editable Vibe Field */}
      <div className="pt-2 border-t border-neutral-800/80 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <button
          onClick={handleCustomModeToggle}
          disabled={disabled}
          className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
            isCustomMode
              ? 'bg-amber-500 text-neutral-950 border-amber-400'
              : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Custom Vibe</span>
        </button>

        {isCustomMode ? (
          <div className="flex-1 flex items-center gap-2">
            <input
              type="text"
              value={customInputValue}
              onChange={handleCustomInputChange}
              disabled={disabled}
              placeholder="e.g. Minimalist Tech, Date Night, Vintage Parisian..."
              className="flex-1 bg-neutral-950 border border-amber-500/60 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
              maxLength={50}
            />
          </div>
        ) : (
          <span className="text-xs text-neutral-500 italic px-2">
            Tip: Click &quot;Custom Vibe&quot; to type your own specific dress code.
          </span>
        )}
      </div>
    </div>
  );
}
