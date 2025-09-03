import { TrackModel } from "../model/trackModel.js";
import { PlayerModel } from "../model/playerModel.js";
import { TracksView } from "../view/trackView.js";
import { PlaylistsView } from "../view/playlistView.js";
import { QueueView } from "../view/queueView.js";
import { PlayerControlsView } from "../view/controlsView.js";
import { MainView } from "../view/mainView.js";
export class MusicPlayerController {
    trackModel;
    playerModel;
    tracksView;
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
        this.trackModel = new TrackModel();
        this.playerModel = new PlayerModel();
    }
    initializeViews() {
        const tracksGrid = document.getElementById("tracks-grid");
        const playlistsList = document.getElementById("playlists-list");
        const currentQueue = document.getElementById("current-queue");
        this.tracksView = new TracksView(tracksGrid, (track) => this.handleSongPlay(track));
        this.playlistsView = new PlaylistsView(playlistsList, (playlist) => this.handlePlaylistSelect(playlist));
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
            this.tracksView.showLoading("Loading tracks...");
            const tracks = await this.trackModel.fetchAll(5);
            this.mainView.setTitle("All Tracks");
            this.tracksView.render(tracks);
            this.playerModel.setQueue(tracks);
            this.updateQueueView();
            this.currentViewContext = "all-tracks";
        }
        catch (error) {
            this.tracksView.showError("Failed to load tracks");
            console.error("Failed to load tracks:", error);
        }
    }
    async loadPlaylists() {
        try {
            this.playlistsView.showLoading();
            const playlists = await this.trackModel.fetchAllPlaylists();
            this.playlistsView.render(playlists);
        }
        catch (error) {
            this.playlistsView.showError("Failed to load playlists");
            console.error("Failed to load playlists:", error);
        }
    }
    async loadPlaylistTracks(playlist) {
        try {
            this.tracksView.showLoading("Loading playlist tracks...");
            const tracks = await this.trackModel.fetchPlaylistTracks(playlist.id);
            this.mainView.setTitle(playlist.name);
            this.tracksView.render(tracks);
            this.playerModel.setQueue(tracks);
            this.updateQueueView();
            this.currentViewContext = "playlist";
            this.currentPlaylistId = playlist.id;
        }
        catch (error) {
            this.tracksView.showError("Failed to load playlist tracks");
            console.error("Failed to load playlist tracks:", error);
        }
    }
    async handleSongPlay(track) {
        try {
            const audioUrl = this.trackModel.getFullAudioUrl(track.url);
            await this.playerModel.loadTrack(track, audioUrl);
            await this.playerModel.play();
            const state = this.playerModel.getState();
            const trackIndex = state.currentQueue.findIndex((t) => t.id === track.id);
            if (trackIndex >= 0) {
                this.playerModel.setCurrentIndex(trackIndex);
            }
        }
        catch (error) {
            console.error("Failed to play track:", error);
        }
    }
    async handlePlaylistSelect(playlist) {
        await this.loadPlaylistTracks(playlist);
    }
    handleQueueTrackSelect(index) {
        const state = this.playerModel.getState();
        const track = state.currentQueue[index];
        if (track) {
            this.playerModel.setCurrentIndex(index);
            this.handleSongPlay(track);
        }
    }
    handleTogglePlay() {
        this.playerModel.togglePlay();
    }
    async handlePrevious() {
        this.playerModel.previousTrack();
        await this.playCurrentQueueTrack();
    }
    async handleNext() {
        this.playerModel.nextTrack();
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
        const currentTrack = this.playerModel.getCurrentTrack();
        const queueTrack = state.currentQueue[state.currentIndex];
        if (queueTrack && (!currentTrack || currentTrack.id !== queueTrack.id)) {
            await this.playCurrentQueueTrack();
        }
    }
    async playCurrentQueueTrack() {
        const state = this.playerModel.getState();
        const track = state.currentQueue[state.currentIndex];
        if (track) {
            try {
                const audioUrl = this.trackModel.getFullAudioUrl(track.url);
                await this.playerModel.loadTrack(track, audioUrl);
                if (state.isPlaying) {
                    await this.playerModel.play();
                }
            }
            catch (error) {
                console.error("Failed to play queue track:", error);
            }
        }
    }
    updateQueueView() {
        const state = this.playerModel.getState();
        const currentTrackId = state.currentTrack?.id;
        this.queueView.render(state.currentQueue, currentTrackId);
    }
}
//# sourceMappingURL=musicPlayer.js.map