const expressJwt = require('express-jwt');
const config = require('../_config/config.json');
const userService = require('../users/user.service');

module.exports = jwt;

function jwt() {
    const secret = process.env.SECRET || config.secret;
    return expressJwt({ secret, isRevoked }).unless({
        path: [
            {
                url: '/content',
                methods: ['GET']
            },
            {
                url: '/hats',
                methods: ['GET']
            },
            {
                url: '/hats/:id',
                methods: ['GET']
            },
            {
                url: '/users/register',
                methods: ['POST']
            },
            {
                url: '/users/authenticate',
                methods: ['POST']
            }
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