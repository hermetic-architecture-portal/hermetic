class BunyanRequestLogger {
  constructor(baseLogger, request) {
    this.baseLogger = baseLogger;
    this.request = request;
  }

  addRequestInfo(args) {
    if (!this.request) return args;
    if (args.length === 0) return args;
    const extraInfo = {
      res: {
        method: this.request.method,
        path: this.request.raw.req.url,
        statusCode: this.request.response && this.request.response.statusCode
          ? this.request.response.statusCode : undefined,
      },
      username: (this.request.auth && this.request.auth.credentials)
        ? this.request.auth.credentials.username
        : 'guest',
      remoteAddress: this.request.info.remoteAddress,
      forwardedFor: this.request.headers['x-forwarded-for'],
      durationMs: this.request.info.completed - this.request.info.received,
    };
    if (typeof args[0] === 'string') {
      return [extraInfo, ...args];
    }
    // args[0] is an object - need to add our extra props to it
    const firstArg = Object.assign(extraInfo, args[0]);
    return [firstArg, ...args.slice(1)];
  }

  trace(...args) {
    this.baseLogger.trace(...this.addRequestInfo(args));
  }

  debug(...args) {
    this.baseLogger.debug(...this.addRequestInfo(args));
  }

  info(...args) {
    this.baseLogger.info(...this.addRequestInfo(args));
  }

  warn(...args) {
    this.baseLogger.warn(...this.addRequestInfo(args));
  }

  error(...args) {
    this.baseLogger.error(...this.addRequestInfo(args));
  }

  fatal(...args) {
    this.baseLogger.fatal(...this.addRequestInfo(args));
  }

  addTraceHeaders(headers) {
    return Object.assign({
      'x-correlation-id': this.request.headers['x-correlation-id'],
    }, headers);
  }
}

export default BunyanRequestLogger;
