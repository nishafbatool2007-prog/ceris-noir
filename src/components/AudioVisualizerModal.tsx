import React, { useEffect, useRef, useState } from 'react';
import { X, Maximize, Minimize, Waves, Sparkles } from 'lucide-react';
import { audioEngine } from '../services/audioEngine';
import { Track } from '../types/music';

interface AudioVisualizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTrack: Track | null;
  isPlaying: boolean;
  isDarkMode: boolean;
}

export const AudioVisualizerModal: React.FC<AudioVisualizerModalProps> = ({
  isOpen,
  onClose,
  currentTrack,
  isPlaying,
  isDarkMode,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [visStyle, setVisStyle] = useState<'wave' | 'bars' | 'circular'>('wave');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isOpen) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let angleOffset = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const data = audioEngine.getVisualizerData();

      // Clear with soft gradient fade
      ctx.fillStyle = isDarkMode ? 'rgba(15, 7, 26, 0.25)' : 'rgba(250, 248, 254, 0.35)';
      ctx.fillRect(0, 0, width, height);

      const bufferLen = data.length || 64;

      if (visStyle === 'bars') {
        const barWidth = (width / bufferLen) * 2;
        let x = 0;

        for (let i = 0; i < bufferLen; i++) {
          const val = isPlaying ? data[i] : Math.sin(i * 0.2 + angleOffset) * 15 + 20;
          const barHeight = (val / 255) * height * 0.7;

          const grad = ctx.createLinearGradient(0, height - barHeight, 0, height);
          grad.addColorStop(0, '#C084FC'); // lavender light
          grad.addColorStop(0.5, '#9333EA'); // purple
          grad.addColorStop(1, '#6B21A8'); // deep violet

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.roundRect(x, height - barHeight, Math.max(2, barWidth - 3), barHeight, [4, 4, 0, 0]);
          ctx.fill();

          x += barWidth;
        }
      } else if (visStyle === 'circular') {
        const cx = width / 2;
        const cy = height / 2;
        const baseRadius = Math.min(width, height) * 0.22;

        ctx.save();
        ctx.translate(cx, cy);

        for (let i = 0; i < bufferLen; i += 2) {
          const rad = ((i / bufferLen) * Math.PI * 2) + angleOffset;
          const val = isPlaying ? data[i] : Math.cos(i * 0.3 + angleOffset) * 12 + 25;
          const barLen = (val / 255) * 120 + 10;

          const x1 = Math.cos(rad) * baseRadius;
          const y1 = Math.sin(rad) * baseRadius;
          const x2 = Math.cos(rad) * (baseRadius + barLen);
          const y2 = Math.sin(rad) * (baseRadius + barLen);

          ctx.strokeStyle = i % 4 === 0 ? '#E9D5FF' : '#A855F7';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }

        // Inner glowing core
        const coreGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, baseRadius * 0.9);
        coreGrad.addColorStop(0, isDarkMode ? 'rgba(216, 180, 254, 0.4)' : 'rgba(168, 85, 247, 0.3)');
        coreGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(0, 0, baseRadius * 0.9, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      } else {
        // Continuous fluid wave ribbons
        ctx.lineWidth = 3;
        ctx.strokeStyle = isDarkMode ? '#C084FC' : '#9333EA';
        ctx.beginPath();

        const sliceWidth = width / bufferLen;
        let x = 0;

        for (let i = 0; i < bufferLen; i++) {
          const val = isPlaying ? data[i] : Math.sin(i * 0.15 + angleOffset) * 30 + 128;
          const v = val / 128.0;
          const y = (v * height) / 2;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
          x += sliceWidth;
        }
        ctx.stroke();

        // Secondary harmonic ribbon in soft white/lavender
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(147, 51, 234, 0.5)';
        ctx.beginPath();
        x = 0;
        for (let i = 0; i < bufferLen; i++) {
          const val = isPlaying ? data[(i + 15) % bufferLen] : Math.cos(i * 0.15 + angleOffset * 1.3) * 20 + 128;
          const v = val / 128.0;
          const y = (v * height) / 2 + 15;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
          x += sliceWidth;
        }
        ctx.stroke();
      }

      angleOffset += 0.015;
      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isOpen, visStyle, isPlaying, isDarkMode]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/60 backdrop-blur-xl animate-fade-in">
      <div
        className={`relative w-full ${
          isFullscreen ? 'h-full max-w-none' : 'max-w-4xl h-[560px]'
        } rounded-3xl overflow-hidden border border-purple-300/40 dark:border-purple-800/40 ${
          isDarkMode ? 'bg-[#11071f]' : 'bg-[#FAF8FE]'
        } shadow-2xl flex flex-col justify-between transition-all duration-300`}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between p-6 border-b border-purple-200/40 dark:border-purple-800/30 z-10 backdrop-blur-md bg-white/20 dark:bg-black/20">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-purple-600/20 text-purple-600 dark:text-purple-300">
              <Waves className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-display font-bold text-lg text-purple-950 dark:text-white">
                Spatial Visualizer Canvas
              </h3>
              <p className="text-xs text-purple-600 dark:text-purple-300">
                Real-time frequency response & dynamic harmonic waves
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Style Selector */}
            <div className="flex items-center gap-1 p-1 bg-purple-100/70 dark:bg-purple-900/40 rounded-xl border border-purple-200/40 dark:border-purple-700/40">
              <button
                onClick={() => setVisStyle('wave')}
                className={`px-3 py-1 text-xs font-medium rounded-lg cursor-pointer ${
                  visStyle === 'wave'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-purple-800 dark:text-purple-200 hover:text-purple-950'
                }`}
              >
                Ribbons
              </button>
              <button
                onClick={() => setVisStyle('bars')}
                className={`px-3 py-1 text-xs font-medium rounded-lg cursor-pointer ${
                  visStyle === 'bars'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-purple-800 dark:text-purple-200 hover:text-purple-950'
                }`}
              >
                Spectrum
              </button>
              <button
                onClick={() => setVisStyle('circular')}
                className={`px-3 py-1 text-xs font-medium rounded-lg cursor-pointer ${
                  visStyle === 'circular'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-purple-800 dark:text-purple-200 hover:text-purple-950'
                }`}
              >
                Orchid Orbit
              </button>
            </div>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              aria-label="Toggle fullscreen"
              className="p-2 text-purple-700 dark:text-purple-300 hover:bg-purple-100/50 dark:hover:bg-purple-900/30 rounded-xl cursor-pointer"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              aria-label="Close modal"
              className="p-2 text-purple-700 dark:text-purple-300 hover:bg-purple-100/50 dark:hover:bg-purple-900/30 rounded-xl cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Canvas Body */}
        <div className="relative flex-1 w-full h-full overflow-hidden flex items-center justify-center">
          <canvas
            ref={canvasRef}
            width={900}
            height={450}
            className="w-full h-full object-cover"
          />

          {/* Center Track Badge */}
          {currentTrack && (
            <div className="absolute bottom-6 left-6 backdrop-blur-xl bg-white/70 dark:bg-purple-950/70 border border-purple-200/50 dark:border-purple-700/50 px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-3">
              <img
                src={currentTrack.coverUrl}
                alt={currentTrack.title}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-xl object-cover shadow-sm"
              />
              <div>
                <div className="text-xs font-bold text-purple-950 dark:text-white truncate">
                  {currentTrack.title}
                </div>
                <div className="text-[11px] text-purple-600 dark:text-purple-300 truncate">
                  {currentTrack.artist} · {currentTrack.musicalKey}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
