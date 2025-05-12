const { Client } = require('pg');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

let client;

if (process.env.ENVIRONMENT === 'dev') {
    // SQLite connection for development
    const dbPath = path.join(__dirname, 'database.db');
    client = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error('Error connecting to SQLite database:', err);
        } else {
            console.log('Connected to SQLite database');
        }
    });

    // Wrap SQLite methods to match PostgreSQL's Promise-based interface
    client.query = function(text, params) {
        return new Promise((resolve, reject) => {
            this.all(text, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({ rows });
                }
            });
        });
    };
} else {
    // PostgreSQL connection for production
    client = new Client('postgres://postgres:postgres@localhost:5432/sagrasanbellino');
    client.connect()
        .then(() => console.log('Connected to PostgreSQL database'))
        .catch(err => console.error('Error connecting to PostgreSQL database:', err));
}

module.exports = { client };