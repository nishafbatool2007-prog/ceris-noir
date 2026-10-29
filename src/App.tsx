/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLenis } from './hooks/useLenis';
import { audioEngine } from './services/audioEngine';
import { TRACKS, ALBUMS, PLAYLISTS, ARTISTS } from './data/mockCatalog';
import { EqualizerSettings, Playlist, Track } from './types/music';

// Components
import { Navbar } from './components/Navbar';
import { HeroSpotlight } from './components/HeroSpotlight';
import { TrendingAlbums } from './components/TrendingAlbums';
import { CuratedPlaylists } from './components/CuratedPlaylists';
import { TrackListTable } from './components/TrackListTable';
import { SoundLabSection } from './components/SoundLabSection';
import { MoodSanctuary } from './components/MoodSanctuary';
import { FloatingPlayerBar } from './components/FloatingPlayerBar';
import { AudioVisualizerModal } from './components/AudioVisualizerModal';
import { LyricsModal } from './components/LyricsModal';
import { EqualizerModal } from './components/EqualizerModal';
import { QueueDrawer } from './components/QueueDrawer';
import { LibraryModal } from './components/LibraryModal';
import { ArtistModal } from './components/ArtistModal';
import { AudioLinkModal } from './components/AudioLinkModal';
import { MinimalPreloader } from './components/MinimalPreloader';
import { Footer } from './components/Footer';

