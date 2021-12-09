const jwt = require('jsonwebtoken');


class Auth {
    constructo() { }

    encrypt(data) {
        const token = jwt.sign(data, 'abc', { algorithm: 'HS256' })
        return token;
    }

    decrypt(token) {
        try {
            const decoded = jwt.verify(token, 'abc');
            return decoded;

        }
        catch (err) {
            throw err;
        }
    }
}
module.exports = Auth;