module.exports = {
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
