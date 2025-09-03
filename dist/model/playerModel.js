export class PlayerModel {
    state;
    audio;
    observers = [];
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
    setupAudioEventListeners() {
        this.audio.addEventListener("loadedmetadata", () => {
            this.state.duration = this.audio.duration;
            this.notify();
        });
        this.audio.addEventListener("timeupdate", () => {
            this.state.currentTime = this.audio.currentTime;
            this.notify();
        });
        this.audio.addEventListener("ended", () => {
            this.nextTrack();
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
            this.notify();
        });
    }
    subscribe(observer) {
        this.observers.push(observer);
    }
    unsubscribe(observer) {
        const index = this.observers.indexOf(observer);
        if (index > -1) {
            this.observers.splice(index, 1);
        }
    }
    notify() {
        this.observers.forEach((observer) => observer({ ...this.state }));
    }
    async loadTrack(track, audioUrl) {
        this.state.currentTrack = track;
        this.audio.src = audioUrl;
        return new Promise((resolve, reject) => {
            const onCanPlay = () => {
                this.audio.removeEventListener("canplaythrough", onCanPlay);
                this.audio.removeEventListener("error", onError);
                this.notify();
                resolve();
            };
            const onError = (e) => {
                this.audio.removeEventListener("canplaythrough", onCanPlay);
                this.audio.removeEventListener("error", onError);
                reject(e);
            };
            this.audio.addEventListener("canplaythrough", onCanPlay, { once: true });
            this.audio.addEventListener("error", onError, { once: true });
            this.audio.load();
        });
    }
    async play() {
        await this.audio.play();
    }
    pause() {
        this.audio.pause();
    }
    togglePlay() {
        if (this.state.isPlaying) {
            this.pause();
        }
        else {
            this.play().catch(console.error);
        }
    }
    setVolume(volume) {
        this.state.volume = Math.max(0, Math.min(1, volume));
        this.audio.volume = this.state.volume;
        this.notify();
    }
    seek(time) {
        if (this.audio.duration) {
            this.audio.currentTime = Math.max(0, Math.min(this.audio.duration, time));
        }
    }
    setQueue(tracks, startIndex = 0) {
        this.state.currentQueue = [...tracks];
        this.state.currentIndex = Math.max(0, Math.min(tracks.length - 1, startIndex));
        this.notify();
    }
    nextTrack() {
        if (this.state.currentQueue.length === 0)
            return;
        this.getNextIndex(1);
        this.notify();
    }
    previousTrack() {
        if (this.state.currentQueue.length === 0)
            return;
        this.getNextIndex(-1);
        this.notify();
    }
    getNextIndex(step) {
        const len = this.state.currentQueue.length;
        return (this.state.currentIndex + step + len) % len;
    }
    setCurrentIndex(index) {
        if (index >= 0 && index < this.state.currentQueue.length) {
            this.state.currentIndex = index;
            this.notify();
        }
    }
    getState() {
        return { ...this.state };
    }
    getCurrentTrack() {
        return this.state.currentTrack;
    }
    getQueueTrack(index) {
        return this.state.currentQueue[index] || null;
    }
}
//# sourceMappingURL=playerModel.js.map