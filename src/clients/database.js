const mysql = require('mysql2/promise');
global.globalConnection =  null; // global database connection variable

class Database {
    constructor() {};

    async getConnection() {
        if (globalConnection) return globalConnection;
        else {
            const newConnection = await mysql.createPool({
                host: '127.0.0.1',
                user: 'parmeet',
                password: 'parmeet123',
                database: 'parmeet_local',
                waitForConnections: true,
                connectionLimit: 3,
                queueLimit: 0
              });
              globalConnection = newConnection;
              return globalConnection;
        }
    }
}

module.exports = Database;