import { Song, Playlist, PlayerState } from "../dto/musicDto";
import { TrackModel } from "../model/trackModel.js";
import { PlayerModel } from "../model/playerModel.js";
import { TracksView } from "../view/trackView.js";
import { PlaylistsView } from "../view/playlistView.js";
import { QueueView } from "../view/queueView.js";
import { PlayerControlsView } from "../view/controlsView.js";
import { MainView } from "../view/mainView.js";

export class MusicPlayerController {
  trackModel: TrackModel;
  playerModel: PlayerModel;

  tracksView: TracksView;
  playlistsView: PlaylistsView;
  queueView: QueueView;
  playerControlsView: PlayerControlsView;
  mainView: MainView;

  currentViewContext: "all-tracks" | "playlist" = "all-tracks";
  currentPlaylistId?: number;

  constructor() {
    this.initializeModels();
    this.initializeViews();
    this.setupModelObservers();
    this.loadInitialData();
  }

  initializeModels(): void {
    this.trackModel = new TrackModel();
    this.playerModel = new PlayerModel();
  }

  initializeViews(): void {
    const tracksGrid = document.getElementById("tracks-grid") as HTMLElement;
    const playlistsList = document.getElementById(
      "playlists-list"
    ) as HTMLElement;
    const currentQueue = document.getElementById(
      "current-queue"
    ) as HTMLElement;

    this.tracksView = new TracksView(tracksGrid, (track) =>
      this.handleSongPlay(track)
    );

    this.playlistsView = new PlaylistsView(playlistsList, (playlist) =>
      this.handlePlaylistSelect(playlist)
    );

    this.queueView = new QueueView(currentQueue, (index) =>
      this.handleQueueTrackSelect(index)
    );

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

  setupModelObservers(): void {
    this.playerModel.subscribe((state: PlayerState) =>
      this.handlePlayerStateChange(state)
    );
  }

  async loadInitialData(): Promise<void> {
    try {
      await Promise.all([this.loadAllTracks(), this.loadPlaylists()]);
    } catch (error) {
      console.error("Failed to load initial data:", error);
    }
  }

  async loadAllTracks(): Promise<void> {
    try {
      this.tracksView.showLoading("Loading tracks...");
      const tracks = await this.trackModel.fetchAll(5);

      this.mainView.setTitle("All Tracks");
      this.tracksView.render(tracks);
      this.playerModel.setQueue(tracks);
      this.updateQueueView();
      this.currentViewContext = "all-tracks";
    } catch (error) {
      this.tracksView.showError("Failed to load tracks");
      console.error("Failed to load tracks:", error);
    }
  }

  async loadPlaylists(): Promise<void> {
    try {
      this.playlistsView.showLoading();
      const playlists = await this.trackModel.fetchAllPlaylists();
      this.playlistsView.render(playlists);
    } catch (error) {
      this.playlistsView.showError("Failed to load playlists");
      console.error("Failed to load playlists:", error);
    }
  }

  async loadPlaylistTracks(playlist: Playlist): Promise<void> {
    try {
      this.tracksView.showLoading("Loading playlist tracks...");
      const tracks = await this.trackModel.fetchPlaylistTracks(playlist.id);

      this.mainView.setTitle(playlist.name);

      this.tracksView.render(tracks);
      this.playerModel.setQueue(tracks);
      this.updateQueueView();

      this.currentViewContext = "playlist";
      this.currentPlaylistId = playlist.id;
    } catch (error) {
      this.tracksView.showError("Failed to load playlist tracks");
      console.error("Failed to load playlist tracks:", error);
    }
  }

  async handleSongPlay(track: Song): Promise<void> {
    try {
      const state = this.playerModel.getState();
      const trackIndex = state.currentQueue.findIndex((t) => t.id === track.id);

      if (trackIndex >= 0) {
        this.playerModel.setCurrentIndex(trackIndex);
      }

      const audioUrl = this.trackModel.getFullAudioUrl(track.url);
      await this.playerModel.loadTrack(track, audioUrl);
      await this.playerModel.play();
    } catch (error) {
      console.error("Failed to play track:", error);
    }
  }

  async handlePlaylistSelect(playlist: Playlist): Promise<void> {
    await this.loadPlaylistTracks(playlist);
  }

  async handleQueueTrackSelect(index: number): Promise<void> {
    const state = this.playerModel.getState();
    const track = state.currentQueue[index];

    if (track) {
      this.playerModel.setCurrentIndex(index);

      try {
        const audioUrl = this.trackModel.getFullAudioUrl(track.url);
        await this.playerModel.loadTrack(track, audioUrl);
        await this.playerModel.play();
      } catch (error) {
        console.error("Failed to load selected track:", error);
      }
    }
  }

  async handleTogglePlay(): Promise<void> {
    const state = this.playerModel.getState();

    if (!state.currentTrack && state.currentQueue.length > 0) {
      await this.playCurrentQueueTrack();
      return;
    }

    if (state.currentTrack) {
      this.playerModel.togglePlay();
    }
  }

  async handlePrevious(): Promise<void> {
    this.playerModel.previousTrack();
    await this.playCurrentQueueTrack();
  }

  async handleNext(): Promise<void> {
    this.playerModel.nextTrack();
    await this.playCurrentQueueTrack();
  }

  handleSeek(time: number): void {
    this.playerModel.seek(time);
  }

  handleVolumeChange(volume: number): void {
    this.playerModel.setVolume(volume);
  }

  handleAllTracksClick(): void {
    if (this.currentViewContext !== "all-tracks") {
      this.loadAllTracks();
    }
  }

  async handlePlayerStateChange(state: PlayerState): Promise<void> {
    this.playerControlsView.updateState(state);
    this.updateQueueView();

    if (state.currentTime === 0 && state.duration > 0 && !state.isPlaying) {
      const currentTrack = state.currentQueue[state.currentIndex];
      if (currentTrack && !state.currentTrack) {
        await this.playCurrentQueueTrack();
      }
    }
  }

  async playCurrentQueueTrack(): Promise<void> {
    const state = this.playerModel.getState();
    const track = state.currentQueue[state.currentIndex];

    if (track) {
      try {
        const audioUrl = this.trackModel.getFullAudioUrl(track.url);
        await this.playerModel.loadTrack(track, audioUrl);
        const currentState = this.playerModel.getState();
        if (!currentState.isPlaying) {
          await this.playerModel.play();
        }
      } catch (error) {
        console.error("Failed to play queue track:", error);
      }
    }
  }

  updateQueueView(): void {
    const state = this.playerModel.getState();
    const currentTrackId = state.currentTrack?.id;
    this.queueView.render(state.currentQueue, currentTrackId);
  }
}
