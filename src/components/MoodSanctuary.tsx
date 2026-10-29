import React, { useState, useEffect } from 'react';
import { Sparkles, Moon, Clock, Flame, Compass, Heart, Play, Pause, RefreshCw, Waves, Coffee, Wind, Headphones } from 'lucide-react';
import { Track } from '../types/music';

interface MoodSanctuaryProps {
  tracks: Track[];
  currentTrack: Track;
  isPlaying: boolean;
  onPlayTrack: (track: Track) => void;
  onTogglePlay: () => void;
  isDarkMode: boolean;
}

interface MoodPreset {
  id: string;
  name: string;
  tagline: string;
  gradient: string;
  icon: React.ElementType;
  trackId: string;
  vibeColor: string;
  bpm: string;
}

const MOOD_PRESETS: MoodPreset[] = [
  {
    id: 'lavender-drift',
    name: 'Lavender Drift',
    tagline: 'Deep relaxation & meditative calm',
    gradient: 'from-purple-500/20 via-indigo-500/10 to-lavender-400/20',
    icon: Compass,
    trackId: 'track-1',
    vibeColor: 'bg-purple-500',
    bpm: '64 BPM',
  },
  {
    id: 'midnight-focus',
    name: 'Midnight Focus',
    tagline: 'Deep flow state & cognitive study beats',
    gradient: 'from-blue-600/20 via-purple-600/10 to-slate-800/20',
    icon: Moon,
    trackId: 'track-2',
    vibeColor: 'bg-blue-500',
    bpm: '78 BPM',
  },
  {
    id: 'lofi-sunset',
    name: 'Lo-Fi Sunset',
    tagline: 'Warm golden hour acoustic warmth',
    gradient: 'from-amber-500/20 via-purple-500/10 to-pink-500/20',
    icon: Flame,
    trackId: 'track-3',
    vibeColor: 'bg-amber-500',
    bpm: '82 BPM',
  },
  {
    id: 'ethereal-waves',
    name: 'Ethereal Sanctuary',
    tagline: 'Spacious ambient synth clouds',
    gradient: 'from-teal-500/20 via-purple-500/10 to-indigo-500/20',
    icon: Waves,
    trackId: 'track-4',
    vibeColor: 'bg-teal-500',
    bpm: '70 BPM',
  },
];

