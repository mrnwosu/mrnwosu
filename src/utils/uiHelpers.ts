// Track if initial loading animation has completed
let loadingCompleted = false;

export function setLoadingCompleted(completed: boolean): void {
  loadingCompleted = completed;
}

export function isLoadingCompleted(): boolean {
  return loadingCompleted;
}

export function elementClassToggle(
  cssQuerySelector: string,
  addClasses: string[] | null,
  removeClasses: string[] | null
) {
  const elements = document.querySelectorAll(cssQuerySelector);
  if (!elements) {
    return;
  }
  elements.forEach((el) => {
    if(addClasses && addClasses.length > 0) {
      el.classList.add(...addClasses);
    }

    if(removeClasses && removeClasses.length > 0) {
      el.classList.remove(...removeClasses);
    }
  });
}

export function setTextForElementBySelector(
  selector: string,
  text: string
) {
  const elements = document.querySelectorAll(selector);
  if (!elements) {
    return;
  }
  elements.forEach((element) => {
    element.textContent = text;
  });
}

export function setAttrivuteBySelector(
  selector: string,
  attributeName: string,
  attributeValue: string
) {
  const elements = document.querySelectorAll(selector);
  if (!elements) {
    return;
  }
  elements.forEach((element) => {
    element.setAttribute(attributeName, attributeValue);
  });
}