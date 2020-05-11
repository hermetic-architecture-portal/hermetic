import cryptoRandomString from 'crypto-random-string';
import camelcase from 'camelcase';
import { features } from 'hermetic-common';
import decamelize from 'decamelize';

// each OAuth provider has its own config options
// any env varibles starting with HERMETIC_OAUTH_PROVIDER_CONFIG_
// get converted into provider config
// e.g. HERMETIC_OAUTH_PROVIDER_CONFIG_DOMAIN=example.com
// results in provider config { domain: 'example.com' }
// more details of the settings here https://hapi.dev/module/bell/providers/
const providerConfig = {};
Object.getOwnPropertyNames(process.env)
  .filter(name => name.startsWith('HERMETIC_OAUTH_PROVIDER_CONFIG_'))
  .map(ucaseName => ({
    name: camelcase(ucaseName.replace('HERMETIC_OAUTH_PROVIDER_CONFIG_', '')),
    value: process.env[ucaseName],
  }))
  .forEach((setting) => { providerConfig[setting.name] = setting.value; });

const provider = process.env.HERMETIC_OAUTH_PROVIDER;
const defaultLogoutUrl = (provider === 'azure-legacy')
  ? `https://login.microsoftonline.com/${providerConfig.tenant}/oauth2/v2.0/logout`
  : '/';
const defaultIdField = (provider === 'azure-legacy')
  ? 'raw.upn'
  : 'id';

let rolesForFeatures = {};

const defaultFeatureMap = {
  core: ['BasicAccess', 'TechDetailsAccess'],
  techDetails: ['TechDetailsAccess'],
  technologyHealthMetrics: ['TechDetailsAccess'],
  capabilityHealthMetrics: ['TechDetailsAccess'],
  capabilityResourcing: ['TechDetailsAccess'],
  eaHealthMetrics: ['TechDetailsAccess'],
  edit: ['EditDataAccess'],
  reporting: ['TechDetailsAccess'],
  cost: ['CostDataAccess'],
};

let featureMapSupplied = false;

Object.getOwnPropertyNames(features)
  .forEach((f) => {
    const envVariableName = `HERMETIC_OAUTH_ROLES_FOR_FEATURE_${decamelize(features[f]).toUpperCase()}`;
    if (process.env[envVariableName]) {
      featureMapSupplied = true;
      rolesForFeatures[features[f]] = process.env[envVariableName]
        .split(',').map(s => s.trim());
    }
  });

if (!featureMapSupplied) {
  rolesForFeatures = defaultFeatureMap;
}

const config = {
  sampleDataPath: '../sample-data',
  baseYamlPath: process.env.HERMETIC_DATA_BASE_PATH || '../sample-data',
  port: process.env.HERMETIC_PORT || 3001,
  staticContentRoot: '../client/build',
  sandboxBasePath: process.env.HERMETIC_SANDBOX_PATH,
  editorPageSize: process.env.HERMETIC_EDIT_PAGE_SIZE
    ? Number.parseInt(process.env.HERMETIC_EDIT_PAGE_SIZE, 10)
    : 10,
  debugClient: process.env.HERMETIC_DEBUG_CLIENT === 'Y',
  auth: {
    hasAuth: !!provider,
    canRunWithNoAuth: process.env.HERMETIC_RUN_WITH_NO_AUTH === 'Y',
    provider,
    providerConfig,
    clientId: process.env.HERMETIC_OAUTH_CLIENT_ID,
    clientSecret: process.env.HERMETIC_OAUTH_CLIENT_SECRET,
    providerLogoutUrl: process.env.HERMETIC_OAUTH_PROVIDER_LOGOUT_URL
      || defaultLogoutUrl,
    cookieSecret: process.env.HERMETIC_COOKIE_SECRET || cryptoRandomString({ length: 32 }),
    insecureCookies: process.env.HERMETIC_INSECURE_COOKIES === 'Y',
    idField: process.env.HERMETIC_OAUTH_ID_FIELD || defaultIdField,
    rolesField: process.env.HERMETIC_OAUTH_ROLES_FIELD || 'raw.roles',
    roleBasedAcls: process.env.HERMETIC_ROLE_BASED_ACLS === 'Y',
    reportingTokenExpiryHours: parseInt(process.env.HERMETIC_REPORTING_TOKEN_EXPIRY_HOURS || `${(30 * 24)}`, 10),
    rolesForFeatures,
  },
};

export default config;
