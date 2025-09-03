export abstract class View {
  protected container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  protected createElement(
    tag: string,
    className?: string,
    textContent?: string
  ): HTMLElement {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (textContent) element.textContent = textContent;
    return element;
  }

  protected clearContainer(): void {
    this.container.innerHTML = "";
  }

  showLoading(message: string = "Loading..."): void {
    this.container.textContent = "";

    const div = document.createElement("div");
    div.textContent = message;
    div.classList.add("text-gray-500");

    this.container.appendChild(div);
  }

  showError(message: string): void {
    this.container.textContent = "";

    const div = document.createElement("div");
    div.textContent = message;
    div.classList.add("text-red-400");

    this.container.appendChild(div);
  }
}
