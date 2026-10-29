import React from 'react';
import { X, Heart, Play, Music, Trash2 } from 'lucide-react';
import { Track } from '../types/music';

interface LibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedTracks: Track[];
  onPlayTrack: (track: Track) => void;
  onToggleFavorite: (trackId: string) => void;
  onPlayAll: () => void;
  isDarkMode: boolean;
}

export const LibraryModal: React.FC<LibraryModalProps> = ({
  isOpen,
  onClose,
  savedTracks,
  onPlayTrack,
  onToggleFavorite,
  onPlayAll,
  isDarkMode,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xl animate-fade-in">
      <div
        className={`relative w-full max-w-2xl h-[600px] rounded-3xl overflow-hidden border border-purple-200/50 dark:border-purple-800/40 ${
          isDarkMode ? 'bg-[#150a24]' : 'bg-[#FCFBFE]'
        } shadow-2xl flex flex-col justify-between`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-purple-100 dark:border-purple-900/40 backdrop-blur-md bg-white/40 dark:bg-black/20">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-purple-600/20 text-purple-600 dark:text-purple-300">
              <Heart className="w-5 h-5 fill-current" />
            </span>
            <div>
              <h3 className="font-display font-bold text-lg text-purple-950 dark:text-white">
                Saved Hi-Fi Collection
              </h3>
              <p className="text-xs text-purple-600 dark:text-purple-300">
                {savedTracks.length} saved {savedTracks.length === 1 ? 'master' : 'masters'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {savedTracks.length > 0 && (
              <button
                onClick={onPlayAll}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-sm cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                <span>Play All</span>
              </button>
            )}
            <button
              onClick={onClose}
              aria-label="Close library"
              className="p-2 text-purple-700 dark:text-purple-300 hover:bg-purple-100/50 dark:hover:bg-purple-900/30 rounded-xl cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {savedTracks.length === 0 ? (
            <div className="py-24 text-center">
              <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-950/60 mx-auto flex items-center justify-center text-purple-500 mb-4">
                <Music className="w-7 h-7" />
              </div>
              <h4 className="text-base font-semibold text-purple-950 dark:text-white mb-1">
                Your library is quiet
              </h4>
              <p className="text-xs text-purple-600 dark:text-purple-300 max-w-sm mx-auto">
                Tap the heart icon on any release or track to pin it to your personal lavender sanctuary.
              </p>
            </div>
          ) : (
            savedTracks.map((track) => (
              <div
                key={track.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-white/70 dark:bg-purple-950/40 border border-purple-200/50 dark:border-purple-800/40 hover:border-purple-400 dark:hover:border-purple-600 transition-all"
              >
                <div
                  onClick={() => onPlayTrack(track)}
                  className="flex items-center gap-3.5 min-w-0 flex-1 cursor-pointer"
                >
                  <img
                    src={track.coverUrl}
                    alt={track.title}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-xl object-cover shrink-0 shadow-sm"
                  />
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-purple-950 dark:text-white truncate">
                      {track.title}
                    </div>
                    <div className="text-xs text-purple-600 dark:text-purple-300 truncate">
                      {track.artist} · {track.album}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono tabular-nums text-purple-500 mr-2">
                    {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                  </span>
                  <button
                    onClick={() => onPlayTrack(track)}
                    aria-label="Play track"
                    className="p-2 rounded-xl bg-purple-600 text-white hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  </button>
                  <button
                    onClick={() => onToggleFavorite(track.id)}
                    aria-label="Remove from library"
                    className="p-2 text-purple-400 hover:text-red-500 cursor-pointer"
                    title="Remove from Library"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-purple-100 dark:border-purple-900/40 text-center text-xs text-purple-600 dark:text-purple-400 bg-white/30 dark:bg-black/10">
          Saved locally in browser storage · Ready for offline session playback
        </div>
      </div>
    </div>
  );
};
