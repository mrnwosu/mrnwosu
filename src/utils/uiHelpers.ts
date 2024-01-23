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
  const element = document.querySelector(selector);
  if (!element) {
    return;
  }
  element.textContent = text;
}

export function setAttrivuteBySelector(
  selector: string,
  attributeName: string,
  attributeValue: string
) {
  const element = document.querySelector(selector);
  if (!element) {
    return;
  }
  element.setAttribute(attributeName, attributeValue);
}