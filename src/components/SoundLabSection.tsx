import React from 'react';
import { Sliders, Sparkles, Volume2, CloudRain, Disc, Radio, Activity } from 'lucide-react';
import { EqualizerSettings } from '../types/music';

interface SoundLabSectionProps {
  settings: EqualizerSettings;
  onUpdateSettings: (newSettings: EqualizerSettings) => void;
  onOpenVisualizer: () => void;
  isDarkMode: boolean;
}

export const SoundLabSection: React.FC<SoundLabSectionProps> = ({
  settings,
  onUpdateSettings,
  onOpenVisualizer,
  isDarkMode,
}) => {
  return (
    <section id="sound-lab" className="py-16 max-w-7xl mx-auto px-6">
      <div className="rounded-3xl p-8 sm:p-12 border border-purple-200/60 dark:border-purple-800/40 bg-gradient-to-br from-white/90 via-purple-50/50 to-lavender-100/40 dark:from-[#180e2d]/90 dark:via-[#130a24]/90 dark:to-purple-950/40 backdrop-blur-xl shadow-xl shadow-purple-500/5">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Info Column */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-700 dark:text-purple-300">
              <Activity className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>Acoustic Architecture</span>
              <span aria-hidden="true">·</span>
              <span>Web Audio API</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-purple-950 dark:text-white leading-tight">
              Crafted with Lavender Ambient Resonance
            </h2>

            <p className="text-sm sm:text-base text-purple-900/80 dark:text-purple-200/80 leading-relaxed">
              Every frequency in AuraLavande is synthesized through a multi-stage harmonic chain. Adjust the ambient soundscape below to mix warm vintage vinyl crackle and peaceful rain into your active audio stream.
            </p>

            {/* Audio Specifications Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-purple-200/50 dark:border-purple-800/40">
              <div>
                <div className="font-mono text-base font-bold text-purple-950 dark:text-white">
                  96 kHz / 24-Bit
                </div>
                <div className="text-[11px] text-purple-600 dark:text-purple-300">
                  Spatial Precision
                </div>
              </div>
              <div>
                <div className="font-mono text-base font-bold text-purple-950 dark:text-white">
                  &lt; 5 ms
                </div>
                <div className="text-[11px] text-purple-600 dark:text-purple-300">
                  Audio Latency
                </div>
              </div>
              <div>
                <div className="font-mono text-base font-bold text-purple-950 dark:text-white">
                  Lenis 1.2
                </div>
                <div className="text-[11px] text-purple-600 dark:text-purple-300">
                  Inertial Scroll
                </div>
              </div>
            </div>
          </div>

          {/* Right Interactive Mixer Card */}
          <div className="lg:col-span-6 rounded-2xl p-6 sm:p-7 bg-white/80 dark:bg-purple-950/60 border border-purple-200/70 dark:border-purple-800/60 shadow-lg space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-base text-purple-950 dark:text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Live Ambient Soundscape Mixer</span>
              </h3>
              <button
                onClick={onOpenVisualizer}
                className="text-xs text-purple-600 dark:text-purple-300 hover:text-purple-950 dark:hover:text-white underline font-medium cursor-pointer"
              >
                Launch Visualizer
              </button>
            </div>

            {/* Vinyl Crackle slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-purple-900 dark:text-purple-200">
                <span className="flex items-center gap-1.5 font-medium">
                  <Disc className="w-3.5 h-3.5 text-purple-600" />
                  <span>Vintage Vinyl Texture</span>
                </span>
                <span className="font-mono tabular-nums text-purple-600 dark:text-purple-300">
                  {settings.vinylNoise}%
                </span>
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
                aria-label="Adjust vinyl texture level"
                className="w-full h-2 bg-purple-200 dark:bg-purple-900 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
            </div>

            {/* Rain Sound slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-purple-900 dark:text-purple-200">
                <span className="flex items-center gap-1.5 font-medium">
                  <CloudRain className="w-3.5 h-3.5 text-purple-600" />
                  <span>Gentle Lavender Rain</span>
                </span>
                <span className="font-mono tabular-nums text-purple-600 dark:text-purple-300">
                  {settings.rainSound}%
                </span>
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
                aria-label="Adjust rain sound level"
                className="w-full h-2 bg-purple-200 dark:bg-purple-900 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
            </div>

            {/* Bass slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-purple-900 dark:text-purple-200">
                <span className="flex items-center gap-1.5 font-medium">
                  <Radio className="w-3.5 h-3.5 text-purple-600" />
                  <span>Sub-Bass Warmth</span>
                </span>
                <span className="font-mono tabular-nums text-purple-600 dark:text-purple-300">
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
                aria-label="Adjust sub-bass warmth"
                className="w-full h-2 bg-purple-200 dark:bg-purple-900 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
            </div>

            <div className="text-[11px] text-purple-700/70 dark:text-purple-300/70 pt-2 border-t border-purple-100 dark:border-purple-800/40">
              Noise generators and biquad filters run client-side with zero network latency.
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
