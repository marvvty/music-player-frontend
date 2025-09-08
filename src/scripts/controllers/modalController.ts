import { MusicModel } from "../model/musicModel.js";
import { ModalView } from "../view/modalView.js";
import { MusicPlayerController } from "./musicPlayer.js";

export class ModalController {
  model: MusicModel;
  view: ModalView;
  player: MusicPlayerController;

  constructor() {
    this.model = new MusicModel();
    this.view = new ModalView();
    this.player = new MusicPlayerController();

    this.initEvents();
  }

  initEvents(): void {
    this.view.form?.addEventListener("submit", (e) => {
      this.submit(e);
    });
  }

  async submit(event: Event): Promise<void> {
    event.preventDefault();

    const formData = this.view.getFormData();

    try {
      const result = await this.model.createMusic(formData);
      this.view.showSuccess("Track added");
      this.view.hide();

      this.dispatchMusicAddedEvent(result);
      this.player.loadAllTracks();
    } catch (err) {
      console.error("Error adding track:", err);
      alert("Failed to add track");
    }
  }

  dispatchMusicAddedEvent(musicData: any): void {
    const event = new CustomEvent("musicAdded", {
      detail: { music: musicData },
    });

    document.dispatchEvent(event);
  }
}
