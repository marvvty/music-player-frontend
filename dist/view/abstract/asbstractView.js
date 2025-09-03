export class View {
    container;
    constructor(container) {
        this.container = container;
    }
    createElement(elementName, className, textContent) {
        const element = document.createElement(elementName);
        if (className)
            element.className = className;
        if (textContent)
            element.textContent = textContent;
        return element;
    }
    clearContainer() {
        this.container.replaceChildren();
    }
    showLoading(msg = "Wait a second...") {
        this.clearContainer();
        const loadElement = this.createElement("div", "text-gray-600", msg);
        this.container.appendChild(loadElement);
    }
    showError(msg) {
        this.clearContainer();
        const errorElement = this.createElement("div", "text-red-400", msg);
        this.container.appendChild(errorElement);
    }
}
//# sourceMappingURL=asbstractView.js.map