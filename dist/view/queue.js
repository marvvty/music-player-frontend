import { View } from "./abstract/asbstractView.js";
export class QueueView extends View {
    onSongSelect;
    constructor(container, onSongSelect) {
        super(container);
        this.onSongSelect = onSongSelect;
    }
    render(songs, currentTrackId) {
        this.clearContainer();
        if (songs.length === 0) {
            const message = this.createElement("li", "text-gray-500 text-sm", "No tracks in queue");
            this.container.appendChild(message);
            return;
        }
        songs.forEach((track, index) => {
            const queueItem = this.createQueueItem(track, index, track.id === currentTrackId);
            this.container.appendChild(queueItem);
        });
    }
    createQueueItem(song, index, isCurrentTrack) {
        const item = this.createElement("li", `p-2 border border-gray-700 rounded hover:border-white cursor-pointer flex justify-between transition-colors ${isCurrentTrack ? "bg-green-900 border-green-600" : ""}`);
        const trackInfo = this.createElement("span", "truncate", song.title);
        const duration = this.createElement("span", "text-gray-400 text-sm ml-2", this.formatTime(song.duration));
        item.appendChild(trackInfo);
        item.appendChild(duration);
        item.addEventListener("click", () => this.onSongSelect(index));
        return item;
    }
    formatTime(seconds) {
        if (isNaN(seconds) || !isFinite(seconds))
            return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    }
}
//# sourceMappingURL=queue.js.map