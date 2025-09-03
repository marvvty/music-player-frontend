export class PlayerControlsView {
    elements;
    callbacks;
    isSeekingByUser = false;
    constructor(callbacks) {
        this.callbacks = callbacks;
        this.initElements();
        this.setupEventListeners();
    }
    initElements() {
        this.elements = {
            playBtn: document.getElementById("play-btn"),
            prevBtn: document.getElementById("prev-btn"),
            nextBtn: document.getElementById("next-btn"),
            playIcon: document.getElementById("play-icon"),
            pauseIcon: document.getElementById("pause-icon"),
            progressBar: document.getElementById("progress"),
            volumeBar: document.getElementById("volume"),
            currentTimeEl: document.getElementById("current-time"),
            durationEl: document.getElementById("duration"),
            trackNameEl: document.getElementById("track-name"),
            trackArtistEl: document.getElementById("track-artist"),
        };
    }
    setupEventListeners() {
        this.elements.playBtn.addEventListener("click", () => this.callbacks.onTogglePlay());
        this.elements.prevBtn.addEventListener("click", () => this.callbacks.onPrevious());
        this.elements.nextBtn.addEventListener("click", () => this.callbacks.onNext());
        this.elements.progressBar.addEventListener("mousedown", () => {
            this.isSeekingByUser = true;
        });
        this.elements.progressBar.addEventListener("mouseup", () => {
            this.isSeekingByUser = false;
        });
        this.elements.progressBar.addEventListener("input", () => {
            if (this.isSeekingByUser) {
                const duration = parseFloat(this.elements.durationEl.textContent
                    ?.split(":")
                    .reduce((acc, time) => 60 * acc + +time, 0)
                    .toString() || "0");
                const seekTime = (parseFloat(this.elements.progressBar.value) / 100) * duration;
                this.callbacks.onSeek(seekTime);
            }
        });
        this.elements.volumeBar.addEventListener("input", () => {
            this.callbacks.onVolumeChange(parseFloat(this.elements.volumeBar.value));
        });
    }
    updateState(state) {
        if (state.currentTrack) {
            this.elements.trackNameEl.textContent = state.currentTrack.title;
            this.elements.trackArtistEl.textContent = state.currentTrack.artist;
        }
        else {
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
        }
        else {
            if (this.elements.playIcon) {
                this.elements.playIcon.classList.remove("hidden");
            }
            if (this.elements.pauseIcon) {
                this.elements.pauseIcon.classList.add("hidden");
            }
        }
        if (!this.isSeekingByUser && state.duration > 0) {
            const progress = (state.currentTime / state.duration) * 100;
            this.elements.progressBar.value = progress.toString();
        }
        this.elements.currentTimeEl.textContent = this.formatTime(state.currentTime);
        this.elements.durationEl.textContent = this.formatTime(state.duration);
        this.elements.volumeBar.value = state.volume.toString();
    }
    formatTime(seconds) {
        if (isNaN(seconds) || !isFinite(seconds))
            return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    }
}
//# sourceMappingURL=controlsView.js.map