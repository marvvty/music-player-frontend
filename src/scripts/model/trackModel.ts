import { Song, Playlist, PlaylistSong } from "../dto/musicDto.js";

export class TrackModel {
  tracks: Song[] = [];
  playlists: Playlist[] = [];
  baseUrl: string;

  constructor(baseUrl: string = "http://localhost:2828") {
    this.baseUrl = baseUrl;
  }

  async fetchAll(limit: number = 20): Promise<Song[]> {
    const response = await fetch(`${this.baseUrl}/music?limit=${limit}`);
    this.tracks = await response.json();

    return this.tracks;
  }

  async fetchAllPlaylists(): Promise<Playlist[]> {
    const response = await fetch(`${this.baseUrl}/playlist`);

    this.playlists = await response.json();
    return this.playlists;
  }

  async fetchPlaylistTracks(playlistId: number): Promise<Song[]> {
    const response = await fetch(
      `${this.baseUrl}/playlist/${playlistId}/music`
    );
    const playlistTracks: PlaylistSong[] = await response.json();

    return playlistTracks.map((pt) => pt.music);
  }

  getFullAudioUrl(url: string): string {
    return url.startsWith("http") ? url : `${this.baseUrl}${url}`;
  }

  get(): Song[] {
    return [...this.tracks];
  }

  getPlaylists(): Playlist[] {
    return [...this.playlists];
  }

  getById(id: number): Song | null {
    return this.tracks.find((track) => track.id === id) || null;
  }

  getPlaylistById(id: number): Playlist | null {
    return this.playlists.find((playlist) => playlist.id === id) || null;
  }
}
