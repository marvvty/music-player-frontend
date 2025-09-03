import { SongModel } from "../model/songModel.js";
import { playerModel } from "../model/player.js";
import { SongView } from "../view/track.js";
import { PlaylistView } from "../view/playlist.js";
import { QueueView } from "../view/queue.js";
import { PlayerControlsView } from "../view/player.js";
import { MainView } from "../view/main.js";
export class MusicPlayerController {
    songModel;
    playerModel;
    songsView;
    playlistsView;
    queueView;
    playerControlsView;
    mainView;
    currentViewContext = "all-tracks";
    currentPlaylistId;
    constructor() {
        this.initializeModels();
        this.initializeViews();
        this.setupModelObservers();
        this.loadInitialData();
    }
    initializeModels() {
        this.songModel = new SongModel();
        this.playerModel = new playerModel();
    }
    initializeViews() {
        const tracksGrid = document.getElementById("tracks-grid");
        const playlistsList = document.getElementById("playlists-list");
        const currentQueue = document.getElementById("current-queue");
        this.songsView = new SongView(tracksGrid, (song) => this.handleTrackPlay(song));
        this.playlistsView = new PlaylistView(playlistsList, (playlist) => this.handlePlaylistSelect(playlist));
        this.queueView = new QueueView(currentQueue, (index) => this.handleQueueTrackSelect(index));
        this.playerControlsView = new PlayerControlsView({
            onTogglePlay: () => this.handleTogglePlay(),
            onPrevious: () => this.handlePrevious(),
            onNext: () => this.handleNext(),
            onSeek: (time) => this.handleSeek(time),
            onVolumeChange: (volume) => this.handleVolumeChange(volume),
        });
        this.mainView = new MainView();
        this.mainView.onAllTracksClick(() => this.handleAllTracksClick());
    }
    setupModelObservers() {
        this.playerModel.subscribe((state) => this.handlePlayerStateChange(state));
    }
    async loadInitialData() {
        try {
            await Promise.all([this.loadAllTracks(), this.loadPlaylists()]);
        }
        catch (error) {
            console.error("Failed to load initial data:", error);
        }
    }
    async loadAllTracks() {
        try {
            this.songsView.showLoading("Loading Songs");
            const songs = await this.songModel.allSongs(10);
            this.mainView.setTitle("All Songs");
            this.songsView.render(songs);
            this.playerModel.setQueue(songs);
            this.updateQueueView();
            this.currentViewContext = "all-tracks";
        }
        catch (error) {
            this.songsView.showError("Failed to load tracks");
            console.error("Failed to load tracks:", error);
        }
    }
    async loadPlaylists() {
        try {
            this.playlistsView.showLoading();
            const playlists = await this.songModel.allPlaylists();
            this.playlistsView.render(playlists);
        }
        catch (error) {
            this.playlistsView.showError("Failed to load playlists");
            console.error("Failed to load playlists:", error);
        }
    }
    async loadPlaylistTracks(playlist) {
        try {
            this.songsView.showLoading("Loading playlist songs...");
            const tracks = await this.songModel.playlistMusic(playlist.id);
            this.mainView.setTitle(playlist.name);
            this.songsView.render(tracks);
            this.playerModel.setQueue(tracks);
            this.updateQueueView();
            this.currentViewContext = "playlist";
            this.currentPlaylistId = playlist.id;
        }
        catch (error) {
            this.songsView.showError("Failed to load playlist tracks");
            console.error("Failed to load playlist tracks:", error);
        }
    }
    async handleTrackPlay(song) {
        try {
            const audioUrl = this.songModel.getSongUrl(song.url);
            await this.playerModel.loadSong(song, audioUrl);
            await this.playerModel.play();
            const state = this.playerModel.getState();
            const trackIndex = state.currentQueue.findIndex((t) => t.id === song.id);
            if (trackIndex >= 0) {
                this.playerModel.setIndex(trackIndex);
            }
        }
        catch (error) {
            console.error("Failed to play song:", error);
        }
    }
    async handlePlaylistSelect(playlist) {
        await this.loadPlaylistTracks(playlist);
    }
    handleQueueTrackSelect(index) {
        const state = this.playerModel.getState();
        const song = state.currentQueue[index];
        if (song) {
            this.playerModel.setIndex(index);
            this.handleTrackPlay(song);
        }
    }
    handleTogglePlay() {
        this.playerModel.togglePlay();
    }
    async handlePrevious() {
        this.playerModel.previousMusic();
        await this.playCurrentQueueTrack();
    }
    async handleNext() {
        this.playerModel.nextMusic();
        await this.playCurrentQueueTrack();
    }
    handleSeek(time) {
        this.playerModel.seek(time);
    }
    handleVolumeChange(volume) {
        this.playerModel.setVolume(volume);
    }
    handleAllTracksClick() {
        if (this.currentViewContext !== "all-tracks") {
            this.loadAllTracks();
        }
    }
    async handlePlayerStateChange(state) {
        this.playerControlsView.updateState(state);
        this.updateQueueView();
        const currentTrack = this.playerModel.getCurrent();
        const queueTrack = state.currentQueue[state.currentIndex];
        if (queueTrack && (!currentTrack || currentTrack.id !== queueTrack.id)) {
            await this.playCurrentQueueTrack();
        }
    }
    async playCurrentQueueTrack() {
        const state = this.playerModel.getState();
        const song = state.currentQueue[state.currentIndex];
        if (song) {
            try {
                const audioUrl = this.songModel.getSongUrl(song.url);
                await this.playerModel.loadSong(song, audioUrl);
                if (state.isPlaying) {
                    await this.playerModel.play();
                }
            }
            catch (error) {
                console.error("Failed to play queue song:", error);
            }
        }
    }
    updateQueueView() {
        const state = this.playerModel.getState();
        const currentTrackId = state.currentSong?.id;
        this.queueView.render(state.currentQueue, currentTrackId);
    }
}
//# sourceMappingURL=player.js.map