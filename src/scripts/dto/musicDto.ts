export interface Song {
  id: number;
  user_id: number;
  title: string;
  artist: string;
  duration: number;
  url: string;
  source_type: string;
  created_at: string;
}

export interface Playlist {
  id: number;
  user_id: number;
  name: string;
  created_at: string;
}

export interface PlaylistSong {
  playlist_id: number;
  music_id: number;
  music: Song;
}

export interface PlayerState {
  currentTrack: Song | null;
  currentQueue: Song[];
  currentIndex: number;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
}
