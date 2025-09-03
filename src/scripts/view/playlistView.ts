import { Playlist } from "../dto/musicDto";
import { View } from "./abstract/abstractView.js";

export class PlaylistsView extends View {
  private onPlaylistSelect: (playlist: Playlist) => void;

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

  private createPlaylistItem(playlist: Playlist): HTMLElement {
    const item = this.createElement(
      "li",
      "p-2 border border-gray-700 rounded hover:bg-gray-700 cursor-pointer transition-colors",
      playlist.name
    );

    item.addEventListener("click", () => this.onPlaylistSelect(playlist));
    return item;
  }

  showLoading(): void {
    this.container.innerHTML =
      '<li class="text-gray-500 text-sm">Loading playlists...</li>';
  }

  showError(message: string): void {
    this.container.innerHTML = `<li class="text-red-400 text-sm">${message}</li>`;
  }
}
