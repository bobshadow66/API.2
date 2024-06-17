const expressJwt = require('exoress-jwt');

function authJwt() {
    const secret = process.env.secret;
    return expressJwt({
        secret,
        algorithm: ['HS256'] 
    })
}

module.exports = authJwt; 