const bcrypt = require('bcrypt');

class Bcrypt {
    constructor() {
        this.saltRounds = 10;
    }

    async encryptPassword(password) {
        return new Promise((resolve, reject) => {
            bcrypt.genSalt(this.saltRounds, (err, salt) => {
                if (err) reject(err);
                bcrypt.hash(password, salt, (err, hash) => {
                    if (err) reject(err);
                    resolve(hash);
                });
            });
        });
    }

    async decryptPassword(password, hash) {
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, hash, (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }
}

module.exports = Bcrypt;