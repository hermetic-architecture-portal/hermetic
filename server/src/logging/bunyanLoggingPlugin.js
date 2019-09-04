const bunyanLoggingPlugin = {
  name: 'bunyan-logging',
  register: (server, options) => {
    server.events.on('log', bunyanLoggingPlugin.onLog);
    server.events.on('response', bunyanLoggingPlugin.onResponse);
    server.events.on('start', () => bunyanLoggingPlugin.onStart(server));
    bunyanLoggingPlugin.baseLogger = options.baseLogger;
  },

  onLog: (event) => {
    bunyanLoggingPlugin.baseLogger.info(event);
  },

  onResponse: (request) => {
    request.plugins.logger.info('[response]');
  },

  onStart: (server) => {
    bunyanLoggingPlugin.baseLogger.info(server.info, 'Started');
  },
};

export default bunyanLoggingPlugin;
