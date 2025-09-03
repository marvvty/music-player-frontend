import { View } from "./abstract/asbstractView.js";
export class PlaylistView extends View {
    playlistSelect;
    constructor(container, playlistSelect) {
        super(container);
        this.playlistSelect = playlistSelect;
    }
    render(playlist) {
        this.clearContainer();
        if (playlist.length === 0) {
            const message = this.createElement("li", "text-gray-500 text-sm", "No playlists found");
            this.container.appendChild(message);
            return;
        }
        playlist.forEach((playlist) => {
            const playlistItem = this.createItem(playlist);
            this.container.appendChild(playlistItem);
        });
    }
    createItem(playlist) {
        const item = this.createElement("li", "p-2 border border-gray-700 rounded hover:bg-gray-700 cursor-pointer transition-colors", playlist.name);
        item.addEventListener("click", () => this.playlistSelect(playlist));
        return item;
    }
    showLoading() {
        this.clearContainer();
        const li = document.createElement("li");
        li.className = "text-gray-500 text-sm";
        li.textContent = "Loading playlists...";
        this.container.appendChild(li);
    }
    showError(message) {
        this.clearContainer();
        const li = document.createElement("li");
        li.className = "text-red-400 text-sm";
        li.textContent = message;
        this.container.appendChild(li);
    }
}
//# sourceMappingURL=playlist.js.map