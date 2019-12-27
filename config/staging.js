const cfenv = require('cfenv');
const appEnv = cfenv.getAppEnv();

let CLIENT_ID = '';
let CLIENT_SECRET = '';
let TOKEN_SIGNING_SECRET = '';

let postgresCredentials = {};

if(process.env.VCAP_SERVICES)
{
    const props = process.env.VCAP_SERVICES;
    const propsJson = JSON.parse(props);
    const cups = propsJson['user-provided'][0].credentials;

    CLIENT_ID = cups['dcat.cups.notification.clientId'];
    CLIENT_SECRET = cups['dcat.cups.notification.clientSecret'];
    TOKEN_SIGNING_SECRET = cups['dcat.cups.notification.tokenSigningSecret'];

    postgresCredentials = {
        host: cups['dcat.cups.postgres.host'],
        port: cups['dcat.cups.postgres.port'],
        database: cups['dcat.cups.postgres.database'],
        schema: cups['dcat.cups.postgres.notificationSchema'],
        username: cups['dcat.cups.postgres.username'],
        password: cups['dcat.cups.postgres.password']
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
