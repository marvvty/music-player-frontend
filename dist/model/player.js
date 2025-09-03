export class playerModel {
    state;
    audio;
    observers = [];
    constructor() {
        this.audio = new Audio();
        this.state = {
            currentSong: null,
            currentQueue: [],
            currentIndex: 0,
            isPlaying: false,
            volume: 0.5,
            currentTime: 0,
            duration: 0,
        };
        this.audio.volume = this.state.volume;
    }
    initAudioEvent() {
        this.audio.addEventListener("loadedmetadata", () => {
            this.state.duration = this.audio.duration;
            this.notify();
        });
        this.audio.addEventListener("timeupdate", () => {
            this.state.currentTime = this.audio.currentTime;
            this.notify();
        });
        this.audio.addEventListener("ended", () => { });
        this.audio.addEventListener("play", () => {
            this.state.isPlaying = true;
            this.notify();
        });
        this.audio.addEventListener("pause", () => {
            this.state.isPlaying = false;
            this.notify();
        });
    }
    subscribe(observer) {
        const index = this.observers.push(observer);
    }
    unsubscribe(observer) {
        const index = this.observers.indexOf(observer);
        if (index !== -1) {
            this.observers.splice(index, 1);
        }
    }
    notify() {
        for (const observer of this.observers) {
            observer({ ...this.state });
        }
    }
    async loadSong(song, audioUrl) {
        this.state.currentSong = song;
        this.audio.src = audioUrl;
        return new Promise((resolve, reject) => {
            this.audio.addEventListener("canplaythrough", () => {
                this.notify();
                resolve();
            }, { once: true });
            this.audio.addEventListener("error", (error) => {
                reject(error);
            }, {
                once: true,
            });
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
            this.pause();
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
    setQueue(songs, startsIndex = 0) {
        this.state.currentQueue = [...songs];
        this.state.currentIndex = Math.max(0, Math.min(songs.length - 1, startsIndex));
        this.notify;
    }
    nextMusic() {
        if (this.state.currentQueue.length === 0)
            return;
        this.state.currentIndex = this.getNextIndex(1);
        this.notify();
    }
    previousMusic() {
        if (this.state.currentQueue.length === 0)
            return;
        this.state.currentIndex = this.getNextIndex(-1);
        this.notify();
    }
    getNextIndex(step) {
        const len = this.state.currentQueue.length;
        return (this.state.currentIndex + step + len) % len;
    }
    setIndex(index) {
        if (index >= 0 && index < this.state.currentQueue.length) {
            this.state.currentIndex = index;
            this.notify();
        }
    }
    getState() {
        return { ...this.state };
    }
    getCurrent() {
        return this.state.currentSong;
    }
    getQueueSong(index) {
        return this.state.currentQueue[index] || null;
    }
}
//# sourceMappingURL=player.js.map