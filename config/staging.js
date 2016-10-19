module.exports = {
    auth: {
        clientId: '__TING_CLIENT_ID_FOR_STAGE__',
        clientSecret: '__TING_CLIENT_SECRET_FOR_STAGE__',
        secret: '__TING_TOKEN_SIGNING_SECRET_FOR_STAGE__'
    },
    dataStore: {
        sqlite: {
            filename: './stage.sqlite3'
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
