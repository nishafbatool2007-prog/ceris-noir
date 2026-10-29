import React, { useState } from 'react';
import { X, Link2, Music2, Check, Upload, Sparkles } from 'lucide-react';
import { Track } from '../types/music';

interface AudioLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  track: Track | null;
  onUpdateAudioUrl: (trackId: string, url: string) => void;
  isDarkMode: boolean;
}

export const AudioLinkModal: React.FC<AudioLinkModalProps> = ({
  isOpen,
  onClose,
  track,
  onUpdateAudioUrl,
  isDarkMode,
}) => {
  if (!isOpen || !track) return null;

  const [inputUrl, setInputUrl] = useState(track.audioUrl || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUrl.trim()) {
      onUpdateAudioUrl(track.id, inputUrl.trim());
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        onClose();
      }, 1000);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      onUpdateAudioUrl(track.id, objectUrl);
      setInputUrl(objectUrl);
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        onClose();
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/60 backdrop-blur-md transition-opacity">
      <div
        className={`relative w-full max-w-lg rounded-3xl p-6 shadow-2xl border transition-all ${
          isDarkMode
            ? 'bg-[#180e2d] border-purple-800/60 text-purple-100'
            : 'bg-white border-purple-200/80 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-purple-100 dark:border-purple-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
              <Link2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Custom Audio Source Stream</h3>
              <p className="text-xs text-purple-600 dark:text-purple-300">
                {track.artist} — {track.title}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-purple-400 hover:text-purple-700 dark:hover:text-purple-200 rounded-full hover:bg-purple-100/50 dark:hover:bg-purple-900/40 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-purple-700 dark:text-purple-300 mb-1.5">
              Paste Direct MP3 / Audio Stream URL
            </label>
            <div className="relative flex items-center">
              <input
                type="url"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="https://example.com/karan-aujla-for-a-reason.mp3"
                className={`w-full px-4 py-3 rounded-xl text-xs font-mono border transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  isDarkMode
                    ? 'bg-purple-950/50 border-purple-800/60 text-purple-100 placeholder-purple-500'
                    : 'bg-purple-50/60 border-purple-200 text-slate-800 placeholder-purple-400'
                }`}
              />
            </div>
            <p className="mt-1.5 text-[11px] text-purple-500 dark:text-purple-400">
              Paste any direct audio stream link or YouTube/MP3 CDN URL to play for this song.
            </p>
          </div>

          {/* Or Upload Audio File */}
          <div className="relative flex items-center justify-center p-4 border-2 border-dashed border-purple-200 dark:border-purple-800/60 rounded-2xl hover:bg-purple-50/50 dark:hover:bg-purple-900/20 transition-all cursor-pointer">
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex items-center gap-2 text-xs font-medium text-purple-700 dark:text-purple-300">
              <Upload className="w-4 h-4 text-purple-500" />
              <span>Or click here to upload a local audio file (.mp3, .m4a, .wav)</span>
            </div>
          </div>

          {/* Preset options */}
          <div className="pt-2">
            <span className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider block mb-2">
              Preset Audio Streams
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setInputUrl('https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3')}
                className="px-3 py-1.5 text-xs bg-purple-100 dark:bg-purple-900/50 hover:bg-purple-200 dark:hover:bg-purple-800 text-purple-900 dark:text-purple-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3 h-3 text-purple-500" />
                High-Energy Urban Beats Stream
              </button>
              <button
                type="button"
                onClick={() => setInputUrl('https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8230303.mp3')}
                className="px-3 py-1.5 text-xs bg-purple-100 dark:bg-purple-900/50 hover:bg-purple-200 dark:hover:bg-purple-800 text-purple-900 dark:text-purple-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Music2 className="w-3 h-3 text-indigo-500" />
                Heavy Bass Hip-Hop Stream
              </button>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-purple-100 dark:border-purple-800/40">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-purple-700 dark:text-purple-300 hover:text-purple-950 dark:hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-md shadow-purple-600/25 transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  Saved Stream Link!
                </>
              ) : (
                'Save & Play Song'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
