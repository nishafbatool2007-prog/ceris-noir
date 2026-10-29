import React from 'react';
import {
  Sparkles,
  Moon,
  Sun,
  Library,
  Waves,
  FileText,
  SlidersHorizontal,
  ListMusic,
} from 'lucide-react';

interface NavbarProps {
  onNavClick: (sectionId: string) => void;
  onOpenLibrary: () => void;
  onOpenVisualizer: () => void;
  onOpenLyrics: () => void;
  onOpenEqualizer: () => void;
  onOpenQueue: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  savedTracksCount: number;
  queueCount: number;
  isPlaying: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNavClick,
  onOpenLibrary,
  onOpenVisualizer,
  onOpenLyrics,
  onOpenEqualizer,
  onOpenQueue,
  isDarkMode,
  onToggleTheme,
  savedTracksCount,
  queueCount,
  isPlaying,
}) => {
  const [isVisible, setIsVisible] = React.useState(true);
  const lastScrollY = React.useRef(0);

  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 80 && currentScrollY > lastScrollY.current) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-transform duration-300 backdrop-blur-2xl bg-white/85 dark:bg-[#11071f]/90 border-b border-purple-200/50 dark:border-purple-900/40 shadow-[0_4px_25px_-5px_rgba(107,33,168,0.07)] ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
        
        {/* Brand Wordmark Zone */}
        <button
          onClick={() => onNavClick('#spotlight')}
          className="text-left font-display text-2xl font-bold tracking-tight text-purple-950 dark:text-purple-100 flex items-center gap-3 group whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity cursor-pointer"
        >
          <div className="relative w-9 h-9 rounded-xl flex items-center justify-center p-0.5 bg-gradient-to-tr from-purple-950 via-purple-900 to-indigo-950 dark:from-purple-900/60 dark:to-indigo-900/60 shadow-md shadow-purple-600/20 border border-purple-300/30 dark:border-purple-700/40 group-hover:scale-105 transition-transform">
            <img
              src="/assets/aistudio/image_9fe2811d.png"
              alt="AuraLavande Logo"
              className="w-full h-full object-contain filter drop-shadow-[0_2px_4px_rgba(147,51,234,0.3)]"
            />
          </div>
          <span className="font-arizonia text-3xl font-normal tracking-wide bg-gradient-to-r from-purple-950 via-purple-800 to-purple-900 dark:from-white dark:via-purple-200 dark:to-purple-300 bg-clip-text text-transparent">
            AuraLavande
          </span>
        </button>

        {/* Navigation Section Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-purple-900/70 dark:text-purple-200/70">
          <button
            onClick={() => onNavClick('#spotlight')}
            className="hover:text-purple-950 dark:hover:text-white transition-colors whitespace-nowrap cursor-pointer"
          >
            Spotlight
          </button>
          <button
            onClick={() => onNavClick('#trending-albums')}
            className="hover:text-purple-950 dark:hover:text-white transition-colors whitespace-nowrap cursor-pointer"
          >
            Releases
          </button>
          <button
            onClick={() => onNavClick('#curated-mixes')}
            className="hover:text-purple-950 dark:hover:text-white transition-colors whitespace-nowrap cursor-pointer"
          >
            Mixes
          </button>
          <button
            onClick={() => onNavClick('#top-tracks')}
            className="hover:text-purple-950 dark:hover:text-white transition-colors whitespace-nowrap cursor-pointer"
          >
            Discography
          </button>
          <button
            onClick={() => onNavClick('#sound-lab')}
            className="hover:text-purple-950 dark:hover:text-white transition-colors whitespace-nowrap cursor-pointer"
          >
            Sound Lab
          </button>
        </nav>

        {/* Integrated Quick Tool Island (Replacing Dock) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Spatial Visualizer */}
          <button
            onClick={onOpenVisualizer}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              isPlaying
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                : 'bg-purple-100/70 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200 hover:bg-purple-200/80 dark:hover:bg-purple-800/60'
            }`}
            title="Spatial Audio Visualizer"
          >
            <Waves className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Visualizer</span>
          </button>

          {/* Synced Lyrics */}
          <button
            onClick={onOpenLyrics}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-purple-100/70 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200 hover:bg-purple-200/80 dark:hover:bg-purple-800/60 transition-colors cursor-pointer"
            title="Karaoke Synced Lyrics"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Lyrics</span>
          </button>

          {/* Equalizer / Sound Lab */}
          <button
            onClick={onOpenEqualizer}
            className="p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-medium bg-purple-100/70 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200 hover:bg-purple-200/80 dark:hover:bg-purple-800/60 transition-colors cursor-pointer flex items-center gap-1.5"
            title="Spatial EQ & Ambient Layers"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">EQ & Ambience</span>
          </button>

          {/* Queue Drawer */}
          <button
            onClick={onOpenQueue}
            className="relative p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-medium bg-purple-100/70 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200 hover:bg-purple-200/80 dark:hover:bg-purple-800/60 transition-colors cursor-pointer flex items-center gap-1.5"
            title="Playback Queue"
          >
            <ListMusic className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Queue</span>
            {queueCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] font-mono bg-purple-600 text-white rounded-full tabular-nums">
                {queueCount}
              </span>
            )}
          </button>

          {/* Saved Library CTA */}
          <button
            onClick={onOpenLibrary}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-800 hover:to-indigo-700 rounded-xl shadow-md shadow-purple-600/20 active:scale-95 transition-all whitespace-nowrap cursor-pointer"
          >
            <Library className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Library</span>
            {savedTracksCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] bg-white/25 rounded-full font-mono tabular-nums">
                {savedTracksCount}
              </span>
            )}
          </button>

          {/* Theme Mode Toggle */}
          <button
            onClick={onToggleTheme}
            aria-label="Toggle visual theme"
            className="p-2 rounded-xl border border-purple-200/60 dark:border-purple-800/50 text-purple-700 dark:text-purple-300 hover:bg-purple-100/50 dark:hover:bg-purple-900/40 transition-colors cursor-pointer"
            title={isDarkMode ? 'Switch to Lavender Mist (Daylight)' : 'Switch to Violet Dusk (Night)'}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-purple-700" />}
          </button>

        </div>

      </div>
    </header>
  );
};
