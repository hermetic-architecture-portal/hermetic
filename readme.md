# Hermetic #
## Introduction ##
Hermetic is a model driven architecture portal.

Users define the model for their environment by editing [YAML](https://en.wikipedia.org/wiki/YAML) files.  Hermetic processes the YAML files to dynamically generate architectural views including value chains, health reports, network diagrams and more.

## Getting started ##
1. Ensure you have node.js v8.x or higher installed
2. Clone this repository:

```shell
# these directions assume Hermetic is installed to /opt/hermetic
# but you can use any other location as needed
$ mkdir /opt/hermetic
$ cd /opt/hermetic
$ git clone git@github.com:hermetic-architecture-portal/hermetic.git
$ cd hermetic/
$ npm install
$ npm run build
$ npm start
```
3. Browse to http://localhost:3001

## Options
Options are specifed as environment variables:
* ```HERMETIC_DATA_BASE_PATH```
  * Default: ```../hermetic/sample-data```
  * This specifies the directory or directories where Hermetic YAML files are stored
  * This can be a single directory or a colon delimited list of directories
* ```REACT_APP_HERMETIC_DEFAULT_PATH```
  * Default: ```/businessRefModel```
  * This specifies the default page the Hermentic web client starts at.  Options are ```/businessRefModel```, ```/techRefModel```, ```/dataRefModel``` or ```/eaRefModel```
* ```HERMETIC_CORS_ORIGIN``` 
  * Default: ```http://localhost:3000```
  * This specifies allowed Cross-Origin Resource Sharing (CORS) origins.  It is only relevant for development purposes.
* ```HERMETIC_PORT```
  * Default: ```3001```
  * This specifies the port to run the Hermetic server on
* ```HERMETIC_RUN_WITH_NO_AUTH```
  * Default: ```false```
  * This setting allows Hermetic to run without any authorisation or authentication when data other than sample data is being served.  Not recommended!
* ```HERMETIC_CUSTOM_PLUGIN_PATH```
  * Default: empty
  * This setting allows you to load custom client and server plugins located at the specified path
* ```HERMETIC_SANDBOX_PATH```
  * Default: ```/tmp/hermetic-sandbox```
  * This specifies the base path where Hermetic Edit sandbox files are stored  

## Using your own model data ##
1. Create a directory at a location of your choice, e.g.: `/opt/hermetic/my-data/`.  If you like you could copy `/opt/hermetic/hermetic/sample-data` as a starting point.
2. Start the Hermetic Validator - this will watch your model directory and warn of any data integrity issues

```shell
$ cd /opt/hermetic/hermetic/server
$ bin/validate.sh /opt/hermetic/my-data/
```
3. Edit the data using the sample data as inspiration.  You may like to use an editor such as [Atom](https://atom.io/) or [Visual Studio Code](https://code.visualstudio.com/).  Note that the file schema can be found in [schema.md](./schema.md).
4. To view the data in Hermetic:

```shell
$ cd /opt/hermetic/hermetic
$ export HERMETIC_DATA_BASE_PATH=/opt/hermetic/my-data
# Hermetic does not ship with any built in authentication
# set the following environment variable to confirm you understand
# this
$ export HERMETIC_RUN_WITH_NO_AUTH=y
$ npm start
```

## Using multiple model data directories ##
Hermetic can combine (deep merge) data from multiple directories.  In this way you can combine manually entered data with data automatically extracted from other systems.

Hermetic accepts a colon delimited list of paths, with paths later in the list having precendence.

Example:

```
# File: /opt/hermetic/my-data/applications.yaml
applications:
  - applicationId: app
    name: The App
    category: My Category
    capabilities: 
      - capabilityId: cap-1
```
```
# File: /opt/hermetic/other-data/applications.yaml
applications:
  - applicationId: app
    category: Other category
    capabilities: 
      - capabilityId: cap-2
    contacts:
      - Some guy
```

when used with

`bin/validate.sh /opt/hermetic/my-data:/opt/hermetic/other-data`

or (for running the Hermetic web app)

`export HERMETIC_DATA_BASE_PATH=/opt/hermetic/my-data:/opt/hermetic/other-data`

will result in:

```
# Resulting model
applications:
  - applicationId: app
    name: The App
    category: Other Category
    capabilities: 
      - capabilityId: cap-1
      - capabilityId: cap-2
    contacts:
      - Some guy      
```

## Production deployment ##
1. In a production deployment you would typically want to have your model data stored in a git repository.
2. Hermetic includes a helper script to synchronise a local git repository against a remote repository, ensuring that model changes that do not pass validation are not imported.
3. Example usage:

```
shell
$ cd /opt/hermetic
$ git clone <my-repo> my-data
```

```
# Example crontab
PATH=/opt/rh/rh-nodejs8/root/usr/bin/:/usr/bin/

* * * * * cd /opt/hermetic/hermetic/server && bin/sync.sh /opt/hermetic/my-data >> /opt/hermetic/cron.log 2>&1
```

## Development ##
1. When developing Hermetic you will probably want to run the client and server in auto-reloading mode:

```shell
$ cd /opt/hermetic/hermetic/client
$ npm start
```

```shell
$ cd /opt/hermetic/hermetic/server
$ npm start
```
2. Any changes to the files under the ```lib``` folder will need to be built to take effect, e.g.:

```shell
$ cd /opt/hermetic/hermetic/lib
$ npm run build
```