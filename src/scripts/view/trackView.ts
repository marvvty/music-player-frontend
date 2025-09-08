import { Song } from "../dto/musicDto";
import { View } from "./abstract/abstractView.js";

export class TracksView extends View {
  onTrackPlay: (track: Song) => void;

  constructor(container: HTMLElement, onTrackPlay: (track: Song) => void) {
    super(container);
    this.onTrackPlay = onTrackPlay;
  }

  render(tracks: Song[]): void {
    this.clearContainer();

    if (tracks.length === 0) {
      const message = this.createElement(
        "div",
        "text-gray-500",
        "No tracks found"
      );
      this.container.appendChild(message);
      return;
    }

    tracks.forEach((track) => {
      const trackCard = this.createTrackCard(track);
      this.container.appendChild(trackCard);
    });
  }

  createTrackCard(track: Song): HTMLElement {
    const card = this.createElement(
      "div",
      "bg-gray-800 border border-gray-700 p-4 rounded hover:bg-gray-700 cursor-pointer flex flex-col items-center justify-center h-32 transition-colors w-32"
    );

    const icon = this.createSvg();

    const title = this.createElement(
      "span",
      "font-semibold text-center",
      track.title
    );
    const artist = this.createElement(
      "span",
      "text-gray-400 text-sm text-center",
      track.artist
    );
    card.appendChild(icon);
    card.appendChild(title);
    card.appendChild(artist);

    card.addEventListener("click", () => this.onTrackPlay(track));

    return card;
  }

  createSvg() {
    const icon = this.createElement(
      "div",
      "w-18 h-18 mb-2 rounded bg-gray-600 flex items-center justify-center"
    );
    icon.replaceChildren();
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "w-16 h-16 text-gray-300");
    svg.setAttribute("fill", "currentColor");
    svg.setAttribute("viewBox", "0 0 24 24");

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute(
      "d",
      "M19.952 1.651a.75.75 0 0 1 .298.599V16.303a3 3 0 0 1-2.176 2.884l-1.32.377a2.553 2.553 0 1 1-1.403-4.909l2.311-.66a1.5 1.5 0 0 0 1.088-1.442V6.994l-9 2.572v9.737a3 3 0 0 1-2.176 2.884l-1.32.377a2.553 2.553 0 1 1-1.402-4.909l2.31-.66a1.5 1.5 0 0 0 1.088-1.442V5.25a.75.75 0 0 1 .544-.721l10.5-3a.75.75 0 0 1 .658.122Z"
    );

    svg.appendChild(path);

    icon.appendChild(svg);

    return icon;
  }
}
