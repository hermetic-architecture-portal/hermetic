const config = {
  sampleDataPath: '../sample-data',
  baseYamlPath: process.env.HERMETIC_DATA_BASE_PATH || '../sample-data',
  corsOrigin: process.env.HERMETIC_CORS_ORIGIN || 'http://localhost:3000',
  port: process.env.HERMETIC_PORT || 3001,
  staticContentRoot: process.env.HERMETIC_STATIC_CONTENT_ROOT || '../client/build',
  canRunWithNoAuth: !!process.env.HERMETIC_RUN_WITH_NO_AUTH,
  sandboxBasePath: process.env.HERMETIC_SANDBOX_PATH,
};

export default config;
