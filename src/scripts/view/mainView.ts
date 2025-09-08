export class MainView {
  titleElement: HTMLElement;
  allTracksBtn: HTMLButtonElement;

  constructor() {
    this.titleElement = document.getElementById("main-title") as HTMLElement;
    this.allTracksBtn = document.getElementById(
      "all-tracks-btn"
    ) as HTMLButtonElement;
  }

  setTitle(title: string): void {
    this.titleElement.textContent = title;
  }

  onAllTracksClick(callback: () => void): void {
    this.allTracksBtn.addEventListener("click", callback);
  }
}
