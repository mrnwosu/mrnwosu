export function singleElementAnimation(
  cssQuerySelector: string,
  classInfos: { add: string; remove: string }[]
) {
  const elements = document.querySelector(cssQuerySelector);
  if (!elements) {
    return;
  }
  elements.classList.remove(...classInfos.map((c) => c.remove));
  elements.classList.add(...classInfos.map((c) => c.add));
}

export function multipleElementAnimation(
  cssQuerySelector: string,
  classInfos: { add: string; remove: string }[]
) {
  const elements = document.querySelectorAll(cssQuerySelector);
  if (!elements) {
    return;
  }
  elements.forEach((el) => {
    el.classList.remove(...classInfos.map((c) => c.remove));
    el.classList.add(...classInfos.map((c) => c.add));
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