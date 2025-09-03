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
    this.container.innerHTML = `<div class="text-gray-500">${message}</div>`;
  }

  showError(message: string): void {
    this.container.innerHTML = `<div class="text-red-400">${message}</div>`;
  }
}
