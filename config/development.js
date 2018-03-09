
let CLIENT_ID = '__TING_CLIENT_ID_FOR_DEV__';
let CLIENT_SECRET = '__TING_CLIENT_SECRET_FOR_DEV__';
let TOKEN_SIGNING_SECRET = '__TING_TOKEN_SIGNING_SECRET_FOR_DEV__';

let postgresCredentials = {
    host: 'db-95a130d7-0ea5-40c7-ae47-924cf8d7136c.c7uxaqxgfov3.us-west-2.rds.amazonaws.com',
    port: 5432,
    database: 'datacatalog',
    schema: 'ting',
    username: 'us53415z4zpqyf0r',
    password: 'uv17rb7hiihbz2xvvcn2x294r'
};

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

// let postgresCredentials = {
//     host: 'localhost',
//     port: 5432,
//     database: 'postgres',
//     schema: 'ting',
//     username: 'postgres',
//     password: 'postgres'
// };

let blobStoreCredentials = {
    access_key_id: '',
    secret_access_key: '',
    bucket_name: 'dev.uploads',
    host: 'http://localhost:3573',
    url: 'http://localhost:3573/dev.uploads'
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
            schema: postgresCredentials.schema,
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
