# Hermetic #
## Introduction ##
Hermetic is a model driven architecture portal.

Users define the model for their environment by editing [YAML](https://en.wikipedia.org/wiki/YAML) files, either directly or through a web UI.  Hermetic processes the YAML files to dynamically generate architectural views including value chains, health reports, network diagrams and more.

## Demo Site ##
https://hermetic.azurewebsites.net

## Screenshots ##

<img src="doc/img/screenshot-brm.png?raw=true" height="500">
<img src="doc/img/screenshot-trm.png?raw=true" height="500">
<img src="doc/img/screenshot-drm.png?raw=true" height="500">
<img src="doc/img/screenshot-technical.png?raw=true" height="500">
<img src="doc/img/screenshot-component.png?raw=true" height="500">

## Getting started ##
You can run Hermetic on a host with Node.js, or use the [Docker container](https://hub.docker.com/r/hermeticarchitectureportal/hermetic)

### With Docker ###
```shell
docker run --rm -p 3001:3001 hermeticarchitectureportal/hermetic
# Browse to http://localhost:3001
```

### With Node.js ###
* In some cases you may need to install the [node-gyp dependencies](https://github.com/nodejs/node-gyp#installation)

```shell
# these directions assume Hermetic is installed to /opt/hermetic
# but you can use any other location as needed
mkdir /opt/hermetic
cd /opt/hermetic
git clone git@github.com:hermetic-architecture-portal/hermetic.git
cd hermetic/
npm install
npm run build
npm start
```

* Browse to http://localhost:3001

## Using your own model data ##

### With Docker

```shell
cd /opt/hermetic
# copy the sample data to your own working directory to start with
git clone git@github.com:hermetic-architecture-portal/hermetic.git
cp -r hermetic/sample-data my-data
# make an empty directory to hold the editing 'sandboxes'
mkdir my-sandboxes
# make sure the container user can access the data directories
chown -R +222  my-*
# note the following runs with no authentication which is unsafe in 
# most cases
docker run -p 3001:3001 \
  -e HERMETIC_DATA_BASE_PATH=/data \
  -e HERMETIC_SANDBOX_PATH=/sandboxes \
  -e HERMETIC_RUN_WITH_NO_AUTH=Y \
  -v /opt/hermetic/my-data:/data \
  -v /opt/hermetic/my-sandboxes:/sandboxes \
  hermeticarchitectureportal/hermetic
```

### With Node.js

```shell
cd /opt/hermetic
# copy the sample data to your own working directory to start with
cp -r hermetic/sample-data my-data
mkdir my-sandboxes
cd /opt/hermetic/hermetic
export HERMETIC_DATA_BASE_PATH=/opt/hermetic/my-data
export HERMETIC_SANDBOX_PATH=/opt/hermetic/my-sandboxes
# You would want to set up authentication at some point but
# the following would get you going in development
export HERMETIC_RUN_WITH_NO_AUTH=y
npm start
```

### Editing tips

* You can either edit the data in ```my-data``` directly using a text editor (with reference to the ```schema.md``` document), or use the web editing UI as follows.
* In the Hermetic web UI, select ```Edit``` from the main menu
* ```Add``` and ```Select``` a new sandbox
* Browse and edit data entities from the ```Entities``` menu
* Saved changes are reflected in the main Hermetic web UI (you may have to manually refresh pages to see them)
* Only you (or any other editor who selects your sandbox can see the changes)
* Hermetic uses a git workflow to publish changes.  Your data directory (```my-data```) must be set up as a git repository with a remote repository server configured for this to work.

## Configuration Reference
Configuration settings are supplied as environment variables

### Data Settings
* ```HERMETIC_DATA_BASE_PATH```
  * Default: ```../hermetic/sample-data```
  * This specifies the directory or directories where Hermetic YAML files are stored
  * This can be a single directory or a colon delimited list of directories
  * The default setting is only suitable for running in demo mode
* ```HERMETIC_SANDBOX_PATH```
  * Default: ```undefined```
  * This specifies the base path where Hermetic Edit sandbox files should be stored
  * Editing functionality is disabled unless this variable is set
* ```HERMETIC_LIVE_EDITING```
  * Default: ```N```
  * When set to ```Y``` allows users to edit data in the main data directory
  * without use of sandboxes.  This mode is not recommended.

### UI Settings  
* ```REACT_APP_HERMETIC_DEFAULT_PATH```
  * Default: ```/businessRefModel```
  * This specifies the default page the Hermentic web client starts at.  Options are ```/businessRefModel```, ```/techRefModel```, ```/dataRefModel``` or ```/eaRefModel```
* ```HERMETIC_CUSTOM_SASS_PATH```
  * Default: ```undefined```
  * Specifies a path relative to the hermetic/client folder to load custom SCSS style files from
  * See documentation on [customisation](#Customisation) below.
* ```HERMETIC_EDIT_PAGE_SIZE```
  * Default: ```10```
  * Number of items to show per page in the editing UI

### General
* ```HERMETIC_PORT```
  * Default: ```3001```
  * This specifies the port to run the Hermetic server on
* ```HERMETIC_DEBUG_CLIENT```
  * Default: ```N```
  * When set to ```Y```, the Hermetic server proxies HTML/CSS/JS content from localhost:3000 (i.e. the Create React App dev server), rather than serving compiled client files.
* ```HERMETIC_HELP_FILES_PATH```
  * Default: ```../help/build```
  * Enables you to serve a different set of help files from those provided with Hermetic

### Authentication
Hermetic supports the following authentication mechanisms:
* For the client UI, you can use an OAuth2 provider (Azure AD, Google etc.) of your choice
* Refer to the documentation for [Bell](https://hapi.dev/module/bell/providers/) to find out about provider-specific configuration
* The reporting API is secured by cryptographic tokens which authenticated users can obtain from the client UI

By default Hermetic runs with no authentication, and refuses to start with anything other than the demo data directory.

* ```HERMETIC_RUN_WITH_NO_AUTH```
  * Default: ```N```
  * If ```Y``` this setting allows Hermetic to run with user data and/or editing mode without any authorisation or authentication.  This is only suitable for development purposes.
* ```HERMETIC_OAUTH_PROVIDER```
  * Default: ```undefined```, i.e. no authentication
  * The ID of the Bell provider option to use (e.g. ```azure-legacy```, ```github```, ```facebook```)
* ```HERMETIC_OAUTH_CLIENT_ID```
  * Default: ```undefined```
  * This is the client/application ID you recieve from your OAuth2 provider when registering Hermetic as an application
* ```HERMETIC_OAUTH_CLIENT_SECRET```
  * Default: ```undefined```
  * This is the client/application secret you recieve from your OAuth2 provider when registering Hermetic as an application.
* ```HERMETIC_OAUTH_ID_FIELD```
  * Default: ```raw.upn``` for ```azure-legacy```, ```id``` for all other providers
  * This is the location of the field which holds the username in the profile response from the OAuth provider.  The ```id``` field is supplied for all providers but may hold a non-user-friendly internal ID - in which case you will need to investigate another suitable field
* ```HERMETIC_INSECURE_COOKIES```
  * Default: ```N```
  * When running Hermetic in development with authentication but without HTTPS you will need to set this to ```Y```.  Don't set this to ```Y``` in production
* ```HERMETIC_COOKIE_SECRET```
  * Default: random 32 character string
  * This is the secret used to sign session cookies and reporting API tokens.  The default is secure but will change each time you restart the server, which will expire any existing cookies and tokens.  In production you would want to specify a fixed 32 character string.  You could generate one on Linux with ```pwgen 32 -y```
* ```HERMETIC_OAUTH_PROVIDER_LOGOUT_URL```
  * Default: for ```azure-legacy``` defaults to the appropriate URL for your tenant.  ```undefined``` for other providers
  * Optionally use this variable to specify an URL that Hermetic should redirect the user to to log them out of the OAuth provider as well as Hermetic
* ```HERMETIC_REPORTING_TOKEN_EXPIRY_HOUvarRS```
  * Default: ```720``` (30 days)
  * Specifies how long the Reporting API tokens should last for
* ```HERMETIC_OAUTH_PROVIDER_CONFIG_<SETTING>```
  * Default: ```undefined```
  * Any OAuth provider specific configuration can be supplied using a number of arbitrary ```HERMETIC_OAUTH_PROVIDER_CONFIG_<SETTING>``` variables.  E.g. to supply a provider specific configuration field of ```domain``` you would supply an environment variable ```HERMETIC_OAUTH_PROVIDER_CONFIG_DOMAIN```
* ```HERMETIC_ROLE_BASED_ACLS```
  * Default: ```N```
  * Specifies whether Hermetic should enforce role based permissions (RBACL), or allow any authenticated user full access (the default).  varofile supplied by the provider that holds user roles or groups.  Required for RBACL to work
* ```HERMETIC_OAUTH_ROLES_FOR_FEATURE_CORE```
  * Default: ```BasicAccess,TechDetailsAccess```
  * When RBACL is in use, this setting identifies the user role(s) which grant permission to the ```core``` feature set.  If the user is a member of one or more of the specified roles (as configured with the OAuth provider), they get access to the feature
* ```HERMETIC_OAUTH_ROLES_FOR_FEATURE_TECH_DETAILS```
  * Default: ```TechDetailsAccess```
  * When RBACL is in use, this setting identifies the user role(s) which grant permission to the ```techDetails``` feature set.  
* ```HERMETIC_OAUTH_ROLES_FOR_FEATURE_TECHNOLOGY_HEALTH_METRICS```
  * Default: ```TechDetailsAccess```
  * When RBACL is in use, this setting identifies the user role(s) which grant permission to the ```technologyHealthMetrics``` feature set.  
* ```HERMETIC_OAUTH_ROLES_FOR_FEATURE_CAPABILITY_HEALTH_METRICS```
  * Default: ```TechDetailsAccess```
  * When RBACL is in use, this setting identifies the user role(s) which grant permission to the ```capabilityHealthMetrics``` feature set.
* ```HERMETIC_OAUTH_ROLES_FOR_FEATURE_CAPABILITY_RESOURCING```
  * Default: ```TechDetailsAccess```
  * When RBACL is in use, this setting identifies the user role(s) which grant permission to the ```capabilityResourcing``` feature set.
* ```HERMETIC_OAUTH_ROLES_FOR_FEATURE_EA_HEALTH_METRICS```
  * Default: ```TechDetailsAccess```
  * When RBACL is in use, this setting identifies the user role(s) which grant permission to the ```eaHealthMetrics``` feature set.
* ```HERMETIC_OAUTH_ROLES_FOR_FEATURE_EDIT```
  * Default: ```EditDataAccess```
  * When RBACL is in use, this setting identifies the user role(s) which grant permission to the ```edit``` feature set.
* ```HERMETIC_OAUTH_ROLES_FOR_FEATURE_REPORTING```
  * Default: ```TechDetailsAccess```
  * When RBACL is in use, this setting identifies the user role(s) which grant permission to the ```reporting``` feature set.

## Production deployment ##
1. In a production deployment you would typically want to have your model data stored in a git repository.
2. Hermetic includes a helper script to synchronise a local git repository against a remote repository, ensuring that model changes that do not pass validation are not imported.
3. Example usage:

```shell
cd /opt/hermetic
git clone <my-repo> my-data
```

```
# Example crontab
PATH=/opt/rh/rh-nodejs8/root/usr/bin/:/usr/bin/

* * * * * cd /opt/hermetic/hermetic/server && bin/sync.sh /opt/hermetic/my-data >> /opt/hermetic/cron.log 2>&1
```

## Development ##
1. When developing Hermetic you will probably want to run the client and server seperately.  In this mode both automatically rebuild when you save changes.

```shell
cd /opt/hermetic/hermetic/client
npm start
```

```shell
cd /opt/hermetic/hermetic/server
export HERMETIC_DEBUG_CLIENT=Y
npm start
```

2. Note that you will need to browse to http://localhost:3001, not http://localhost:3000 if you have any authentication configured.  The server (at 3001) will proxy requests for client files to the client dev server (at 3000).
3. Any changes to the files under the ```lib``` folder will need to be manually built to take effect, e.g.:

```shell
cd /opt/hermetic/hermetic/lib
npm run build
```

## Customisation ##

### Theming
* Basic theming allows you to change the colour scheme and a few items of cosmetic text
* Any of the variables (starting with ```$```) in [App.scss](https://github.com/hermetic-architecture-portal/hermetic/blob/master/client/src/styles/App.scss) can be customised

```shell
cd /opt/hermetic
mkdir my-styles
echo '$font-family: comic-sans' > my-styles/CustomVariables.scss
cd hermetic
export HERMETIC_CUSTOM_SASS_PATH=/opt/hermetic/my-styles
npm run build
npm start
```
### Custom CSS
* You can override any existing CSS styles by supplying your own CSS that will be loaded after the standard CSS
* This form of customisation is much more likely to break when Hermetic is upgraded than theming

```shell
cd /opt/hermetic
mkdir my-styles
echo 'body { background-color: red !important}' > my-styles/CustomStyles.scss
cd hermetic
export HERMETIC_CUSTOM_SASS_PATH=/opt/hermetic/my-styles
npm run build
npm start
```
