const Auth = require('../utils/auth');

class AuthMiddleware {
    constructor() { }

    authFilter(req,res,next) {

        const { token } = req.headers;
        if (!token) {
            res.status(401).send({ message: "unauthorized to perform this operation" });
        }
        try {
            const decodedToken = new Auth().decrypt(token);
            req.user = decodedToken;
            next();

        }
        catch (err) {
            console.log(err);
            res.status(500).send({ message: "oops something wentwrong try again" });
        }
    }
}
module.exports = AuthMiddleware;