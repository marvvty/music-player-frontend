import { View } from "./abstract/abstractView.js";
export class QueueView extends View {
    onTrackSelect;
    constructor(container, onTrackSelect) {
        super(container);
        this.onTrackSelect = onTrackSelect;
    }
    render(tracks, currentTrackId) {
        this.clearContainer();
        if (tracks.length === 0) {
            const message = this.createElement("li", "text-gray-500 text-sm", "No tracks in queue");
            this.container.appendChild(message);
            return;
        }
        tracks.forEach((track, index) => {
            const queueItem = this.createQueueItem(track, index, track.id === currentTrackId);
            this.container.appendChild(queueItem);
        });
    }
    createQueueItem(track, index, isCurrentTrack) {
        const item = this.createElement("li", `p-2 border border-gray-700 rounded hover:bg-gray-700 cursor-pointer flex justify-between transition-colors ${isCurrentTrack ? "bg-gray-700 border-gray-600" : ""}`);
        const trackInfo = this.createElement("span", "truncate", track.title);
        const duration = this.createElement("span", "text-gray-400 text-sm ml-2", this.formatTime(track.duration));
        item.appendChild(trackInfo);
        item.appendChild(duration);
        item.addEventListener("click", () => this.onTrackSelect(index));
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
//# sourceMappingURL=queueView.js.map