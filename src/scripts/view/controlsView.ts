import { PlayerState } from "../dto/musicDto";
import { View } from "./abstract/abstractView.js";

export class PlayerControlsView {
  elements: {
    playBtn: HTMLButtonElement;
    prevBtn: HTMLButtonElement;
    nextBtn: HTMLButtonElement;
    playIcon: SVGElement | null;
    pauseIcon: SVGElement | null;
    progressBar: HTMLInputElement;
    volumeBar: HTMLInputElement;
    currentTimeEl: HTMLElement;
    durationEl: HTMLElement;
    trackNameEl: HTMLElement;
    trackArtistEl: HTMLElement;
  };

  callbacks: {
    onTogglePlay: () => void;
    onPrevious: () => void;
    onNext: () => void;
    onSeek: (time: number) => void;
    onVolumeChange: (volume: number) => void;
  };

  isSeekingByUser = false;

  constructor(callbacks: {
    onTogglePlay: () => void;
    onPrevious: () => void;
    onNext: () => void;
    onSeek: (time: number) => void;
    onVolumeChange: (volume: number) => void;
  }) {
    this.callbacks = callbacks;
    this.initElements();
    this.setupEventListeners();
  }

  initElements(): void {
    this.elements = {
      playBtn: document.getElementById("play-btn") as HTMLButtonElement,
      prevBtn: document.getElementById("prev-btn") as HTMLButtonElement,
      nextBtn: document.getElementById("next-btn") as HTMLButtonElement,
      playIcon: document.getElementById("play-icon") as SVGElement | null,
      pauseIcon: document.getElementById("pause-icon") as SVGElement | null,
      progressBar: document.getElementById("progress") as HTMLInputElement,
      volumeBar: document.getElementById("volume") as HTMLInputElement,
      currentTimeEl: document.getElementById("current-time") as HTMLElement,
      durationEl: document.getElementById("duration") as HTMLElement,
      trackNameEl: document.getElementById("track-name") as HTMLElement,
      trackArtistEl: document.getElementById("track-artist") as HTMLElement,
    };
  }

  setupEventListeners(): void {
    this.elements.playBtn.addEventListener("click", () =>
      this.callbacks.onTogglePlay()
    );
    this.elements.prevBtn.addEventListener("click", () =>
      this.callbacks.onPrevious()
    );
    this.elements.nextBtn.addEventListener("click", () =>
      this.callbacks.onNext()
    );

    this.elements.progressBar.addEventListener("mousedown", () => {
      this.isSeekingByUser = true;
    });

    this.elements.progressBar.addEventListener("mouseup", () => {
      this.isSeekingByUser = false;
    });

    this.elements.progressBar.addEventListener("input", () => {
      if (this.isSeekingByUser) {
        const duration = parseFloat(
          this.elements.durationEl.textContent
            ?.split(":")
            .reduce((acc, time) => 60 * acc + +time, 0)
            .toString() || "0"
        );
        const seekTime =
          (parseFloat(this.elements.progressBar.value) / 100) * duration;
        this.callbacks.onSeek(seekTime);
      }
    });

    this.elements.volumeBar.addEventListener("input", () => {
      this.callbacks.onVolumeChange(parseFloat(this.elements.volumeBar.value));
    });
  }

  updateState(state: PlayerState): void {
    const displayTrack =
      state.currentTrack || state.currentQueue[state.currentIndex];

    if (displayTrack) {
      this.elements.trackNameEl.textContent = displayTrack.title;
      this.elements.trackArtistEl.textContent = displayTrack.artist;
    } else {
      this.elements.trackNameEl.textContent = "No track selected";
      this.elements.trackArtistEl.textContent = "Unknown Artist";
    }

    if (state.isPlaying) {
      if (this.elements.playIcon) {
        this.elements.playIcon.classList.add("hidden");
      }
      if (this.elements.pauseIcon) {
        this.elements.pauseIcon.classList.remove("hidden");
      }
    } else {
      if (this.elements.playIcon) {
        this.elements.playIcon.classList.remove("hidden");
      }
      if (this.elements.pauseIcon) {
        this.elements.pauseIcon.classList.add("hidden");
      }
    }

    const hasQueue = state.currentQueue.length > 0;
    this.elements.playBtn.disabled = !hasQueue;
    this.elements.prevBtn.disabled = !hasQueue;
    this.elements.nextBtn.disabled = !hasQueue;
    if (hasQueue) {
      this.elements.playBtn.classList.remove(
        "opacity-50",
        "cursor-not-allowed"
      );
      this.elements.prevBtn.classList.remove(
        "opacity-50",
        "cursor-not-allowed"
      );
      this.elements.nextBtn.classList.remove(
        "opacity-50",
        "cursor-not-allowed"
      );
    } else {
      this.elements.playBtn.classList.add("opacity-50", "cursor-not-allowed");
      this.elements.prevBtn.classList.add("opacity-50", "cursor-not-allowed");
      this.elements.nextBtn.classList.add("opacity-50", "cursor-not-allowed");
    }

    if (!this.isSeekingByUser && state.duration > 0) {
      const progress = (state.currentTime / state.duration) * 100;
      this.elements.progressBar.value = progress.toString();
    }
    this.elements.currentTimeEl.textContent = this.formatTime(
      state.currentTime
    );
    this.elements.durationEl.textContent = this.formatTime(state.duration);
    this.elements.volumeBar.value = state.volume.toString();
  }

  formatTime(seconds: number): string {
    if (isNaN(seconds) || !isFinite(seconds)) return "0:00";

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }
}
