const getStore = (session) => {
    if (process.env.PROD) {
        const Sequelize = require('sequelize');
        const db = new Sequelize(
            `${process.env.DATABASE_URL}?ssl=true&sslfactory=org.postgresql.ssl.NonValidatingFactory`
        );
        const DBStore = require('connect-session-sequelize')(session.Store);
        const store = new DBStore({ db });
        return {
            resave: false,
            saveUninitialized: true,
            store,
        };
    }

    else {
        const DBStore = require('connect-mongodb-session')(session);
        const store = new DBStore({
            uri: 'mongodb://localhost:27017/connect_mongodb_session_test',
            collection: 'mySessions',
        });
        return {
            resave: true,
            saveUninitialized: true,
            store,
        };
    }
}


module.exports = getStore;
