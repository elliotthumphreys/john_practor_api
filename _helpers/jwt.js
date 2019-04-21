const expressJwt = require('express-jwt');
const config = require('../_config/config.json');
const userService = require('../users/user.service');

module.exports = jwt;

function jwt() {
    const secret = process.env.SECRET || config.secret;
    return expressJwt({ secret, isRevoked }).unless({
        path: [
            '/users/authenticate',
            /\/images\//i,
            '/hats/:id',
            '/content',
            '/hats',
            '/users/register'
        ]
    });
}

async function isRevoked(req, payload, done) {
    const user = await userService.getById(payload.sub);

    // revoke token if user no longer exists
    if (!user) {
        return done(null, true);
    }

    done();
};