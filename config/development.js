const cfenv = require('cfenv');

const appEnv = cfenv.getAppEnv();

const CLIENT_ID = '__TING_CLIENT_ID_FOR_DEV__';
const CLIENT_SECRET = '__TING_CLIENT_SECRET_FOR_DEV__';
const TOKEN_SIGNING_SECRET = '__TING_TOKEN_SIGNING_SECRET_FOR_DEV__';

let postgresCredentials = {
    host: 'localhost',
    port: 5432,
    database: 'ting',
    username: 'postgres',
    password: 'postgres'
};

let blobStoreCredentials = {
    access_key_id: '',
    secret_access_key: '',
    bucket_name: 'dev.uploads',
    host: 'localhost:3573',
    url: 'http://localhost:3573'
};

module.exports = {
    auth: {
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        secret: TOKEN_SIGNING_SECRET
    },
    dataStore: {
        sqlite: {
            filename: './dev.sqlite3'
        },
        postgres: {
            host: postgresCredentials.host,
            port: postgresCredentials.port,
            database: postgresCredentials.database,
            user: postgresCredentials.username,
            password: postgresCredentials.password
        }
    },
    fileStorage: {
        local: {
            location: './dev.uploads'
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
