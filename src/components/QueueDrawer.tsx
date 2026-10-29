import React from 'react';
import { X, Play, Trash2, ListMusic, Music } from 'lucide-react';
import { Track } from '../types/music';

interface QueueDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentTrack: Track | null;
  queue: Track[];
  onPlayFromQueue: (track: Track, index: number) => void;
  onRemoveFromQueue: (index: number) => void;
  onClearQueue: () => void;
  isDarkMode: boolean;
}

export const QueueDrawer: React.FC<QueueDrawerProps> = ({
  isOpen,
  onClose,
  currentTrack,
  queue,
  onPlayFromQueue,
  onRemoveFromQueue,
  onClearQueue,
  isDarkMode,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm animate-fade-in">
      <div
        className={`w-full max-w-md h-full ${
          isDarkMode ? 'bg-[#150a24]' : 'bg-[#FAF8FE]'
        } border-l border-purple-200/50 dark:border-purple-800/40 shadow-2xl flex flex-col justify-between`}
      >
        {/* Header */}
        <div className="p-6 border-b border-purple-100 dark:border-purple-900/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-purple-600/20 text-purple-600 dark:text-purple-300">
              <ListMusic className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-display font-bold text-base text-purple-950 dark:text-white">
                Playback Queue
              </h3>
              <p className="text-xs text-purple-600 dark:text-purple-300">
                {queue.length} upcoming {queue.length === 1 ? 'track' : 'tracks'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {queue.length > 0 && (
              <button
                onClick={onClearQueue}
                className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-950 dark:hover:text-white px-2 py-1 rounded cursor-pointer"
              >
                Clear
              </button>
            )}
            <button
              onClick={onClose}
              aria-label="Close queue"
              className="p-1.5 text-purple-700 dark:text-purple-300 hover:bg-purple-100/50 dark:hover:bg-purple-900/30 rounded-xl cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Queue List Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Now Playing Block */}
          {currentTrack && (
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-purple-700 dark:text-purple-300 mb-3">
                Now Playing
              </div>
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-purple-100/60 dark:bg-purple-900/40 border border-purple-200/60 dark:border-purple-800/50">
                <img
                  src={currentTrack.coverUrl}
                  alt={currentTrack.title}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-xl object-cover shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-sm text-purple-950 dark:text-white truncate">
                    {currentTrack.title}
                  </div>
                  <div className="text-xs text-purple-600 dark:text-purple-300 truncate">
                    {currentTrack.artist}
                  </div>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-ping" />
              </div>
            </div>
          )}

          {/* Up Next List */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-purple-700 dark:text-purple-300 mb-3">
              Next in Queue
            </div>
            {queue.length === 0 ? (
              <div className="py-8 text-center text-xs text-purple-500">
                Queue is empty. Click "+ Add to queue" on any track.
              </div>
            ) : (
              <div className="space-y-2">
                {queue.map((track, idx) => (
                  <div
                    key={`${track.id}-${idx}`}
                    className="group flex items-center justify-between gap-3 p-2.5 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/30 border border-transparent hover:border-purple-200/50 dark:hover:border-purple-800/40 transition-colors"
                  >
                    <div
                      onClick={() => onPlayFromQueue(track, idx)}
                      className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                    >
                      <span className="font-mono text-xs text-purple-400 w-4 text-center">
                        {idx + 1}
                      </span>
                      <img
                        src={track.coverUrl}
                        alt={track.title}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-lg object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-purple-950 dark:text-white truncate group-hover:text-purple-600 dark:group-hover:text-purple-300">
                          {track.title}
                        </div>
                        <div className="text-[11px] text-purple-600 dark:text-purple-400 truncate">
                          {track.artist}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onPlayFromQueue(track, idx)}
                        aria-label="Play track from queue"
                        className="p-1.5 text-purple-500 hover:text-purple-950 dark:hover:text-white cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      </button>
                      <button
                        onClick={() => onRemoveFromQueue(idx)}
                        aria-label="Remove track from queue"
                        className="p-1.5 text-purple-400 hover:text-red-500 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-purple-100 dark:border-purple-900/40 text-center text-xs text-purple-600 dark:text-purple-400 bg-white/30 dark:bg-black/10">
          Tracks play automatically with harmonic crossfading
        </div>
      </div>
    </div>
  );
};
