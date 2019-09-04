import React from 'react'; // eslint-disable-line no-unused-vars
import ReactDOM from 'react-dom';
import plugin from 'hermetic-client-plugin';
import './index.css';
import App from './App';
import userStore from './stores/userStore';

console.log(`Loaded plugin "${plugin.pluginName}"`);

const start = async () => {
  if (plugin.login && !plugin.login()) {
    return;
  }
  await userStore.load();
  ReactDOM.render(<App />, document.getElementById('root'));
};

start();
