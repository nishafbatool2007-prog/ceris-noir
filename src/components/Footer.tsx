import React from 'react';
import { ArrowUp, Sparkles, Heart } from 'lucide-react';

interface FooterProps {
  onScrollToTop: () => void;
  isDarkMode: boolean;
}

export const Footer: React.FC<FooterProps> = ({ onScrollToTop, isDarkMode }) => {
  return (
    <footer className="w-full pb-24 pt-16 border-t border-purple-200/50 dark:border-purple-800/40 bg-white/40 dark:bg-[#12081f]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-10 border-b border-purple-100 dark:border-purple-900/40">
          
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-7 h-7 rounded-lg overflow-hidden flex items-center justify-center p-0.5 bg-purple-950/20 dark:bg-purple-900/40 border border-purple-200/50 dark:border-purple-800/40">
                <img
                  src="/assets/aistudio/image_9fe2811d.png"
                  alt="AuraLavande Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-display font-bold text-xl text-purple-950 dark:text-white">
                AuraLavande
              </span>
            </div>
            <p className="text-xs text-purple-700/80 dark:text-purple-300/80 max-w-sm">
              Ethereal spatial music streaming crafted in shades of purple, lavender, and white.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-purple-800/80 dark:text-purple-300/80">
            <a href="#spotlight" className="hover:text-purple-950 dark:hover:text-white transition-colors">
              Spotlight
            </a>
            <a href="#trending-albums" className="hover:text-purple-950 dark:hover:text-white transition-colors">
              Trending Releases
            </a>
            <a href="#curated-mixes" className="hover:text-purple-950 dark:hover:text-white transition-colors">
              Curated Mixes
            </a>
            <a href="#top-tracks" className="hover:text-purple-950 dark:hover:text-white transition-colors">
              Discography
            </a>
            <a href="#sound-lab" className="hover:text-purple-950 dark:hover:text-white transition-colors">
              Sound Lab
            </a>
          </div>

          <button
            onClick={onScrollToTop}
            aria-label="Back to top"
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-purple-200/60 dark:border-purple-800/50 text-xs font-medium text-purple-800 dark:text-purple-200 hover:bg-purple-100/50 dark:hover:bg-purple-900/40 transition-colors cursor-pointer"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-purple-600/70 dark:text-purple-400/60">
          <div>
            © {new Date().getFullYear()} AuraLavande Music. Engineered with Lenis Smooth Scroll & Web Audio.
          </div>
          <div className="flex items-center gap-1">
            <span>Made with subtle lavender tones and clear acoustic passion</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
