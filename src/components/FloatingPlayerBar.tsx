import React from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
  Volume2,
  VolumeX,
  Heart,
  FileText,
  Waves,
  ListMusic,
  Maximize2,
} from 'lucide-react';
import { Track } from '../types/music';

interface FloatingPlayerBarProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSeek: (seconds: number) => void;
  volume: number;
  onVolumeChange: (vol: number) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  isRepeat: boolean;
  onToggleRepeat: () => void;
  isShuffle: boolean;
  onToggleShuffle: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onOpenLyrics: () => void;
  onOpenVisualizer: () => void;
  onOpenQueue: () => void;
  isDarkMode: boolean;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export const FloatingPlayerBar: React.FC<FloatingPlayerBarProps> = ({
  currentTrack,
  isPlaying,
  currentTime,
  onTogglePlay,
  onNext,
  onPrev,
  onSeek,
  volume,
  onVolumeChange,
  isMuted,
  onToggleMute,
  isRepeat,
  onToggleRepeat,
  isShuffle,
  onToggleShuffle,
  isFavorite,
  onToggleFavorite,
  onOpenLyrics,
  onOpenVisualizer,
  onOpenQueue,
  isDarkMode,
}) => {
  if (!currentTrack) return null;

  const duration = currentTrack.duration || 180;
  const progressPercent = Math.min(100, (currentTime / duration) * 100);

  const handleScrubberClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(ratio * duration);
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 transition-colors duration-300 backdrop-blur-2xl bg-white/92 dark:bg-[#120a1e]/95 border-t border-purple-100 dark:border-purple-900/40 shadow-[0_-8px_30px_rgba(107,33,168,0.06)] px-4 sm:px-6 py-2.5">
      {/* Top progress scrubber line */}
      <div
        onClick={handleScrubberClick}
        className="group relative w-full h-1.5 -top-2.5 bg-purple-100 dark:bg-purple-950/80 cursor-pointer overflow-hidden transition-all hover:h-2 rounded-full"
      >
        <div
          className="h-full bg-gradient-to-r from-purple-500 via-purple-600 to-indigo-500 rounded-full transition-all duration-100"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Left Column: Track Info & Favorite */}
        <div className="flex items-center gap-3.5 min-w-0 w-1/4">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 shadow-md shadow-purple-500/10 border border-purple-200/50 dark:border-purple-800/40 bg-purple-100">
            <img
              src={currentTrack.coverUrl}
              alt={currentTrack.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            {isPlaying && (
              <div className="absolute inset-0 bg-purple-950/30 flex items-center justify-center backdrop-blur-[1px]">
                <div className="flex items-end gap-0.5 h-3.5">
                  <span className="w-0.5 bg-white rounded-full animate-bounce h-2" style={{ animationDelay: '0ms' }} />
                  <span className="w-0.5 bg-white rounded-full animate-bounce h-3.5" style={{ animationDelay: '150ms' }} />
                  <span className="w-0.5 bg-white rounded-full animate-bounce h-2.5" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </div>

          <div className="min-w-0">
            <h4 className="text-sm font-semibold text-purple-950 dark:text-purple-100 truncate">
              {currentTrack.title}
            </h4>
            <p className="text-xs text-purple-600 dark:text-purple-300 truncate">
              {currentTrack.artist}
            </p>
          </div>

          <button
            onClick={onToggleFavorite}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            className="p-1.5 text-purple-400 hover:text-purple-600 dark:hover:text-purple-300 transition-colors shrink-0 cursor-pointer"
          >
            <Heart
              className={`w-4 h-4 transition-transform duration-200 active:scale-125 ${
                isFavorite ? 'fill-purple-600 text-purple-600' : ''
              }`}
            />
          </button>
        </div>

        {/* Center Column: Playback Controls & Timestamps */}
        <div className="flex flex-col items-center gap-1 w-2/4 max-w-xl">
          <div className="flex items-center gap-4">
            <button
              onClick={onToggleShuffle}
              aria-label="Toggle shuffle"
              className={`p-1.5 text-xs transition-colors cursor-pointer ${
                isShuffle
                  ? 'text-purple-600 dark:text-purple-300'
                  : 'text-purple-400 dark:text-purple-600 hover:text-purple-700 dark:hover:text-purple-300'
              }`}
              title={isShuffle ? 'Shuffle On' : 'Shuffle Off'}
            >
              <Shuffle className="w-4 h-4" />
            </button>

            <button
              onClick={onPrev}
              aria-label="Previous track"
              className="p-1.5 text-purple-800 dark:text-purple-200 hover:text-purple-950 dark:hover:text-white transition-colors cursor-pointer"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={onTogglePlay}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-700 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-purple-600/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>

            <button
              onClick={onNext}
              aria-label="Next track"
              className="p-1.5 text-purple-800 dark:text-purple-200 hover:text-purple-950 dark:hover:text-white transition-colors cursor-pointer"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            <button
              onClick={onToggleRepeat}
              aria-label="Toggle repeat"
              className={`p-1.5 text-xs transition-colors cursor-pointer ${
                isRepeat
                  ? 'text-purple-600 dark:text-purple-300'
                  : 'text-purple-400 dark:text-purple-600 hover:text-purple-700 dark:hover:text-purple-300'
              }`}
              title={isRepeat ? 'Repeat On' : 'Repeat Off'}
            >
              <Repeat className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-mono tabular-nums text-purple-900/60 dark:text-purple-300/60 w-full justify-center">
            <span>{formatTime(currentTime)}</span>
            <span>/</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right Column: Audio Actions, Lyrics & Volume */}
        <div className="flex items-center justify-end gap-3 w-1/4">
          <button
            onClick={onOpenLyrics}
            className="p-2 text-purple-700 dark:text-purple-300 hover:text-purple-950 dark:hover:text-white hover:bg-purple-100/50 dark:hover:bg-purple-900/40 rounded-lg transition-colors cursor-pointer"
            title="Synced Lyrics"
            aria-label="Synced Lyrics"
          >
            <FileText className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenVisualizer}
            className="p-2 text-purple-700 dark:text-purple-300 hover:text-purple-950 dark:hover:text-white hover:bg-purple-100/50 dark:hover:bg-purple-900/40 rounded-lg transition-colors cursor-pointer"
            title="Spatial Audio Visualizer"
            aria-label="Spatial Audio Visualizer"
          >
            <Waves className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenQueue}
            className="p-2 text-purple-700 dark:text-purple-300 hover:text-purple-950 dark:hover:text-white hover:bg-purple-100/50 dark:hover:bg-purple-900/40 rounded-lg transition-colors cursor-pointer"
            title="Queue"
            aria-label="Queue"
          >
            <ListMusic className="w-4 h-4" />
          </button>

          <div className="hidden lg:flex items-center gap-2 ml-1">
            <button
              onClick={onToggleMute}
              className="p-1 text-purple-600 dark:text-purple-300 hover:text-purple-950 dark:hover:text-white transition-colors cursor-pointer"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              aria-label="Volume slider"
              className="w-18 h-1 bg-purple-200 dark:bg-purple-900 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
          </div>
        </div>

      </div>
    </footer>
  );
};
