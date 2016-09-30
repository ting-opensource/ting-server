const cfenv = require('cfenv');

const appEnv = cfenv.getAppEnv();

const POSTGRES_CF_SERVICE_NAME = process.env.POSTGRES_CF_SERVICE_NAME;

let postgresCredentials = null;
if(POSTGRES_CF_SERVICE_NAME)
{
    postgresCredentials = appEnv.getService(POSTGRES_CF_SERVICE_NAME).credentials;
}

module.exports = {
    dataStore: {
        sqlite: {
            filename: './prod.sqlite3'
        },
        postgres: {
            host: postgresCredentials.host,
            port: postgresCredentials.port,
            database: postgresCredentials.database,
            user: postgresCredentials.username,
            password: postgresCredentials.password
        }
    }
};
