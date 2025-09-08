import { Playlist } from "../dto/musicDto";
import { View } from "./abstract/abstractView.js";

export class PlaylistsView extends View {
  onPlaylistSelect: (playlist: Playlist) => void;

  constructor(
    container: HTMLElement,
    onPlaylistSelect: (playlist: Playlist) => void
  ) {
    super(container);
    this.onPlaylistSelect = onPlaylistSelect;
  }

  render(playlists: Playlist[]): void {
    this.clearContainer();

    if (playlists.length === 0) {
      const message = this.createElement(
        "li",
        "text-gray-500 text-sm",
        "No playlists found"
      );
      this.container.appendChild(message);
      return;
    }

    playlists.forEach((playlist) => {
      const playlistItem = this.createPlaylistItem(playlist);
      this.container.appendChild(playlistItem);
    });
  }

  createPlaylistItem(playlist: Playlist): HTMLElement {
    const item = this.createElement(
      "li",
      "p-2 border border-gray-700 rounded hover:bg-gray-700 cursor-pointer transition-colors",
      playlist.name
    );

    item.addEventListener("click", () => this.onPlaylistSelect(playlist));
    return item;
  }

  showLoading(): void {
    this.container.textContent = "";

    const li = document.createElement("li");
    li.textContent = "Loading playlists...";
    li.classList.add("text-gray-500", "text-sm");

    this.container.appendChild(li);
  }

  showError(message: string): void {
    this.container.textContent = "";

    const li = document.createElement("li");
    li.textContent = message;
    li.classList.add("text-red-400", "text-sm");

    this.container.appendChild(li);
  }
}
