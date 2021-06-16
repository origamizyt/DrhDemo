const mysql = require('mysql');
const argon2 = require('argon2');

config = {
    host: '49.232.162.128',
    port: 3306,
    user: 'drh_guest',
    password: 'm17FL2lMq0',
    database: 'drh',
    timezone: 'UTC'
}

const Api = {
    _pool: null,
    initialize() {
        this._pool = mysql.createPool(config);
    },
    async _poolGet() {
        return new Promise((resolve, reject) => {
            this._pool.getConnection((err, conn) => {
                if (err) reject(err);
                else resolve(conn);
            });
        })
    },
    async getUserByName(name) {
        const c = await this._poolGet();
        return new Promise((resolve, reject) => {
            c.query('SELECT * FROM users WHERE name = ?', [name], (err, results) => {
                if (err) reject(err);
                else if (results) resolve(results[0]);
                else resolve(null);
            })
        });
    },
    async verifyPassword(provided, hash) {
        return await argon2.verify(hash, provided);
    }
}

module.exports = Api;