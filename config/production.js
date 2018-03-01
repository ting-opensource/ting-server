const cfenv = require('cfenv');

const appEnv = cfenv.getAppEnv();

const CLIENT_ID = process.env.CLIENT_ID || '__TING_CLIENT_ID__';
const CLIENT_SECRET = process.env.CLIENT_SECRET || '__TING_CLIENT_SECRET__';
const TOKEN_SIGNING_SECRET = process.env.TOKEN_SIGNING_SECRET || '__TING_TOKEN_SIGNING_SECRET__';

let postgresCredentials = null;
if(process.env.POSTGRES_CF_SERVICE_NAME)
{
    postgresCredentials = appEnv.getService(process.env.POSTGRES_CF_SERVICE_NAME).credentials;
}

let blobStoreCredentials = null;
if(process.env.BLOBSTORE_CF_SERVICE_NAME)
{
    blobStoreCredentials = appEnv.getService(process.env.BLOBSTORE_CF_SERVICE_NAME).credentials;
}

module.exports = {
    auth: {
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        secret: TOKEN_SIGNING_SECRET
    },
    dataStore: {
        sqlite: {
            filename: './data.sqlite3'
        },
        postgres: {
            host: postgresCredentials.host,
            port: postgresCredentials.port,
            database: postgresCredentials.database,
            schema: postgresCredentials.schema,
            user: postgresCredentials.username,
            password: postgresCredentials.password
        }
    },
    fileStorage: {
        local: {
            location: './uploads'
        },
        blobStore: {
            accessKeyId: blobStoreCredentials.access_key_id,
            secretAccessKey: blobStoreCredentials.secret_access_key,
            region: 'us-west-2',
            bucketName: blobStoreCredentials.bucket_name,
            host: blobStoreCredentials.host,
            url: blobStoreCredentials.url
        }
    }
};
