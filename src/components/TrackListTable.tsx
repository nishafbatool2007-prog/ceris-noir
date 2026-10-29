import React, { useState, useMemo } from 'react';
import {
  Play,
  Pause,
  Heart,
  Plus,
  Check,
  Disc3,
  Link2,
} from 'lucide-react';
import { Track } from '../types/music';

interface TrackListTableProps {
  tracks: Track[];
  currentTrack: Track | null;
  isPlaying: boolean;
  onPlayTrack: (track: Track) => void;
  onTogglePlay: () => void;
  favoriteTrackIds: Set<string>;
  onToggleFavorite: (trackId: string) => void;
  onAddToQueue: (track: Track) => void;
  selectedAlbumFilter?: string | null;
  onClearAlbumFilter?: () => void;
  onOpenAudioLinkModal?: (track: Track) => void;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

function formatPlays(count: number): string {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(0)}K`;
  return count.toString();
}

export const TrackListTable: React.FC<TrackListTableProps> = ({
  tracks,
  currentTrack,
  isPlaying,
  onPlayTrack,
  onTogglePlay,
  favoriteTrackIds,
  onToggleFavorite,
  onAddToQueue,
  selectedAlbumFilter,
  onClearAlbumFilter,
  onOpenAudioLinkModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [addedQueueNotice, setAddedQueueNotice] = useState<string | null>(null);

  const genres = ['all', 'Chillwave', 'Lo-Fi', 'Ambient', 'Dream Pop'];

  const filteredTracks = useMemo(() => {
    return tracks.filter((t) => {
      // Album filter if active
      if (selectedAlbumFilter && !t.album.toLowerCase().includes(selectedAlbumFilter.toLowerCase())) {
        return false;
      }
      // Genre filter
      if (selectedGenre !== 'all' && !t.genre.toLowerCase().includes(selectedGenre.toLowerCase())) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          t.title.toLowerCase().includes(q) ||
          t.artist.toLowerCase().includes(q) ||
          t.album.toLowerCase().includes(q) ||
          t.musicalKey.toLowerCase().includes(q) ||
          t.mood.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [tracks, selectedAlbumFilter, selectedGenre, searchQuery]);

  const handleQueueClick = (track: Track) => {
    onAddToQueue(track);
    setAddedQueueNotice(track.id);
    setTimeout(() => setAddedQueueNotice(null), 1500);
  };

  return (
    <section id="top-tracks" className="py-12 max-w-7xl mx-auto px-6">
      
      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-1.5 p-1 bg-purple-100/60 dark:bg-purple-950/60 rounded-xl border border-purple-200/50 dark:border-purple-800/40 overflow-x-auto w-full sm:w-auto">
          {genres.map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGenre(g)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all capitalize cursor-pointer whitespace-nowrap ${
                selectedGenre === g
                  ? 'bg-white dark:bg-purple-800 text-purple-950 dark:text-white shadow-sm'
                  : 'text-purple-700 dark:text-purple-300 hover:text-purple-950 dark:hover:text-white'
              }`}
            >
              {g === 'all' ? 'All Genres' : g}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {selectedAlbumFilter && (
            <div className="flex items-center gap-2 text-xs bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200 px-3 py-1.5 rounded-lg border border-purple-200 dark:border-purple-700 shrink-0">
              <Disc3 className="w-3.5 h-3.5 text-purple-600" />
              <span>Filtered: <strong className="font-semibold">{selectedAlbumFilter}</strong></span>
              {onClearAlbumFilter && (
                <button
                  onClick={onClearAlbumFilter}
                  className="ml-1 underline font-medium hover:text-purple-950 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Track List Container */}
      <div className="rounded-2xl border border-purple-200/60 dark:border-purple-800/40 bg-white/80 dark:bg-[#160c28]/80 backdrop-blur-md overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-purple-100 dark:border-purple-800/60 text-purple-600/75 dark:text-purple-300/70 font-mono uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4">Title & Artist</th>
                <th className="py-3 px-4 hidden md:table-cell">Album</th>
                <th className="py-3 px-4 hidden sm:table-cell">Musical Key & BPM</th>
                <th className="py-3 px-4 hidden lg:table-cell text-right">Plays</th>
                <th className="py-3 px-4 text-right">Time</th>
                <th className="py-3 px-4 w-20 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-100/50 dark:divide-purple-900/30">
              {filteredTracks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-purple-600/80 dark:text-purple-300/80">
                    No tracks found matching your query. Try resetting filters.
                  </td>
                </tr>
              ) : (
                filteredTracks.map((track, idx) => {
                  const isCurrent = currentTrack?.id === track.id;
                  const isTrackPlaying = isCurrent && isPlaying;
                  const isFavorite = favoriteTrackIds.has(track.id);

                  return (
                    <tr
                      key={track.id}
                      onClick={() => {
                        if (isCurrent) {
                          onTogglePlay();
                        } else {
                          onPlayTrack(track);
                        }
                      }}
                      className={`group hover:bg-purple-100/60 dark:hover:bg-purple-900/35 transition-colors cursor-pointer ${
                        isCurrent
                          ? 'bg-purple-100/70 dark:bg-purple-900/50 font-medium'
                          : ''
                      }`}
                    >
                      {/* Play/Index Button */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isCurrent) {
                              onTogglePlay();
                            } else {
                              onPlayTrack(track);
                            }
                          }}
                          aria-label={isTrackPlaying ? 'Pause track' : 'Play track'}
                          className="w-7 h-7 rounded-lg text-purple-700 dark:text-purple-300 hover:text-purple-950 dark:hover:text-white hover:bg-purple-200/60 dark:hover:bg-purple-800/60 flex items-center justify-center transition-all cursor-pointer mx-auto"
                        >
                          {isTrackPlaying ? (
                            <Pause className="w-3.5 h-3.5 fill-current" />
                          ) : (
                            <>
                              <span className="group-hover:hidden font-mono tabular-nums text-purple-400 dark:text-purple-500">
                                {idx + 1}
                              </span>
                              <Play className="w-3.5 h-3.5 fill-current hidden group-hover:block ml-0.5" />
                            </>
                          )}
                        </button>
                      </td>

                      {/* Track Title and Artist with thumbnail */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={track.coverUrl}
                            alt={track.title}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 rounded-lg object-cover shrink-0 shadow-sm border border-purple-200/50 dark:border-purple-800/40"
                          />
                          <div className="min-w-0">
                            <div className="font-semibold text-purple-950 dark:text-purple-100 truncate text-[13px] flex items-center gap-2">
                              <span>{track.title}</span>
                              {isCurrent && isTrackPlaying && (
                                <span className="inline-flex items-center gap-0.5">
                                  <span className="w-1 h-3 bg-purple-500 rounded-full animate-pulse" />
                                  <span className="w-1 h-4 bg-purple-600 rounded-full animate-pulse" style={{ animationDelay: '100ms' }} />
                                  <span className="w-1 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '200ms' }} />
                                </span>
                              )}
                            </div>
                            <div className="text-purple-600 dark:text-purple-300 text-[11px] truncate">
                              {track.artist}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Album name */}
                      <td className="py-3 px-4 text-purple-800/80 dark:text-purple-200/70 hidden md:table-cell truncate max-w-[180px]">
                        {track.album}
                      </td>

                      {/* Key & BPM */}
                      <td className="py-3 px-4 font-mono tabular-nums text-purple-700/80 dark:text-purple-300/80 hidden sm:table-cell">
                        <span>{track.musicalKey}</span>
                        <span className="text-purple-300 dark:text-purple-600 mx-1.5">/</span>
                        <span>{track.bpm} BPM</span>
                      </td>

                      {/* Plays */}
                      <td className="py-3 px-4 font-mono tabular-nums text-right text-purple-800/70 dark:text-purple-300/70 hidden lg:table-cell">
                        {formatPlays(track.plays)}
                      </td>

                      {/* Duration */}
                      <td className="py-3 px-4 font-mono tabular-nums text-right text-purple-900/80 dark:text-purple-200/80">
                        {formatDuration(track.duration)}
                      </td>

                      {/* Actions: Like, Audio Stream Link & Queue */}
                      <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1">
                          {onOpenAudioLinkModal && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenAudioLinkModal(track);
                              }}
                              aria-label="Set audio stream URL"
                              className="p-1.5 text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors cursor-pointer"
                              title="Custom Audio Stream URL / File"
                            >
                              <Link2 className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleFavorite(track.id);
                            }}
                            aria-label={isFavorite ? 'Unlike track' : 'Like track'}
                            className="p-1.5 text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors cursor-pointer"
                          >
                            <Heart
                              className={`w-3.5 h-3.5 ${
                                isFavorite ? 'fill-purple-600 text-purple-600' : ''
                              }`}
                            />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQueueClick(track);
                            }}
                            aria-label="Add track to playback queue"
                            className="p-1.5 text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors cursor-pointer relative"
                            title="Add to Next Queue"
                          >
                            {addedQueueNotice === track.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                              <Plus className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
