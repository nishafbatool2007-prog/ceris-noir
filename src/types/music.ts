export interface LyricLine {
  time: number; // in seconds
  text: string;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  album: string;
  albumId: string;
  duration: number; // in seconds
  coverUrl: string;
  audioUrl?: string; // fallback or sample URL
  genre: string;
  bpm: number;
  musicalKey: string;
  lyrics: LyricLine[];
  mood: string;
  plays: number;
  releaseYear: number;
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  coverUrl: string;
  releaseYear: number;
  genre: string;
  tracksCount: number;
  duration: string;
  description: string;
  featured?: boolean;
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  tracks: string[]; // track ids
  curator: string;
  moodTag: string;
}

export interface Artist {
  id: string;
  name: string;
  genre: string;
  monthlyListeners: string;
  bio: string;
  avatarUrl: string;
  coverBannerUrl: string;
  topTracks: string[];
}

export interface EqualizerSettings {
  bass: number; // -10 to +10 dB
  mid: number;  // -10 to +10 dB
  treble: number; // -10 to +10 dB
  reverb: number; // 0 to 100%
  vinylNoise: number; // 0 to 100%
  rainSound: number; // 0 to 100%
}
