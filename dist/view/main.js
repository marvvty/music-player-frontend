export class MainView {
    titleElement;
    allTracksBtn;
    constructor() {
        this.titleElement = document.getElementById("main-title");
        this.allTracksBtn = document.getElementById("all-tracks-btn");
    }
    setTitle(title) {
        this.titleElement.textContent = title;
    }
    onAllTracksClick(callback) {
        this.allTracksBtn.addEventListener("click", callback);
    }
}
//# sourceMappingURL=main.js.map