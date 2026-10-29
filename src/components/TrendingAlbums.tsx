import React from 'react';
import { Play, Pause, Disc } from 'lucide-react';
import { Album, Track } from '../types/music';

interface TrendingAlbumsProps {
  albums: Album[];
  tracks: Track[];
  currentTrack: Track | null;
  isPlaying: boolean;
  onPlayTrack: (track: Track) => void;
  onTogglePlay: () => void;
  onSelectAlbumFilter: (albumTitle: string) => void;
}

export const TrendingAlbums: React.FC<TrendingAlbumsProps> = ({
  albums,
  tracks,
  currentTrack,
  isPlaying,
  onPlayTrack,
  onTogglePlay,
  onSelectAlbumFilter,
}) => {
  return (
    <section id="trending-albums" className="py-12 max-w-7xl mx-auto px-6">


      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {albums.filter((a) => a.id !== 'album-for-a-reason').filter((_, idx) => idx !== 1 && idx !== 2 && idx !== 3 && idx !== 4).map((album) => {
          const firstTrack = tracks.find((t) => t.albumId === album.id) || tracks[0];
          const isThisAlbumPlaying =
            currentTrack?.albumId === album.id && isPlaying;

          return (
            <div
              key={album.id}
              className="group relative bg-white/70 dark:bg-[#180e2a]/80 backdrop-blur-md rounded-2xl p-4 border border-purple-200/50 dark:border-purple-800/40 hover:border-purple-400 dark:hover:border-purple-600 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-purple-500/10 flex flex-col justify-between"
            >
              <div>
                {/* Album Cover Art */}
                <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-4 bg-purple-100 dark:bg-purple-950/60 shadow-inner">
                  <img
                    src={album.coverUrl}
                    alt={album.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Play Overlay */}
                  <div className="absolute inset-0 bg-purple-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center backdrop-blur-[2px]">
                    <button
                      onClick={() => {
                        if (currentTrack?.albumId === album.id) {
                          onTogglePlay();
                        } else {
                          onPlayTrack(firstTrack);
                        }
                      }}
                      aria-label={`Play ${album.title}`}
                      className="w-12 h-12 rounded-full bg-white text-purple-950 flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all cursor-pointer"
                    >
                      {isThisAlbumPlaying ? (
                        <Pause className="w-5 h-5 fill-current" />
                      ) : (
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Album Metadata */}
                <div className="flex items-center gap-1.5 text-xs text-purple-600 dark:text-purple-400 mb-1.5 font-mono">
                  <span>{album.genre}</span>
                  <span aria-hidden="true">·</span>
                  <span>{album.releaseYear}</span>
                </div>

                <h3 className="font-semibold text-base text-purple-950 dark:text-purple-50 group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors truncate mb-1">
                  {album.title}
                </h3>
                <p className="text-xs text-purple-800/70 dark:text-purple-300/70 truncate mb-3">
                  {album.artist}
                </p>
                <p className="text-xs text-purple-900/60 dark:text-purple-300/60 line-clamp-2 leading-relaxed mb-4">
                  {album.description}
                </p>
              </div>

              {/* Bottom footer button: Filter to this album */}
              <div className="pt-3 border-t border-purple-100 dark:border-purple-800/40 flex items-center justify-between">
                <span className="text-[11px] text-purple-600 dark:text-purple-400 font-mono tabular-nums">
                  {album.tracksCount} tracks · {album.duration}
                </span>
                <button
                  onClick={() => onSelectAlbumFilter(album.title)}
                  className="text-xs font-medium text-purple-700 dark:text-purple-300 hover:text-purple-950 dark:hover:text-white transition-colors cursor-pointer"
                >
                  View Tracks
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
