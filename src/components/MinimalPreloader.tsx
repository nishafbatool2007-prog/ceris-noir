import React, { useEffect, useState } from 'react';
import { Disc3 } from 'lucide-react';

interface MinimalPreloaderProps {
  isDarkMode: boolean;
}

export const MinimalPreloader: React.FC<MinimalPreloaderProps> = ({ isDarkMode }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const totalDuration = 1000; // Exactly 1 second stay
    const intervalTime = 20;
    const increment = 100 / (totalDuration / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    // Trigger fade-out at 1s
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
      // Remove from DOM after fade completes
      const removeTimer = setTimeout(() => {
        setIsVisible(false);
      }, 500);
      return () => clearTimeout(removeTimer);
    }, totalDuration);

    return () => {
      clearInterval(timer);
      clearTimeout(fadeTimer);
    };
  }, []);

  if (!isVisible) return null;

  // Dynamic phase text based on progress
  let phaseText = 'Initializing 96kHz Spatial Audio...';
  if (progress > 35 && progress < 75) {
    phaseText = 'Loading Violet & Lavender Master Tapes...';
  } else if (progress >= 75) {
    phaseText = 'Soundstage Calibrated · Welcome to AuraLavande';
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-all duration-700 ease-out pointer-events-none select-none ${
        isFading ? 'opacity-0 scale-102' : 'opacity-100 scale-100'
      } ${
        isDarkMode ? 'bg-[#0E061A]' : 'bg-[#FAF8FE]'
      }`}
    >
      {/* Background ambient radial glowing orbs */}
      <div className="absolute w-[500px] h-[500px] bg-purple-400/20 dark:bg-purple-600/20 rounded-full blur-[110px] animate-ambient-pulse" />
      <div className="absolute w-[350px] h-[350px] bg-lavender-300/30 dark:bg-indigo-900/20 rounded-full blur-[90px] -translate-y-12 pointer-events-none" />

      <div className="relative flex flex-col items-center gap-7 max-w-sm px-6 text-center">
        
        {/* Hypnotic Vinyl & Sound Wave Disc */}
        <div className="relative flex items-center justify-center">
          {/* Subtle concentric ripple waves expanding outward */}
          <span className="absolute w-28 h-28 rounded-full border border-purple-400/40 animate-wave-ripple" />
          <span
            className="absolute w-40 h-40 rounded-full border border-lavender-300/30 animate-wave-ripple"
            style={{ animationDelay: '0.8s' }}
          />

          {/* Frosted Glass Turntable Disc */}
          <div className="relative w-28 h-28 rounded-full border border-purple-300/80 dark:border-purple-600/70 bg-white/80 dark:bg-[#150a2b]/80 shadow-[0_0_40px_rgba(168,85,247,0.3)] backdrop-blur-2xl flex items-center justify-center overflow-hidden">
            {/* Spinning micro grooved vinyl rings */}
            <div className="absolute inset-2 rounded-full border border-purple-300/40 dark:border-purple-600/30" />
            <div className="absolute inset-4 rounded-full border border-purple-300/30 dark:border-purple-600/20" />
            <div className="absolute inset-6 rounded-full border border-purple-200/40 dark:border-purple-700/30" />

            {/* Center Spinning Starburst Website Logo */}
            <div className="relative w-14 h-14 rounded-full flex items-center justify-center overflow-hidden p-1.5 bg-gradient-to-tr from-purple-950 via-purple-900 to-indigo-950 border border-purple-300/60 shadow-[0_0_20px_rgba(192,132,252,0.8)] animate-[spin_10s_linear_infinite]">
              <img
                src="/assets/aistudio/image_9fe2811d.png"
                alt="AuraLavande Website Logo"
                className="w-full h-full object-contain filter drop-shadow-[0_0_10px_rgba(216,180,254,0.9)]"
              />
            </div>
          </div>

          {/* Center Mini Audio Equalizer Bars */}
          <div className="absolute -bottom-2 flex items-end gap-1 px-2.5 py-1 rounded-full bg-white/90 dark:bg-purple-900/90 border border-purple-200 dark:border-purple-700 shadow-md">
            <span className="w-1 bg-purple-600 rounded-full animate-pulse h-2.5" />
            <span className="w-1 bg-purple-500 rounded-full animate-pulse h-4" style={{ animationDelay: '150ms' }} />
            <span className="w-1 bg-purple-700 rounded-full animate-pulse h-5" style={{ animationDelay: '300ms' }} />
            <span className="w-1 bg-purple-500 rounded-full animate-pulse h-3.5" style={{ animationDelay: '450ms' }} />
            <span className="w-1 bg-purple-600 rounded-full animate-pulse h-2" style={{ animationDelay: '200ms' }} />
          </div>
        </div>

        {/* Wordmark and Phase Readout */}
        <div className="space-y-2">
          <h2 className="font-display text-2xl font-bold tracking-tight text-purple-950 dark:text-white">
            AuraLavande
          </h2>
          <div className="h-5 flex items-center justify-center">
            <p className="text-xs font-mono uppercase tracking-wider text-purple-700 dark:text-purple-300 transition-all duration-300">
              {phaseText}
            </p>
          </div>
        </div>

        {/* Smooth Precision Progress Bar & Tabular Percentage */}
        <div className="w-full max-w-[220px] space-y-2">
          <div className="w-full h-1.5 bg-purple-100 dark:bg-purple-950/80 rounded-full overflow-hidden p-0.5 border border-purple-200/50 dark:border-purple-800/40 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-purple-500 via-purple-600 to-indigo-500 rounded-full transition-all duration-75 ease-out"
              style={{ width: `${Math.min(100, Math.round(progress))}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[11px] font-mono tabular-nums text-purple-600/80 dark:text-purple-400/80 px-1">
            <span>Spatial Hi-Fi</span>
            <span className="font-semibold text-purple-800 dark:text-purple-200">
              {Math.min(100, Math.round(progress))}%
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
