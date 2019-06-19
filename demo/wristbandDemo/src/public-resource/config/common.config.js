const buildFileConfig = require('configDir/build-file.config');
const moduleExports = {
  DIRS: {
    BUILD_FILE: buildFileConfig
  },

  PAGE_ROOT_PATH: '../../'
};

/* Help determine the proxy file for CORS under IE */
// moduleExports.DIRS.SERVER_API_URL = moduleExports.SERVER_API_URL;

/* global IS_PRODUCTION:true */ // Since ESLint will detect undefined variables, this `global` annotation is required to declare that IS_PRODUCTION is a global variable (of course not in this case) to circumvent warning.
if (IS_PRODUCTION) { // Since this scaffold does not involve HTTP requests, it is only used as a demonstration for a separate development/production environment.
  moduleExports.API_ROOT = 'http://api.xxxx.com/';
} else {
  moduleExports.API_ROOT = 'http://localhost/mock/';
}

module.exports = moduleExports;