export const MoodSanctuary: React.FC<MoodSanctuaryProps> = ({
  tracks,
  currentTrack,
  isPlaying,
  onPlayTrack,
  onTogglePlay,
  isDarkMode,
}) => {
  const [activeMoodId, setActiveMoodId] = useState<string>('lavender-drift');
  const [timerMinutes, setTimerMinutes] = useState<number | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Handle countdown timer
  useEffect(() => {
    if (!isTimerRunning || secondsLeft === null) return;

    if (secondsLeft <= 0) {
      if (isPlaying) {
        onTogglePlay();
      }
      setIsTimerRunning(false);
      setTimerMinutes(null);
      setSecondsLeft(null);
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, secondsLeft, isPlaying, onTogglePlay]);

  const startTimer = (mins: number) => {
    setTimerMinutes(mins);
    setSecondsLeft(mins * 60);
    setIsTimerRunning(true);
  };

  const cancelTimer = () => {
    setIsTimerRunning(false);
    setTimerMinutes(null);
    setSecondsLeft(null);
  };

  const formatTimeLeft = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSelectMood = (mood: MoodPreset) => {
    setActiveMoodId(mood.id);
    const matchedTrack = tracks.find((t) => t.id === mood.trackId) || tracks[0];
    if (matchedTrack) {
      onPlayTrack(matchedTrack);
    }
  };

  return (
    <section id="mood-sanctuary" className="py-16 max-w-7xl mx-auto px-6">
      <div className="rounded-3xl p-8 sm:p-12 border border-purple-200/60 dark:border-purple-800/40 bg-gradient-to-br from-white/95 via-purple-50/40 to-lavender-100/30 dark:from-[#130924]/95 dark:via-[#1a0e33]/90 dark:to-purple-950/40 backdrop-blur-2xl shadow-xl shadow-purple-500/5">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sanctuary & Sleep Engine</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-purple-950 dark:text-white">
              Mood Oasis & Focus Timer
            </h2>
            <p className="text-sm sm:text-base text-purple-900/80 dark:text-purple-200/80 mt-1 max-w-2xl">
              Curate your sonic atmosphere for deep focus, creative flow, or effortless sleep. Select a mood vibe or set a sleep countdown.
            </p>
          </div>

          {/* Sleep Timer Widget */}
          <div className="rounded-2xl p-4 bg-white/80 dark:bg-purple-900/40 border border-purple-200/80 dark:border-purple-700/60 shadow-sm flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-800/60 text-purple-700 dark:text-purple-200">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-300">
                Sleep Timer
              </div>
              <div className="text-sm font-medium text-purple-950 dark:text-white">
                {isTimerRunning && secondsLeft !== null ? (
                  <span className="font-mono text-purple-600 dark:text-purple-300 font-bold">
                    Fading out in {formatTimeLeft(secondsLeft)}
                  </span>
                ) : (
                  <span>Set automatic pause</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1.5 ml-auto">
              {isTimerRunning ? (
                <button
                  onClick={cancelTimer}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              ) : (
                <>
                  {[15, 30, 45, 60].map((mins) => (
                    <button
                      key={mins}
                      onClick={() => startTimer(mins)}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-purple-100 dark:bg-purple-800/80 hover:bg-purple-600 hover:text-white text-purple-800 dark:text-purple-200 transition-all cursor-pointer"
                    >
                      {mins}m
                    </button>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mood Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOOD_PRESETS.map((mood) => {
            const Icon = mood.icon;
            const isSelected = activeMoodId === mood.id;
            const isCurrentPlaying = isSelected && isPlaying;

            return (
              <div
                key={mood.id}
                onClick={() => handleSelectMood(mood)}
                className={`group relative rounded-2xl p-6 transition-all duration-300 cursor-pointer overflow-hidden border ${
                  isSelected
                    ? 'border-purple-500 dark:border-purple-400 bg-white dark:bg-purple-900/60 shadow-lg shadow-purple-500/10 scale-[1.02]'
                    : 'border-purple-200/70 dark:border-purple-800/50 bg-white/60 dark:bg-purple-950/40 hover:bg-white dark:hover:bg-purple-900/40 hover:border-purple-300 dark:hover:border-purple-700'
                }`}
              >
                {/* Background Ambient Glow */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${mood.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                />

                <div className="relative z-10 flex flex-col h-full justify-between space-y-6">
                  <div className="flex items-center justify-between">
                    <div
                      className={`p-3 rounded-xl ${
                        isSelected
                          ? 'bg-purple-600 text-white shadow-md'
                          : 'bg-purple-100 dark:bg-purple-800/60 text-purple-700 dark:text-purple-200 group-hover:bg-purple-600 group-hover:text-white'
                      } transition-colors`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-purple-600 dark:text-purple-300 px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-900/60 border border-purple-200/50 dark:border-purple-700/50">
                        {mood.bpm}
                      </span>
                      <div className={`w-2 h-2 rounded-full ${mood.vibeColor}`} />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-lg text-purple-950 dark:text-white group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors">
                      {mood.name}
                    </h3>
                    <p className="text-xs text-purple-800/80 dark:text-purple-300/80 mt-1 leading-relaxed">
                      {mood.tagline}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-purple-100 dark:border-purple-800/50">
                    <span className="text-xs font-semibold text-purple-700 dark:text-purple-300 flex items-center gap-1">
                      <Headphones className="w-3.5 h-3.5" />
                      <span>{isSelected ? 'Active Vibe' : 'Select Atmosphere'}</span>
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isSelected) {
                          onTogglePlay();
                        } else {
                          handleSelectMood(mood);
                        }
                      }}
                      className="p-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow-sm transition-transform active:scale-95 cursor-pointer"
                      aria-label={`Play or pause ${mood.name}`}
                    >
                      {isCurrentPlaying ? (
                        <Pause className="w-4 h-4 fill-current" />
                      ) : (
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
