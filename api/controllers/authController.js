//core 
const bcrypt = require('bcrypt-nodejs');

//models
const User = require('./../../domain/models/user/user');
const AccessToken = require('./../../domain/models/accessToken/accessToken');

//consts
const userConsts = require('./../../domain/models/user/userConsts');

//utilities
const errorProvider = require('./../../infrastructure/utilities/errorProvider');


module.exports = {
    register: function (req, res, next) {
        const { username, password } = req.body;

        let user = new User({
            username: username,
            password: password,
            roles: [userConsts.roles.NORMAL_USER]
        });

        user.validate() // now we validate the password by real password reqexp
            .then( async () => {
                const passwordHash = bcrypt.hashSync(password, null);
                user.password = passwordHash; // now we save only hash
                await user.save();
                
                return res.json({status: true, message: 'You can log in to account'});
            })
            .catch((error) => {
                errorProvider(next, error.message, null, 400);
            });
    },

    login: async function(req, res, next) {
        
        const { username, password } = req.body;

        const user = await User.findOne({username: username}).exec();
 
        if(!user) {
            errorProvider.throwError(next, 'Not such user with that username', username, 404);
        }

        bcrypt.compare(password, user.password, (error, status) => {
            //wrong password
            if (!status) {
                errorProvider.throwError(next, 'Not such user with that username', {user: user._id, username: username, error: error}, 401);
            }

            //generating tokens, updating user and sending response
            user.generateAccessTokens()
                .then((token) => {
                    
                    user.save().catch((err) => {
                        errorProvider.throwError(next, 'Something went wrong!', {user: user._id, username: username, error: err});
                    });
        
                    return res.json({ token });
                })
                .catch((error) => {
                    errorProvider.throwError(next, 'Some errors ocurred', error);
                });
        });
    },

    showMyTokens: async function(req, res) {
        await req.user.populate('accessTokens').execPopulate();

        let tokens = req.user.accessTokens.map(token => AccessToken.parse(token));

        return res.json({tokens});
    }
};