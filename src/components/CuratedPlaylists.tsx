import React from 'react';
import { Play } from 'lucide-react';
import { Playlist, Track } from '../types/music';

interface CuratedPlaylistsProps {
  playlists: Playlist[];
  tracks: Track[];
  currentTrack: Track | null;
  isPlaying: boolean;
  onPlayPlaylist: (playlist: Playlist) => void;
}

export const CuratedPlaylists: React.FC<CuratedPlaylistsProps> = ({
  playlists,
  currentTrack,
  isPlaying,
  onPlayPlaylist,
}) => {
  return (
    <section id="curated-mixes" className="py-12 max-w-7xl mx-auto px-6">


      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {playlists.filter((pl) => pl.id !== 'pl-karan-aujla').slice(0, 4).filter((_, idx) => idx !== 1 && idx !== 3).map((pl) => {
          const isThisStationPlaying =
            isPlaying && pl.tracks.includes(currentTrack?.id || '');

          return (
            <div
              key={pl.id}
              className="relative rounded-2xl overflow-hidden p-5 border border-purple-200/50 dark:border-purple-800/40 bg-white/70 dark:bg-[#190e2d]/80 backdrop-blur-md shadow-sm hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 group flex flex-col justify-between min-h-[260px]"
            >
              {/* Subtle gradient wash */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-400/10 dark:bg-purple-600/10 rounded-full blur-2xl pointer-events-none" />

              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-mono text-purple-600 dark:text-purple-400 font-medium">
                    {pl.moodTag}
                  </span>
                  <span className="text-[11px] font-mono text-purple-500 dark:text-purple-400 tabular-nums">
                    {pl.tracks.length} tracks
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-purple-200/60 dark:border-purple-700/40 shadow-md">
                    <img
                      src={pl.coverUrl}
                      alt={pl.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-base text-purple-950 dark:text-purple-100 group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors truncate">
                      {pl.title}
                    </h3>
                    <p className="text-xs text-purple-700/70 dark:text-purple-300/70 truncate">
                      Curated by {pl.curator}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-purple-900/70 dark:text-purple-200/70 leading-relaxed line-clamp-2 mb-4">
                  {pl.description}
                </p>
              </div>

              <div className="pt-3 border-t border-purple-100 dark:border-purple-800/40 flex items-center justify-between">
                <span className="text-xs text-purple-500 dark:text-purple-400">
                  Adaptive crossfade
                </span>
                <button
                  onClick={() => onPlayPlaylist(pl)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium shadow-md shadow-purple-600/20 active:scale-95 transition-all cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  <span>{isThisStationPlaying ? 'Restart Mix' : 'Stream Mix'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
