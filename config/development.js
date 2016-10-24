module.exports = {
    auth: {
        clientId: '__TING_CLIENT_ID_FOR_DEV__',
        clientSecret: '__TING_CLIENT_SECRET_FOR_DEV__',
        secret: '__TING_TOKEN_SIGNING_SECRET_FOR_DEV__'
    },
    dataStore: {
        sqlite: {
            filename: './dev.sqlite3'
        },
        postgres: {
            host: 'localhost',
            port: 5432,
            database: 'ting',
            user: 'postgres',
            password: 'postgres'
        }
    }
};
