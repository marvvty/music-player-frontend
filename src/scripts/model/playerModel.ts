import { Song, PlayerState } from "../dto/musicDto.js";

export class PlayerModel {
  private state: PlayerState;
  private audio: HTMLAudioElement;
  private observers: ((state: PlayerState) => void)[] = [];
  private isLoadingTrack: boolean = false;

  constructor() {
    this.audio = new Audio();
    this.state = {
      currentTrack: null,
      currentQueue: [],
      currentIndex: 0,
      isPlaying: false,
      volume: 0.5,
      currentTime: 0,
      duration: 0,
    };

    this.setupAudioEventListeners();
    this.audio.volume = this.state.volume;
  }

  private setupAudioEventListeners(): void {
    this.audio.addEventListener("loadedmetadata", () => {
      this.state.duration = this.audio.duration;
      this.notify();
    });

    this.audio.addEventListener("timeupdate", () => {
      this.state.currentTime = this.audio.currentTime;
      this.notify();
    });

    this.audio.addEventListener("ended", () => {
      this.state.isPlaying = false;
      this.nextTrack();
      this.notify();
    });

    this.audio.addEventListener("play", () => {
      this.state.isPlaying = true;
      this.notify();
    });

    this.audio.addEventListener("pause", () => {
      this.state.isPlaying = false;
      this.notify();
    });

    this.audio.addEventListener("error", (e) => {
      console.error("Audio error:", e);
      this.state.isPlaying = false;
      this.isLoadingTrack = false;
      this.notify();
    });

    this.audio.addEventListener("canplaythrough", () => {
      this.isLoadingTrack = false;
    });
  }

  subscribe(observer: (state: PlayerState) => void): void {
    this.observers.push(observer);
  }

  unsubscribe(observer: (state: PlayerState) => void): void {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }

  private notify(): void {
    this.observers.forEach((observer) => observer({ ...this.state }));
  }

  async loadTrack(track: Song, audioUrl: string): Promise<void> {
    if (this.isLoadingTrack) {
      return;
    }

    this.isLoadingTrack = true;
    const wasPlaying = this.state.isPlaying;

    this.audio.pause();
    this.state.isPlaying = false;
    this.state.currentTrack = track;
    this.notify();

    this.audio.src = audioUrl;

    return new Promise((resolve, reject) => {
      const onCanPlay = () => {
        this.audio.removeEventListener("canplaythrough", onCanPlay);
        this.audio.removeEventListener("error", onError);
        this.isLoadingTrack = false;
        this.notify();
        resolve();
      };

      const onError = (e: Event) => {
        this.audio.removeEventListener("canplaythrough", onCanPlay);
        this.audio.removeEventListener("error", onError);
        this.isLoadingTrack = false;
        this.state.currentTrack = null;
        this.notify();
        reject(e);
      };

      this.audio.addEventListener("canplaythrough", onCanPlay, { once: true });
      this.audio.addEventListener("error", onError, { once: true });

      this.audio.load();
    });
  }

  async play(): Promise<void> {
    if (this.isLoadingTrack) {
      console.warn("Cannot play while loading track");
      return;
    }

    if (!this.audio.src) {
      console.warn("No audio source loaded");
      return;
    }

    try {
      await this.audio.play();
    } catch (error) {
      console.error("Play failed:", error);
      this.state.isPlaying = false;
      this.notify();
    }
  }

  pause(): void {
    this.audio.pause();
  }

  togglePlay(): void {
    if (!this.state.currentTrack && this.state.currentQueue.length > 0) {
      return;
    }

    if (this.state.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  setVolume(volume: number): void {
    this.state.volume = Math.max(0, Math.min(1, volume));
    this.audio.volume = this.state.volume;
    this.notify();
  }

  seek(time: number): void {
    if (this.audio.duration) {
      this.audio.currentTime = Math.max(0, Math.min(this.audio.duration, time));
    }
  }

  setQueue(tracks: Song[], startIndex: number = 0): void {
    this.state.currentQueue = [...tracks];
    this.state.currentIndex = Math.max(
      0,
      Math.min(tracks.length - 1, startIndex)
    );
    this.notify();
  }

  nextTrack(): void {
    const len = this.state.currentQueue.length;
    if (len === 0) return;

    this.state.currentIndex = (this.state.currentIndex + 1) % len;
    this.notify();
  }

  previousTrack(): void {
    const len = this.state.currentQueue.length;
    if (len === 0) return;

    this.state.currentIndex = (this.state.currentIndex - 1 + len) % len;
    this.notify();
  }

  setCurrentIndex(index: number): void {
    if (index >= 0 && index < this.state.currentQueue.length) {
      this.state.currentIndex = index;
      this.notify();
    }
  }

  getState(): PlayerState {
    return { ...this.state };
  }

  getCurrentTrack(): Song | null {
    return this.state.currentTrack;
  }

  getQueueTrack(index: number): Song | null {
    return this.state.currentQueue[index] || null;
  }
}
