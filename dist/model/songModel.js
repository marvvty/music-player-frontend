export class SongModel {
    songs;
    playlists;
    url;
    constructor(url = "http://localhost:2828") {
        this.url = url;
    }
    async allSongs(limit = 20) {
        const res = await fetch(`${this.url}/music?limit=${limit}`);
        this.songs = await res.json();
        return this.songs;
    }
    async allPlaylists() {
        const res = await fetch(`${this.url}/playlist`);
        this.playlists = await res.json();
        return this.playlists;
    }
    async playlistMusic(playlistId) {
        const res = await fetch(`${this.url}/playlist/${playlistId}/music`);
        const playlistSongs = await res.json();
        return playlistSongs.map((playSongs) => playSongs.music);
    }
    getSongUrl(url) {
        return url.startsWith("http") ? url : `${this.url}${url}`;
    }
    get() {
        return [...this.songs];
    }
    getPlaylists() {
        return [...this.playlists];
    }
    getById(id) {
        return this.songs.find((song) => song.id === id) || null;
    }
    getPlaylistById(id) {
        return this.playlists.find((playlist) => playlist.id === id) || null;
    }
}
//# sourceMappingURL=songModel.js.map