const config = {
  apiBaseUrl: (window.location.host === 'localhost:3000')
    ? 'http://localhost:3001/api'
    : `${window.location.protocol}//${window.location.host}/api`,
  clientBaseUrl: `${window.location.protocol}//${window.location.host}`,
  defaultPath: process.env.REACT_APP_HERMETIC_DEFAULT_PATH || '/businessRefModel',
  resolvePathAgainstDefault: path => ((path === config.defaultPath) ? '/' : path),
};

export default config;
