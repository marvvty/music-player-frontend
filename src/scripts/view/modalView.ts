import { SongFormData } from "../dto/musicDto.js";

export class ModalView {
  modal: HTMLElement | null;
  form: HTMLFormElement | null;
  closeBtn: HTMLElement | null;
  cancelBtn: HTMLElement | null;
  useUrlCheckbox: HTMLInputElement | null;
  fileInput: HTMLElement | null;
  urlInput: HTMLElement | null;
  addMusicBtn: HTMLElement | null;
  showModalBtn: HTMLElement | null;

  constructor() {
    this.showModalBtn = document.getElementById("showModalBtn");
    this.modal = document.getElementById("musicModal");
    this.form = document.getElementById("musicForm") as HTMLFormElement;
    this.closeBtn = document.getElementById("closeModal");
    this.cancelBtn = document.getElementById("cancelBtn");
    this.useUrlCheckbox = document.getElementById("useUrl") as HTMLInputElement;
    this.fileInput = document.getElementById("fileInput") as HTMLInputElement;
    this.urlInput = document.getElementById("urlInput") as HTMLInputElement;
    this.addMusicBtn = document.getElementById("addMusicBtn");

    this.createEventsListeners();
  }

  createEventsListeners(): void {
    this.showModalBtn?.addEventListener("click", () => {
      this.show();
    });

    this.addMusicBtn?.addEventListener("click", () => {
      this.show();
    });

    this.closeBtn?.addEventListener("click", () => {
      this.hide();
    });

    this.cancelBtn?.addEventListener("click", () => this.hide());

    this.useUrlCheckbox?.addEventListener("change", () =>
      this.toggleInputType()
    );

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.hide();
      }
    });
  }

  show(): void {
    this.modal?.classList.remove("hidden");
    this.modal?.classList.add("flex");
  }

  hide(): void {
    this.modal?.classList.remove("flex");
    this.modal?.classList.add("hidden");

    this.resetForm();
  }

  toggleInputType(): void {
    const isUrl = this.useUrlCheckbox?.checked;

    if (isUrl) {
      this.fileInput?.classList.add("hidden");
      this.urlInput?.classList.remove("hidden");

      if (this.fileInput) (this.fileInput as HTMLInputElement).value = "";
      if (this.urlInput) {
        (this.urlInput as HTMLInputElement).required = true;
      }
    } else {
      this.fileInput?.classList.remove("hidden");
      this.urlInput?.classList.add("hidden");

      if (this.urlInput) {
        (this.urlInput as HTMLInputElement).value = "";
        (this.urlInput as HTMLInputElement).required = false;
      }
    }
  }

  getFormData(): SongFormData {
    const formData = new FormData(this.form!);
    const isUrl = this.useUrlCheckbox?.checked;

    return {
      title: formData.get("title") as string,
      artist: formData.get("artist") as string,
      source_type: isUrl ? "URL" : "UPLOAD",
      url: isUrl ? (formData.get("url") as string) : undefined,
      file: !isUrl ? (formData.get("file") as File) : undefined,
    };
  }

  resetForm(): void {
    if (this.form) {
      this.form.reset();

      if (this.useUrlCheckbox) {
        this.useUrlCheckbox.checked = false;
      }

      this.fileInput?.classList.remove("hidden");
      this.urlInput?.classList.add("hidden");
    }
  }

  showSuccess(message: string): void {
    const successDiv = document.createElement("div");
    successDiv.className =
      "fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-transform duration-300";
    successDiv.textContent = message;

    document.body.appendChild(successDiv);

    successDiv.classList.add("translate-x-full");
    setTimeout(() => {
      document.body.removeChild(successDiv);
    }, 300);
  }
}
