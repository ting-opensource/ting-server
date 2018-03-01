const cfenv = require('cfenv');

const appEnv = cfenv.getAppEnv();

const CLIENT_ID = process.env.CLIENT_ID || '__TING_CLIENT_ID_FOR_STAGE__';
const CLIENT_SECRET = process.env.CLIENT_SECRET || '__TING_CLIENT_SECRET_FOR_STAGE__';
const TOKEN_SIGNING_SECRET = process.env.TOKEN_SIGNING_SECRET || '__TING_TOKEN_SIGNING_SECRET_FOR_STAGE__';

let postgresCredentials = null;
if(process.env.POSTGRES_CF_SERVICE_NAME)
{
    postgresCredentials = appEnv.getService(process.env.POSTGRES_CF_SERVICE_NAME).credentials;
}
else
{
    postgresCredentials = {
        host: 'localhost',
        port: 5432,
        database: 'ting',
        schema: 'ting',
        username: 'postgres',
        password: 'postgres'
    };
}

let blobStoreCredentials = null;
if(process.env.BLOBSTORE_CF_SERVICE_NAME)
{
    blobStoreCredentials = appEnv.getService(process.env.BLOBSTORE_CF_SERVICE_NAME).credentials;
}
else
{
    blobStoreCredentials = {
        access_key_id: '',
        secret_access_key: '',
        bucket_name: 'stage.uploads',
        host: 'http://localhost:3573',
        url: 'http://localhost:3573/stage.uploads'
    };
}

module.exports = {
    auth: {
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        secret: TOKEN_SIGNING_SECRET
    },
    dataStore: {
        sqlite: {
            filename: './stage.sqlite3'
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
            location: './stage.uploads'
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
