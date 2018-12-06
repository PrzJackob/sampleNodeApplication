//core 
const JWT = require('jsonwebtoken');
const config = process.env;
const async = require('async');

//models
const AccessToken = require('./../../domain/models/accessToken/accessToken');

//utilities
const errorProvider = require('./../../infrastructure/utilities/errorProvider');


module.exports = function(req, res, next)
{
    //getting token
    const token = req.headers['x-access-token'] || req.query['access-token'] || req.body['access-token'];

    async.parallel({
        //token verification
        token: (callback) => {
            JWT.verify(token, config.SECRET_AUTH , (error) => {
                //error handle
                if(error && !res.headersSent)
                {
                    if(error.name == 'TokenExpiredError')
                        errorProvider(next, 'Access token expired', {token, error}, 401);

                    errorProvider(next, 'Access Denied', {token, error}, 401);
                }

                callback(null);
            });
        },

        //checking if token is assigned to user
        user: (callback) => {
            AccessToken.findOne({token: token}).populate('user').then((accessToken) => {

                if(!accessToken && !res.headersSent) {
                    errorProvider.throwError(next, 'Access Denied', token, 401);
                } else {
                    callback(null, accessToken.user);
                }
            });
        }
    }, (error, result) => {
        if(result && !res.headersSent)
        {
            req.user = result.user;
            next();
        }
    });
};
