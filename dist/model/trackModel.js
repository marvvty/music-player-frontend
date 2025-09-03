export class TrackModel {
    tracks = [];
    playlists = [];
    baseUrl;
    constructor(baseUrl = "http://localhost:2828") {
        this.baseUrl = baseUrl;
    }
    async fetchAll(limit = 20) {
        const response = await fetch(`${this.baseUrl}/music?limit=${limit}`);
        this.tracks = await response.json();
        return this.tracks;
    }
    async fetchAllPlaylists() {
        const response = await fetch(`${this.baseUrl}/playlist`);
        this.playlists = await response.json();
        return this.playlists;
    }
    async fetchPlaylistTracks(playlistId) {
        const response = await fetch(`${this.baseUrl}/playlist/${playlistId}/music`);
        const playlistTracks = await response.json();
        return playlistTracks.map((pt) => pt.music);
    }
    getFullAudioUrl(url) {
        return url.startsWith("http") ? url : `${this.baseUrl}${url}`;
    }
    get() {
        return [...this.tracks];
    }
    getPlaylists() {
        return [...this.playlists];
    }
    getById(id) {
        return this.tracks.find((track) => track.id === id) || null;
    }
    getPlaylistById(id) {
        return this.playlists.find((playlist) => playlist.id === id) || null;
    }
}
//# sourceMappingURL=trackModel.js.map