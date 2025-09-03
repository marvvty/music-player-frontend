import { View } from "./abstract/asbstractView.js";
export class SongView extends View {
    onPlay;
    constructor(container, onPlay) {
        super(container);
        this.onPlay = onPlay;
    }
    render(songs) {
        this.clearContainer();
        if (songs.length === 0) {
            const msg = this.createElement("div", "text-gray-500", "we no have songs");
            this.container.appendChild(msg);
            return;
        }
        for (let song of songs) {
        }
    }
    createCard(song) {
        const card = this.createElement("div", "bg-gray-800 border border-gray-700 p-4 rounded hover:bg-gray-700 cursor-pointer flex flex-col items-center justify-center h-48 transition-colors");
        const icon = this.createElement("div", "w-32 h-32 mb-2 rounded bg-gray-600 flex items-center justify-center");
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("fill", "currentColor");
        svg.setAttribute("class", "size-6");
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("fill-rule", "evenodd");
        path.setAttribute("d", "M19.952 1.651a.75.75 0 0 1 .298.599V16.303a3 3 0 0 1-2.176 2.884l-1.32.377a2.553 2.553 0 1 1-1.403-4.909l2.311-.66a1.5 1.5 0 0 0 1.088-1.442V6.994l-9 2.572v9.737a3 3 0 0 1-2.176 2.884l-1.32.377a2.553 2.553 0 1 1-1.402-4.909l2.31-.66a1.5 1.5 0 0 0 1.088-1.442V5.25a.75.75 0 0 1 .544-.721l10.5-3a.75.75 0 0 1 .658.122Z");
        path.setAttribute("clip-rule", "evenodd");
        svg.appendChild(path);
        icon.appendChild(svg);
        const title = this.createElement("span", "text-center", song.title);
        const artist = this.createElement("span", "text-gray-400 text-sm text-center", song.artist);
        card.appendChild(icon);
        card.appendChild(title);
        card.appendChild(artist);
        return card;
    }
}
//# sourceMappingURL=track.js.map