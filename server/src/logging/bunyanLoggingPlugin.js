const bunyanLoggingPlugin = {
  name: 'bunyan-logging',
  register: (server, options) => {
    server.events.on('log', bunyanLoggingPlugin.onLog);
    server.events.on('response', bunyanLoggingPlugin.onResponse);
    server.events.on('request', bunyanLoggingPlugin.onRequest);
    server.events.on('start', () => bunyanLoggingPlugin.onStart(server));
    bunyanLoggingPlugin.baseLogger = options.baseLogger;
  },

  onLog: (event) => {
    bunyanLoggingPlugin.baseLogger.info(event);
  },

  onRequest: (request, event, tags) => {
    if ((tags.error) && event.error
      && !(event.error.output && (event.error.output.statusCode === 404))) {
      bunyanLoggingPlugin.baseLogger.error(event.error);
    }
  },

  onResponse: (request) => {
    request.plugins.logger.info('[response]');
  },

  onStart: (server) => {
    bunyanLoggingPlugin.baseLogger.info(server.info, 'Started');
  },
};

export default bunyanLoggingPlugin;
