module.exports = {
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