export default function App() {
  // Lenis smooth scroll hook
  const { scrollTo } = useLenis();

  // Dynamic catalog state so audio streams can be modified
  const [tracks, setTracks] = useState<Track[]>(TRACKS);

  // Theme state: default daylight soft lavender & white
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('auralavande_theme') === 'dark';
  });

  // Playback state
  const [currentTrack, setCurrentTrack] = useState<Track>(TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [hasPlayerStarted, setHasPlayerStarted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [isRepeat, setIsRepeat] = useState<boolean>(false);

  // Queue state
  const [queue, setQueue] = useState<Track[]>([TRACKS[1], TRACKS[2], TRACKS[3]]);

  // Favorites library
  const [favoriteTrackIds, setFavoriteTrackIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('auralavande_favorites');
      if (saved) return new Set(JSON.parse(saved));
    } catch (e) {
      // fallback
    }
    return new Set(['track-1', 'track-2', 'track-4']);
  });

  // Equalizer settings
  const [eqSettings, setEqSettings] = useState<EqualizerSettings>({
    bass: 2,
    mid: 0,
    treble: 1,
    reverb: 30,
    vinylNoise: 15,
    rainSound: 0,
  });

  // Modals state
  const [isVisualizerOpen, setIsVisualizerOpen] = useState(false);
  const [isLyricsOpen, setIsLyricsOpen] = useState(false);
  const [isEqualizerOpen, setIsEqualizerOpen] = useState(false);
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [selectedArtistId, setSelectedArtistId] = useState<string | null>(null);
  const [selectedAlbumFilter, setSelectedAlbumFilter] = useState<string | null>(null);
  const [audioLinkModalTrack, setAudioLinkModalTrack] = useState<Track | null>(null);

  const handleUpdateAudioUrl = useCallback((trackId: string, newUrl: string) => {
    setTracks((prevTracks) =>
      prevTracks.map((t) => (t.id === trackId ? { ...t, audioUrl: newUrl } : t))
    );
    if (currentTrack?.id === trackId) {
      const updatedTrack = { ...currentTrack, audioUrl: newUrl };
      setCurrentTrack(updatedTrack);
      audioEngine.playTrack(updatedTrack, 0);
    }
  }, [currentTrack]);

  // Synchronize audio engine state
  useEffect(() => {
    const unsubTime = audioEngine.subscribeTime((time) => {
      setCurrentTime(time);
    });
    const unsubState = audioEngine.subscribeState((playing) => {
      setIsPlaying(playing);
      if (playing) setHasPlayerStarted(true);
    });

    audioEngine.applyEqualizer(eqSettings);

    return () => {
      unsubTime();
      unsubState();
    };
  }, []);

  // Update theme class on HTML element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('auralavande_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('auralavande_theme', 'light');
    }
  }, [isDarkMode]);

  // Persist favorites
  useEffect(() => {
    try {
      localStorage.setItem(
        'auralavande_favorites',
        JSON.stringify(Array.from(favoriteTrackIds))
      );
    } catch (e) {
      // ignore
    }
  }, [favoriteTrackIds]);

  // Play a specific track
  const handlePlayTrack = useCallback((track: Track) => {
    setHasPlayerStarted(true);
    setCurrentTrack(track);
    audioEngine.playTrack(track, 0);
  }, []);

  // Toggle play/pause
  const handleTogglePlay = useCallback(() => {
    setHasPlayerStarted(true);
    if (isPlaying) {
      audioEngine.pause();
    } else {
      if (audioEngine.getCurrentTime() > 0 && currentTrack) {
        audioEngine.resume();
      } else if (currentTrack) {
        audioEngine.playTrack(currentTrack, currentTime);
      } else {
        handlePlayTrack(TRACKS[0]);
      }
    }
  }, [isPlaying, currentTrack, currentTime, handlePlayTrack]);

  // Next Track
  const handleNext = useCallback(() => {
    if (queue.length > 0) {
      const nextTrack = queue[0];
      setQueue((prev) => prev.slice(1));
      handlePlayTrack(nextTrack);
      return;
    }

    if (isShuffle) {
      const remaining = TRACKS.filter((t) => t.id !== currentTrack.id);
      const randomTrack = remaining[Math.floor(Math.random() * remaining.length)];
      handlePlayTrack(randomTrack);
      return;
    }

    const currentIndex = TRACKS.findIndex((t) => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % TRACKS.length;
    handlePlayTrack(TRACKS[nextIndex]);
  }, [queue, isShuffle, currentTrack, handlePlayTrack]);

  // Previous Track
  const handlePrev = useCallback(() => {
    if (currentTime > 4) {
      audioEngine.seek(0);
      return;
    }
    const currentIndex = TRACKS.findIndex((t) => t.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + TRACKS.length) % TRACKS.length;
    handlePlayTrack(TRACKS[prevIndex]);
  }, [currentTime, currentTrack, handlePlayTrack]);

  // Seek timeline
  const handleSeek = (seconds: number) => {
    audioEngine.seek(seconds);
    setCurrentTime(seconds);
  };

  // Volume
  const handleVolumeChange = (vol: number) => {
    setVolume(vol);
    if (isMuted && vol > 0) setIsMuted(false);
    audioEngine.setVolume(vol);
  };

  // Mute toggle
  const handleToggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      audioEngine.setVolume(volume);
    } else {
      setIsMuted(true);
      audioEngine.setVolume(0);
    }
  };

  // Equalizer update
  const handleUpdateEqSettings = (newSettings: EqualizerSettings) => {
    setEqSettings(newSettings);
    audioEngine.applyEqualizer(newSettings);
  };

  // Toggle favorite for current or specific track
  const handleToggleFavorite = (trackId: string) => {
    setFavoriteTrackIds((prev) => {
      const next = new Set(prev);
      if (next.has(trackId)) {
        next.delete(trackId);
      } else {
        next.add(trackId);
      }
      return next;
    });
  };

  // Add to queue
  const handleAddToQueue = (track: Track) => {
    setQueue((prev) => [...prev, track]);
  };

  // Play from queue
  const handlePlayFromQueue = (track: Track, index: number) => {
    setQueue((prev) => prev.filter((_, i) => i !== index));
    handlePlayTrack(track);
  };

  // Play whole playlist
  const handlePlayPlaylist = (playlist: Playlist) => {
    const plTracks = TRACKS.filter((t) => playlist.tracks.includes(t.id));
    if (plTracks.length > 0) {
      handlePlayTrack(plTracks[0]);
      setQueue(plTracks.slice(1));
    }
  };

  // Play all saved tracks
  const handlePlayAllSaved = () => {
    const saved = TRACKS.filter((t) => favoriteTrackIds.has(t.id));
    if (saved.length > 0) {
      handlePlayTrack(saved[0]);
      setQueue(saved.slice(1));
      setIsLibraryOpen(false);
    }
  };

  // Active artist for modal
  const selectedArtist = useMemo(() => {
    if (!selectedArtistId) return null;
    return ARTISTS.find((a) => a.id === selectedArtistId) || null;
  }, [selectedArtistId]);

  const selectedArtistTracks = useMemo(() => {
    if (!selectedArtist) return [];
    return TRACKS.filter((t) => t.artistId === selectedArtist.id);
  }, [selectedArtist]);

  // Saved tracks list for modal
  const savedTracks = useMemo(() => {
    return TRACKS.filter((t) => favoriteTrackIds.has(t.id));
  }, [favoriteTrackIds]);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode
          ? 'bg-[#0E061A] text-purple-100'
          : 'bg-[#FAF8FE] text-slate-900'
      }`}
    >
      {/* Minimal Elegant Preloader */}
      <MinimalPreloader isDarkMode={isDarkMode} />

      {/* Dynamic ambient background illumination */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-purple-300/20 dark:bg-purple-900/15 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] bg-lavender-300/25 dark:bg-indigo-950/20 rounded-full blur-[140px]" />
        <div className="absolute bottom-20 left-1/3 w-[500px] h-[500px] bg-purple-400/15 dark:bg-purple-800/10 rounded-full blur-[120px]" />
      </div>

      {/* Top Header with Integrated Quick Tools (Replacing Dock) */}
      <Navbar
        onNavClick={(target) => scrollTo(target)}
        onOpenLibrary={() => setIsLibraryOpen(true)}
        onOpenVisualizer={() => setIsVisualizerOpen(true)}
        onOpenLyrics={() => setIsLyricsOpen(true)}
        onOpenEqualizer={() => setIsEqualizerOpen(true)}
        onOpenQueue={() => setIsQueueOpen(true)}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        savedTracksCount={favoriteTrackIds.size}
        queueCount={queue.length}
        isPlaying={isPlaying}
      />

      {/* Main Content Area with Lenis Smooth Scrolling */}
      <main className="w-full">
        {/* Hero Spotlight Section */}
        <HeroSpotlight
          album={ALBUMS[0]}
          featuredTrack={TRACKS[0]}
          isPlaying={isPlaying}
          isCurrentPlayingTrack={currentTrack.id === TRACKS[0].id}
          onPlayTrack={handlePlayTrack}
          onTogglePlay={handleTogglePlay}
          isFavorite={favoriteTrackIds.has(TRACKS[0].id)}
          onToggleFavorite={() => handleToggleFavorite(TRACKS[0].id)}
          onOpenArtist={(artistId) => setSelectedArtistId(artistId)}
          onOpenVisualizer={() => setIsVisualizerOpen(true)}
          onOpenLyrics={() => setIsLyricsOpen(true)}
        />

        {/* Trending Releases */}
        <TrendingAlbums
          albums={ALBUMS}
          tracks={TRACKS}
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          onPlayTrack={handlePlayTrack}
          onTogglePlay={handleTogglePlay}
          onSelectAlbumFilter={(albumTitle) => {
            setSelectedAlbumFilter(albumTitle);
            scrollTo('#top-tracks');
          }}
        />

        {/* Curated Lavender Mood Mixes */}
        <CuratedPlaylists
          playlists={PLAYLISTS}
          tracks={TRACKS}
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          onPlayPlaylist={handlePlayPlaylist}
        />

        {/* High-Density Discography Track Table */}
        <TrackListTable
          tracks={tracks}
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          onPlayTrack={handlePlayTrack}
          onTogglePlay={handleTogglePlay}
          favoriteTrackIds={favoriteTrackIds}
          onToggleFavorite={handleToggleFavorite}
          onAddToQueue={handleAddToQueue}
          selectedAlbumFilter={selectedAlbumFilter}
          onClearAlbumFilter={() => setSelectedAlbumFilter(null)}
          onOpenAudioLinkModal={(track) => setAudioLinkModalTrack(track)}
        />

        {/* Mood Oasis & Sleep Sanctuary Engine */}
        <MoodSanctuary
          tracks={tracks}
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          onPlayTrack={handlePlayTrack}
          onTogglePlay={handleTogglePlay}
          isDarkMode={isDarkMode}
        />

        {/* Sound Lab & Ambient Tuning */}
        <SoundLabSection
          settings={eqSettings}
          onUpdateSettings={handleUpdateEqSettings}
          onOpenVisualizer={() => setIsVisualizerOpen(true)}
          isDarkMode={isDarkMode}
        />
      </main>

      {/* Footer */}
      <Footer onScrollToTop={() => scrollTo(0)} isDarkMode={isDarkMode} />


      {/* Persistent Bottom Floating Audio Player Bar */}
      {hasPlayerStarted && (
        <FloatingPlayerBar
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          currentTime={currentTime}
          onTogglePlay={handleTogglePlay}
          onNext={handleNext}
          onPrev={handlePrev}
          onSeek={handleSeek}
          volume={volume}
          onVolumeChange={handleVolumeChange}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          isRepeat={isRepeat}
          onToggleRepeat={() => setIsRepeat(!isRepeat)}
          isShuffle={isShuffle}
          onToggleShuffle={() => setIsShuffle(!isShuffle)}
          isFavorite={favoriteTrackIds.has(currentTrack?.id || '')}
          onToggleFavorite={() =>
            currentTrack && handleToggleFavorite(currentTrack.id)
          }
          onOpenLyrics={() => setIsLyricsOpen(true)}
          onOpenVisualizer={() => setIsVisualizerOpen(true)}
          onOpenQueue={() => setIsQueueOpen(true)}
          isDarkMode={isDarkMode}
        />
      )}

      {/* Interactive Modals & Drawers */}
      <AudioVisualizerModal
        isOpen={isVisualizerOpen}
        onClose={() => setIsVisualizerOpen(false)}
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        isDarkMode={isDarkMode}
      />

      <LyricsModal
        isOpen={isLyricsOpen}
        onClose={() => setIsLyricsOpen(false)}
        currentTrack={currentTrack}
        currentTime={currentTime}
        onSeek={handleSeek}
        isDarkMode={isDarkMode}
      />

      <EqualizerModal
        isOpen={isEqualizerOpen}
        onClose={() => setIsEqualizerOpen(false)}
        settings={eqSettings}
        onUpdateSettings={handleUpdateEqSettings}
        isDarkMode={isDarkMode}
      />

      <QueueDrawer
        isOpen={isQueueOpen}
        onClose={() => setIsQueueOpen(false)}
        currentTrack={currentTrack}
        queue={queue}
        onPlayFromQueue={handlePlayFromQueue}
        onRemoveFromQueue={(idx) =>
          setQueue((prev) => prev.filter((_, i) => i !== idx))
        }
        onClearQueue={() => setQueue([])}
        isDarkMode={isDarkMode}
      />

      <LibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        savedTracks={savedTracks}
        onPlayTrack={handlePlayTrack}
        onToggleFavorite={handleToggleFavorite}
        onPlayAll={handlePlayAllSaved}
        isDarkMode={isDarkMode}
      />

      <ArtistModal
        isOpen={selectedArtistId !== null}
        onClose={() => setSelectedArtistId(null)}
        artist={selectedArtist}
        artistTracks={selectedArtistTracks}
        onPlayTrack={handlePlayTrack}
        isDarkMode={isDarkMode}
      />

      <AudioLinkModal
        isOpen={audioLinkModalTrack !== null}
        onClose={() => setAudioLinkModalTrack(null)}
        track={audioLinkModalTrack}
        onUpdateAudioUrl={handleUpdateAudioUrl}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}
