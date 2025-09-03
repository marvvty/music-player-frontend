import { View } from "./abstract/abstractView.js";
export class PlaylistsView extends View {
    onPlaylistSelect;
    constructor(container, onPlaylistSelect) {
        super(container);
        this.onPlaylistSelect = onPlaylistSelect;
    }
    render(playlists) {
        this.clearContainer();
        if (playlists.length === 0) {
            const message = this.createElement("li", "text-gray-500 text-sm", "No playlists found");
            this.container.appendChild(message);
            return;
        }
        playlists.forEach((playlist) => {
            const playlistItem = this.createPlaylistItem(playlist);
            this.container.appendChild(playlistItem);
        });
    }
    createPlaylistItem(playlist) {
        const item = this.createElement("li", "p-2 border border-gray-700 rounded hover:bg-gray-700 cursor-pointer transition-colors", playlist.name);
        item.addEventListener("click", () => this.onPlaylistSelect(playlist));
        return item;
    }
    showLoading() {
        this.container.innerHTML =
            '<li class="text-gray-500 text-sm">Loading playlists...</li>';
    }
    showError(message) {
        this.container.innerHTML = `<li class="text-red-400 text-sm">${message}</li>`;
    }
}
//# sourceMappingURL=playlistView.js.map