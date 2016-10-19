const cfenv = require('cfenv');

const appEnv = cfenv.getAppEnv();

module.exports = {
    host: '0.0.0.0',
    port: appEnv.port || 9999
};
