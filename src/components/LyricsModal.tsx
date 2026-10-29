import React, { useEffect, useRef } from 'react';
import { X, FileText, Music, Sparkles } from 'lucide-react';
import { Track } from '../types/music';

interface LyricsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTrack: Track | null;
  currentTime: number;
  onSeek: (time: number) => void;
  isDarkMode: boolean;
}

export const LyricsModal: React.FC<LyricsModalProps> = ({
  isOpen,
  onClose,
  currentTrack,
  currentTime,
  onSeek,
  isDarkMode,
}) => {
  const activeLineRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (activeLineRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentTime]);

  if (!isOpen || !currentTrack) return null;

  const lyrics = currentTrack.lyrics || [];

  // Find index of current active line
  let activeIndex = -1;
  for (let i = lyrics.length - 1; i >= 0; i--) {
    if (currentTime >= lyrics[i].time) {
      activeIndex = i;
      break;
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xl animate-fade-in">
      <div
        className={`relative w-full max-w-2xl h-[620px] rounded-3xl overflow-hidden border border-purple-200/50 dark:border-purple-800/40 ${
          isDarkMode ? 'bg-[#150a24]' : 'bg-[#FCFBFE]'
        } shadow-2xl flex flex-col justify-between`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-purple-100 dark:border-purple-900/40 backdrop-blur-md bg-white/40 dark:bg-black/20">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-purple-600/20 text-purple-600 dark:text-purple-300">
              <FileText className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-display font-bold text-lg text-purple-950 dark:text-white">
                Synchronized Lyrics
              </h3>
              <p className="text-xs text-purple-600 dark:text-purple-300">
                {currentTrack.title} — {currentTrack.artist}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close lyrics"
            className="p-2 text-purple-700 dark:text-purple-300 hover:bg-purple-100/50 dark:hover:bg-purple-900/30 rounded-xl cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lyrics Scrollable Container */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 text-center select-none">
          {lyrics.length === 0 ? (
            <div className="py-20 text-purple-500">No synchronized lyrics available for this track.</div>
          ) : (
            lyrics.map((line, idx) => {
              const isActive = idx === activeIndex;
              const isPast = idx < activeIndex;

              return (
                <div
                  key={idx}
                  ref={isActive ? activeLineRef : null}
                  onClick={() => onSeek(line.time)}
                  className={`group cursor-pointer py-2 px-4 rounded-2xl transition-all duration-300 ${
                    isActive
                      ? 'scale-105 font-bold text-2xl sm:text-3xl text-purple-950 dark:text-white bg-purple-200/40 dark:bg-purple-900/40 shadow-sm'
                      : isPast
                      ? 'text-lg sm:text-xl text-purple-900/50 dark:text-purple-300/40 hover:text-purple-800 dark:hover:text-purple-200'
                      : 'text-lg sm:text-xl text-purple-900/70 dark:text-purple-200/60 hover:text-purple-950 dark:hover:text-white'
                  }`}
                >
                  <p className="leading-relaxed">{line.text}</p>
                  <span className="opacity-0 group-hover:opacity-100 text-[10px] font-mono text-purple-500 transition-opacity">
                    Jump to {Math.floor(line.time / 60)}:{(line.time % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-purple-100 dark:border-purple-900/40 text-center text-xs text-purple-600/70 dark:text-purple-400/60 bg-white/30 dark:bg-black/10">
          Click any verse to seek playback instantly · Synced with spatial audio master
        </div>
      </div>
    </div>
  );
};
