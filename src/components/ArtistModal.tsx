import React from 'react';
import { X, Play, Music, Users, Sparkles } from 'lucide-react';
import { Artist, Track } from '../types/music';

interface ArtistModalProps {
  isOpen: boolean;
  onClose: () => void;
  artist: Artist | null;
  artistTracks: Track[];
  onPlayTrack: (track: Track) => void;
  isDarkMode: boolean;
}

export const ArtistModal: React.FC<ArtistModalProps> = ({
  isOpen,
  onClose,
  artist,
  artistTracks,
  onPlayTrack,
  isDarkMode,
}) => {
  if (!isOpen || !artist) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xl animate-fade-in">
      <div
        className={`relative w-full max-w-2xl rounded-3xl overflow-hidden border border-purple-200/50 dark:border-purple-800/40 ${
          isDarkMode ? 'bg-[#150a24]' : 'bg-[#FCFBFE]'
        } shadow-2xl flex flex-col justify-between max-h-[85vh]`}
      >
        {/* Banner with Artist Image */}
        <div className="relative h-48 w-full overflow-hidden bg-purple-950">
          <img
            src={artist.coverBannerUrl}
            alt={artist.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#150a24] via-transparent to-transparent" />
          
          <button
            onClick={onClose}
            aria-label="Close profile"
            className="absolute top-4 right-4 p-2 text-white bg-black/30 hover:bg-black/50 backdrop-blur-md rounded-xl cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 flex items-end gap-4">
            <img
              src={artist.avatarUrl}
              alt={artist.name}
              referrerPolicy="no-referrer"
              className="w-20 h-20 rounded-2xl object-cover border-2 border-white/80 shadow-xl"
            />
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-purple-300">
                {artist.genre}
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
                {artist.name}
              </h3>
            </div>
          </div>
        </div>

        {/* Artist Body Details */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="flex items-center gap-6 text-xs text-purple-700 dark:text-purple-300 font-mono">
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-purple-500" />
              <span>{artist.monthlyListeners} monthly listeners</span>
            </span>
            <span aria-hidden="true">·</span>
            <span>Spatial Audio Resident</span>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-purple-800 dark:text-purple-200 mb-2">
              Biography
            </h4>
            <p className="text-sm text-purple-900/80 dark:text-purple-200/80 leading-relaxed">
              {artist.bio}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-purple-800 dark:text-purple-200 mb-3">
              Popular Releases in Aura Catalog
            </h4>
            <div className="space-y-2">
              {artistTracks.map((track) => (
                <div
                  key={track.id}
                  onClick={() => onPlayTrack(track)}
                  className="flex items-center justify-between p-3 rounded-xl bg-purple-50/70 dark:bg-purple-900/30 hover:bg-purple-100/70 dark:hover:bg-purple-900/50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={track.coverUrl}
                      alt={track.title}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-purple-950 dark:text-white truncate">
                        {track.title}
                      </div>
                      <div className="text-[11px] text-purple-600 dark:text-purple-300 truncate">
                        {track.album} · {track.musicalKey}
                      </div>
                    </div>
                  </div>

                  <button
                    aria-label={`Play ${track.title}`}
                    className="p-2 rounded-xl bg-purple-600 text-white hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-purple-100 dark:border-purple-900/40 text-center text-xs text-purple-600 dark:text-purple-400 bg-white/30 dark:bg-black/10">
          Exclusive master license recorded for AuraLavande platform
        </div>
      </div>
    </div>
  );
};
