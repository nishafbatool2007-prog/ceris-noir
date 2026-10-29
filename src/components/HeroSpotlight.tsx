import React, { useRef, useEffect, useState } from 'react';
import {
  Play,
  Pause,
  Heart,
  Sparkles,
  Radio,
  SlidersHorizontal,
  Compass,
  Disc3,
  Volume2,
} from 'lucide-react';
import { Album, Track } from '../types/music';
import { HERO_IMAGE, ALBUM_SILK_WAVES, ALBUM_DUSK_REVERIE } from '../data/mockCatalog';
import { SilkBackground } from './SilkBackground';

interface HeroSpotlightProps {
  album: Album;
  featuredTrack: Track;
  isPlaying: boolean;
  isCurrentPlayingTrack: boolean;
  onPlayTrack: (track: Track) => void;
  onTogglePlay: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onOpenArtist: (artistId: string) => void;
  onOpenVisualizer: () => void;
  onOpenLyrics: () => void;
}

export const HeroSpotlight: React.FC<HeroSpotlightProps> = ({
  album,
  featuredTrack,
  isPlaying,
  isCurrentPlayingTrack,
  onPlayTrack,
  onTogglePlay,
  isFavorite,
  onToggleFavorite,
  onOpenArtist,
  onOpenVisualizer,
}) => {
  const isCurrentlyActive = isCurrentPlayingTrack && isPlaying;

  const imgRef = useRef<HTMLImageElement>(null);
  const portalContainerRef = useRef<HTMLDivElement>(null);
  const targetScrollY = useRef(0);
  const currentScrollY = useRef(0);
  const targetMouse = useRef({ x: 0, y: 0 });
  const currentMouse = useRef({ x: 0, y: 0 });

  const [activeSpatialMode, setActiveSpatialMode] = useState<'3d' | 'binaural' | '432hz'>('3d');

  useEffect(() => {
    let animationFrameId: number;

    const handleScroll = () => {
      targetScrollY.current = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Ultra-smooth continuous lerp render loop (0.04 factor for liquid silk inertia)
    const renderLoop = () => {
      currentScrollY.current += (targetScrollY.current - currentScrollY.current) * 0.04;
      currentMouse.current.x += (targetMouse.current.x - currentMouse.current.x) * 0.04;
      currentMouse.current.y += (targetMouse.current.y - currentMouse.current.y) * 0.04;

      if (imgRef.current) {
        const translateY = Math.min(currentScrollY.current * 0.1, 45);
        const scale = 1.05 + Math.min(currentScrollY.current * 0.00015, 0.03);
        imgRef.current.style.transform = `translate3d(${(
          currentMouse.current.x * 1.2
        ).toFixed(3)}px, ${(translateY + currentMouse.current.y * 1.2).toFixed(
          3
        )}px, 0) scale(${scale.toFixed(4)})`;
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    animationFrameId = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!portalContainerRef.current) return;
    const rect = portalContainerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    targetMouse.current = { x: x * 22, y: y * 22 };
  };

  const handleMouseLeave = () => {
    targetMouse.current = { x: 0, y: 0 };
  };

  const handlePrimaryAction = () => {
    if (isCurrentPlayingTrack) {
      onTogglePlay();
    } else {
      onPlayTrack(featuredTrack);
    }
  };

  return (
    <section id="spotlight" className="relative w-full pt-2 pb-12 overflow-hidden select-none">
      {/* Interactive WebGL Silk Shader Background */}
      <div className="absolute inset-0 w-full h-full pointer-events-none -z-10 opacity-70 dark:opacity-85 overflow-hidden">
        <SilkBackground speed={0.35} scale={1.0} interactive={true} />
      </div>

      {/* Atmospheric Ambient Radial Illumination */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-to-b from-purple-400/20 via-fuchsia-300/10 to-transparent dark:from-purple-900/30 dark:via-fuchsia-950/15 dark:to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Main Dreamcore Landing Stage */}
        <div
          ref={portalContainerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative rounded-3xl sm:rounded-[2.5rem] overflow-hidden border border-purple-200/60 dark:border-purple-800/50 shadow-[0_30px_90px_-20px_rgba(107,33,168,0.35)] bg-[#0c0517] group"
        >
          {/* Background Dreamcore Portal Image with Smooth Parallax */}
          <div className="relative w-full aspect-[4/3] md:aspect-[16/9] lg:aspect-[21/9] min-h-[580px] max-h-[720px] overflow-hidden">
            <img
              ref={imgRef}
              src={HERO_IMAGE}
              alt="Dreamcore Crystal Portal"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center will-change-transform brightness-[0.92] dark:brightness-[0.88] contrast-[1.05]"
              style={{
                transform: 'translate3d(0px, 0px, 0) scale(1.05)',
              }}
            />

            {/* Subtle Vignette & Gradient Overlays for Cinematic Depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0517] via-[#0c0517]/30 to-black/40 pointer-events-none" />
            <div className="absolute inset-0 bg-radial-vignette pointer-events-none" />

            {/* Top Navigation Frame Strip overlaying Portal Arch */}
            <div className="absolute top-0 inset-x-0 p-4 sm:p-6 flex items-center justify-between text-[11px] sm:text-xs font-mono tracking-widest uppercase text-purple-200/80 pointer-events-auto z-20">
              <div className="flex items-center gap-3 sm:gap-5 text-purple-200/90 drop-shadow-md">
                <span className="hover:text-white transition-colors cursor-pointer">WORLDS</span>
                <span className="text-purple-400/40">·</span>
                <span className="hover:text-white transition-colors cursor-pointer">ATELIER</span>
                <span className="text-purple-400/40">·</span>
                <span className="hover:text-white transition-colors cursor-pointer">IMMERSIONS</span>
              </div>

              <div className="flex items-center gap-3 sm:gap-5 text-purple-200/90 drop-shadow-md">
                <span className="hover:text-white transition-colors cursor-pointer">SPATIAL 3D</span>
                <span className="text-purple-400/40 hidden sm:inline">·</span>
                <span className="hover:text-white transition-colors cursor-pointer hidden sm:inline">HI-RES AUDIO</span>
                <span className="text-purple-400/40">·</span>
                <span className="hover:text-white transition-colors cursor-pointer">432 HZ TUNING</span>
              </div>
            </div>

            {/* Center Dreamcore Portal Grid Content */}
            <div className="absolute inset-0 p-6 sm:p-10 lg:p-12 flex flex-col justify-between z-10">
              {/* Spacer for Top Bar */}
              <div className="h-10" />

              {/* Central Title & Floating Audio Cards Container */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end my-auto">
                {/* Left Portal Headline & Main CTA */}
                <div className="lg:col-span-7 space-y-4 sm:space-y-6">
                  {/* Zero-Pill Unboxed Subtitle */}
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-mono tracking-wider text-fuchsia-300/90 uppercase drop-shadow-md">
                    <Sparkles className="w-4 h-4 text-purple-300 animate-pulse" />
                    <span>DREAMCORE LANDING · ETHEREAL SOUNDSTAGE</span>
                  </div>

                  <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight text-white leading-[1.05] drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)]">
                    FALL INTO <br />
                    <span className="font-normal italic bg-gradient-to-r from-purple-200 via-fuchsia-200 to-indigo-100 bg-clip-text text-transparent">
                      REVERIE
                    </span>
                  </h1>

                  <p className="max-w-xl text-sm sm:text-base text-purple-100/80 leading-relaxed font-sans drop-shadow-md">
                    Cross the crystal aperture into a continuous spatial soundscape. Tuned to 432 Hz organic resonance with liquid binaural waves and ultra-fidelity acoustic ambience.
                  </p>

                  {/* Primary CTA Row */}
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
                    <button
                      onClick={handlePrimaryAction}
                      className="group flex items-center gap-3 px-6 py-3.5 bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-2xl font-medium text-sm shadow-[0_10px_30px_rgba(168,85,247,0.4)] hover:shadow-[0_15px_40px_rgba(168,85,247,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer border border-purple-300/30"
                    >
                      {isCurrentlyActive ? (
                        <>
                          <Pause className="w-4 h-4 fill-current" />
                          <span>Pause Soundstage</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                          <span>Stream Master Soundstage</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={onOpenVisualizer}
                      className="flex items-center gap-2 px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-sm font-medium border border-white/20 backdrop-blur-md transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                    >
                      <Radio className="w-4 h-4 text-fuchsia-300" />
                      <span>3D Visualizer</span>
                    </button>
                  </div>
                </div>

                {/* Right Interactive Glass Audio Cards (Direct inspiration from reference screenshot 150df6ae) */}
                <div className="lg:col-span-5 flex flex-col gap-3.5">
                  {/* Floating Card 1: Featured Track Control Card */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-black/40 hover:bg-black/50 border border-purple-300/25 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:border-purple-300/40 group/card">
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-fuchsia-400 animate-ping" />
                        <span className="text-[11px] font-mono text-purple-200/90 tracking-wider uppercase">
                          CURRENTLY FEATURED
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-fuchsia-300 bg-purple-950/60 border border-purple-500/30 px-2 py-0.5 rounded-md">
                        24-Bit / 96kHz
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-purple-300/30 shadow-md">
                        <img
                          src={ALBUM_SILK_WAVES}
                          alt={featuredTrack.title}
                          className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-500"
                        />
                        {isCurrentlyActive && (
                          <div className="absolute inset-0 bg-purple-950/50 flex items-center justify-center">
                            <div className="flex items-end gap-0.5 h-4">
                              <span className="w-1 bg-white rounded-full animate-bounce h-2" />
                              <span
                                className="w-1 bg-white rounded-full animate-bounce h-4"
                                style={{ animationDelay: '150ms' }}
                              />
                              <span
                                className="w-1 bg-white rounded-full animate-bounce h-3"
                                style={{ animationDelay: '300ms' }}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="font-display font-medium text-base text-white truncate">
                          {featuredTrack.title}
                        </h3>
                        <p className="text-xs text-purple-200/70 truncate">
                          {featuredTrack.artist} · {album.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5 text-[11px] font-mono text-purple-300/80">
                          <span>
                            {Math.floor(featuredTrack.duration / 60)}:
                            {(featuredTrack.duration % 60).toString().padStart(2, '0')}
                          </span>
                          <span>·</span>
                          <span>{featuredTrack.genre}</span>
                        </div>
                      </div>

                      <button
                        onClick={onToggleFavorite}
                        className="p-2.5 rounded-xl border border-purple-400/20 text-purple-200 hover:text-white hover:bg-purple-500/20 transition-colors cursor-pointer shrink-0"
                        title="Add to Favorites"
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            isFavorite ? 'fill-fuchsia-400 text-fuchsia-400' : ''
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Floating Card 2: Spatial Sound Modes */}
                  <div className="p-4 rounded-2xl bg-purple-950/30 hover:bg-purple-950/40 border border-purple-300/20 backdrop-blur-xl transition-all">
                    <div className="flex items-center justify-between text-xs font-mono text-purple-200/90 mb-2.5">
                      <div className="flex items-center gap-2">
                        <SlidersHorizontal className="w-3.5 h-3.5 text-fuchsia-300" />
                        <span>SPATIAL ACOUSTIC ENGINE</span>
                      </div>
                      <span className="text-[10px] text-fuchsia-300/80">Active</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setActiveSpatialMode('3d')}
                        className={`flex flex-col items-center p-2 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                          activeSpatialMode === '3d'
                            ? 'bg-purple-600/60 border-fuchsia-400/60 text-white shadow-[0_0_15px_rgba(192,132,252,0.4)]'
                            : 'bg-black/20 border-purple-400/15 text-purple-300/70 hover:text-white'
                        }`}
                      >
                        <Disc3 className="w-3.5 h-3.5 mb-1" />
                        <span>3D Spatial</span>
                      </button>

                      <button
                        onClick={() => setActiveSpatialMode('binaural')}
                        className={`flex flex-col items-center p-2 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                          activeSpatialMode === 'binaural'
                            ? 'bg-purple-600/60 border-fuchsia-400/60 text-white shadow-[0_0_15px_rgba(192,132,252,0.4)]'
                            : 'bg-black/20 border-purple-400/15 text-purple-300/70 hover:text-white'
                        }`}
                      >
                        <Volume2 className="w-3.5 h-3.5 mb-1" />
                        <span>Binaural</span>
                      </button>

                      <button
                        onClick={() => setActiveSpatialMode('432hz')}
                        className={`flex flex-col items-center p-2 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                          activeSpatialMode === '432hz'
                            ? 'bg-purple-600/60 border-fuchsia-400/60 text-white shadow-[0_0_15px_rgba(192,132,252,0.4)]'
                            : 'bg-black/20 border-purple-400/15 text-purple-300/70 hover:text-white'
                        }`}
                      >
                        <Compass className="w-3.5 h-3.5 mb-1" />
                        <span>432 Hz</span>
                      </button>
                    </div>
                  </div>

                  {/* Floating Card 3: Quick Soundscape Realms */}
                  <div className="p-3.5 rounded-2xl bg-black/30 border border-purple-300/15 backdrop-blur-lg flex items-center justify-between text-xs text-purple-200/80">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-lg overflow-hidden shrink-0 border border-purple-300/30">
                        <img
                          src={ALBUM_DUSK_REVERIE}
                          alt="Dusk Reverie"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-white truncate text-xs">
                          Nocturne Ambient
                        </p>
                        <p className="text-[10px] text-purple-300/60 truncate">
                          Deep sleep & focus waves
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => onOpenArtist(album.artistId)}
                      className="px-3 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 hover:text-white rounded-lg text-[11px] font-medium border border-purple-400/20 transition-colors cursor-pointer shrink-0"
                    >
                      Artist Bio
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom Subtle Bar inside portal framing */}
              <div className="flex items-center justify-between text-[11px] font-mono text-purple-300/60 border-t border-purple-300/10 pt-3 mt-4">
                <div className="flex items-center gap-3">
                  <span>AURALAVANDE ENGINE v2.6</span>
                  <span>·</span>
                  <span>CRYSTAL PORTAL #08</span>
                </div>
                <div className="hidden sm:block">
                  <span>SCROLL TO EXPLORE DISCOGRAPHY ↓</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
