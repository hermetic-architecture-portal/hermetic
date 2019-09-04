import bunyan from 'bunyan';

const createLogger = () => {
  const logLevelToUse = process.env.NODE_LOG_LEVEL || 'debug';

  const serializers = Object.assign({}, bunyan.stdSerializers);
  serializers.res = (res) => {
    if (!res || !res.statusCode) {
      return res;
    }
    return {
      statusCode: res.statusCode,
      method: res.method,
      path: res.path,
      responseTime: res.responseTime,
    };
  };

  const logger = bunyan.createLogger({
    name: 'HERMETIC',
    level: logLevelToUse,
    stream: process.stdout,
    serializers: serializers,
  });

  return logger;
};

export default createLogger;
