const cfenv = require('cfenv');

const appEnv = cfenv.getAppEnv();

module.exports = {
    host: '0.0.0.0',
    port: appEnv.port || 9999,
    auth: {
        clientId: '__TEST_CLIENT_ID__',
        clientSecret: '__TEST_CLIENT_SECRET__',
        secret: 'TOKEN_SIGNING_SECRET'
    }
};
