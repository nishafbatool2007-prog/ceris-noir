import React from 'react';
import { X, SlidersHorizontal, CloudRain, Disc, RotateCcw } from 'lucide-react';
import { EqualizerSettings } from '../types/music';

interface EqualizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: EqualizerSettings;
  onUpdateSettings: (newSettings: EqualizerSettings) => void;
  isDarkMode: boolean;
}

export const EqualizerModal: React.FC<EqualizerModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  isDarkMode,
}) => {
  if (!isOpen) return null;

  const presets: { name: string; eq: Partial<EqualizerSettings> }[] = [
    { name: 'Aura Balanced', eq: { bass: 0, mid: 0, treble: 0 } },
    { name: 'Bass Bloom', eq: { bass: 6, mid: -1, treble: 2 } },
    { name: 'Vocal Presence', eq: { bass: -2, mid: 4, treble: 3 } },
    { name: 'Lo-Fi Nostalgia', eq: { bass: 4, mid: -2, treble: -4, vinylNoise: 45, rainSound: 20 } },
    { name: 'Rainy Twilight', eq: { bass: 2, mid: 1, treble: 1, rainSound: 65, vinylNoise: 15 } },
  ];

  const handleReset = () => {
    onUpdateSettings({
      bass: 0,
      mid: 0,
      treble: 0,
      reverb: 30,
      vinylNoise: 0,
      rainSound: 0,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xl animate-fade-in">
      <div
        className={`relative w-full max-w-xl rounded-3xl overflow-hidden border border-purple-200/50 dark:border-purple-800/40 ${
          isDarkMode ? 'bg-[#150a24]' : 'bg-[#FAF8FE]'
        } shadow-2xl p-6 sm:p-8 flex flex-col justify-between`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-purple-100 dark:border-purple-900/40">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-purple-600/20 text-purple-600 dark:text-purple-300">
              <SlidersHorizontal className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-display font-bold text-lg text-purple-950 dark:text-white">
                Sound Lab & Spatial EQ
              </h3>
              <p className="text-xs text-purple-600 dark:text-purple-300">
                Hardware-accelerated biquad frequency tuning & ambient layering
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close equalizer"
            className="p-2 text-purple-700 dark:text-purple-300 hover:bg-purple-100/50 dark:hover:bg-purple-900/30 rounded-xl cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Presets */}
        <div className="py-4">
          <div className="text-xs font-semibold text-purple-800 dark:text-purple-200 uppercase tracking-wider mb-2">
            Acoustic Presets
          </div>
          <div className="flex flex-wrap gap-2">
            {presets.map((p) => (
              <button
                key={p.name}
                onClick={() => onUpdateSettings({ ...settings, ...p.eq })}
                className="px-3 py-1.5 rounded-xl text-xs font-medium border border-purple-200/60 dark:border-purple-800/60 bg-white/60 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200 hover:bg-purple-100 dark:hover:bg-purple-900/60 transition-colors cursor-pointer"
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* 3-Band Frequency Sliders */}
        <div className="space-y-5 py-4 border-y border-purple-100 dark:border-purple-900/40">
          {/* Bass */}
          <div>
            <div className="flex justify-between text-xs font-medium text-purple-900 dark:text-purple-200 mb-1.5">
              <span>Bass (Low Shelf 250Hz)</span>
              <span className="font-mono tabular-nums text-purple-600 dark:text-purple-400">
                {settings.bass > 0 ? `+${settings.bass}` : settings.bass} dB
              </span>
            </div>
            <input
              type="range"
              min="-10"
              max="10"
              step="1"
              value={settings.bass}
              onChange={(e) =>
                onUpdateSettings({ ...settings, bass: parseFloat(e.target.value) })
              }
              aria-label="Bass adjustment slider"
              className="w-full h-1.5 bg-purple-200 dark:bg-purple-900 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
          </div>

          {/* Mid */}
          <div>
            <div className="flex justify-between text-xs font-medium text-purple-900 dark:text-purple-200 mb-1.5">
              <span>Mids (Peaking 1.5kHz)</span>
              <span className="font-mono tabular-nums text-purple-600 dark:text-purple-400">
                {settings.mid > 0 ? `+${settings.mid}` : settings.mid} dB
              </span>
            </div>
            <input
              type="range"
              min="-10"
              max="10"
              step="1"
              value={settings.mid}
              onChange={(e) =>
                onUpdateSettings({ ...settings, mid: parseFloat(e.target.value) })
              }
              aria-label="Mid adjustment slider"
              className="w-full h-1.5 bg-purple-200 dark:bg-purple-900 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
          </div>

          {/* Treble */}
          <div>
            <div className="flex justify-between text-xs font-medium text-purple-900 dark:text-purple-200 mb-1.5">
              <span>Treble (High Shelf 4.5kHz)</span>
              <span className="font-mono tabular-nums text-purple-600 dark:text-purple-400">
                {settings.treble > 0 ? `+${settings.treble}` : settings.treble} dB
              </span>
            </div>
            <input
              type="range"
              min="-10"
              max="10"
              step="1"
              value={settings.treble}
              onChange={(e) =>
                onUpdateSettings({ ...settings, treble: parseFloat(e.target.value) })
              }
              aria-label="Treble adjustment slider"
              className="w-full h-1.5 bg-purple-200 dark:bg-purple-900 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
          </div>
        </div>

        {/* Ambient Sound Layer Mixer */}
        <div className="py-4 space-y-4">
          <div className="text-xs font-semibold text-purple-800 dark:text-purple-200 uppercase tracking-wider">
            Natural Ambient Layering
          </div>

          {/* Vinyl Crackle */}
          <div className="flex items-center gap-3">
            <Disc className="w-4 h-4 text-purple-500 shrink-0" />
            <div className="flex-1">
              <div className="flex justify-between text-xs text-purple-900 dark:text-purple-200 mb-1">
                <span>Vintage Vinyl Crackle</span>
                <span className="font-mono tabular-nums">{settings.vinylNoise}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={settings.vinylNoise}
                onChange={(e) =>
                  onUpdateSettings({ ...settings, vinylNoise: parseInt(e.target.value) })
                }
                aria-label="Vinyl crackle level"
                className="w-full h-1.5 bg-purple-200 dark:bg-purple-900 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
            </div>
          </div>

          {/* Gentle Rain Noise */}
          <div className="flex items-center gap-3">
            <CloudRain className="w-4 h-4 text-purple-500 shrink-0" />
            <div className="flex-1">
              <div className="flex justify-between text-xs text-purple-900 dark:text-purple-200 mb-1">
                <span>Gentle Lavender Rain</span>
                <span className="font-mono tabular-nums">{settings.rainSound}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={settings.rainSound}
                onChange={(e) =>
                  onUpdateSettings({ ...settings, rainSound: parseInt(e.target.value) })
                }
                aria-label="Rain sound level"
                className="w-full h-1.5 bg-purple-200 dark:bg-purple-900 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-purple-100 dark:border-purple-900/40 flex items-center justify-between">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs font-medium text-purple-600 dark:text-purple-300 hover:text-purple-950 dark:hover:text-white cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Flat</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-md active:scale-95 transition-all cursor-pointer"
          >
            Apply Settings
          </button>
        </div>
      </div>
    </div>
  );
};
