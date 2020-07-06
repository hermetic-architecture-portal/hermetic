const findNamedStyle = (styleName) => {
  for (let i = 0; i < window.document.styleSheets.length; i += 1) {
    const styleSheet = window.document.styleSheets.item(i);
    if (styleSheet.cssRules) {
      for (let j = 0; j < styleSheet.cssRules.length; j += 1) {
        const rule = styleSheet.cssRules.item(j);
        if (rule.selectorText === styleName) {
          return rule;
        }
      }
    }
  }
  return false;
};

const replaceTitleInBody = (element, title) => {
  if (element.children && element.children.length) {
    Array.from(element.children).forEach((child) => { replaceTitleInBody(child, title) });
  } else {
    if (element.innerHTML) {
      element.innerHTML = element.innerHTML.replace(/Hermetic/g, title);
    }
  }
};

const fixProductName = () => {
  const titleStyle = findNamedStyle('.Document-title');
  if (titleStyle && titleStyle.style.content) {
    const titleValue = titleStyle.style.content.replace(/"/g, '');
    window.document.title = titleValue;
    replaceTitleInBody(document.body, titleValue);
  }
};


window.addEventListener('load', fixProductName);
