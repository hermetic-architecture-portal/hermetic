import React from 'react'; // eslint-disable-line no-unused-vars
import ReactDOM from 'react-dom';
import plugin from 'hermetic-client-plugin';
import './index.css';
import App from './App';
import userStore from './stores/userStore';

console.log(`Loaded plugin "${plugin.pluginName}"`);

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

const fixTitle = () => {
  const titleStyle = findNamedStyle('.Document-title');
  if (titleStyle && titleStyle.style.content) {
    window.document.title = titleStyle.style.content.replace(/"/g, '');
  }
};

const start = async () => {
  window.addEventListener('load', fixTitle);
  if (plugin.login && !plugin.login()) {
    return;
  }
  await userStore.load();
  ReactDOM.render(<App />, document.getElementById('root'));
};

start();
