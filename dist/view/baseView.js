export class BaseView {
    container;
    constructor(container) {
        this.container = container;
    }
    createElement(tag, className, textContent) {
        const element = document.createElement(tag);
        if (className)
            element.className = className;
        if (textContent)
            element.textContent = textContent;
        return element;
    }
    clearContainer() {
        this.container.innerHTML = "";
    }
    showLoading(message = "Loading...") {
        this.container.innerHTML = `<div class="text-gray-500">${message}</div>`;
    }
    showError(message) {
        this.container.innerHTML = `<div class="text-red-400">${message}</div>`;
    }
}
//# sourceMappingURL=baseView.js.map