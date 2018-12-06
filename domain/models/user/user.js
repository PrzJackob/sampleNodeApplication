//core
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const JWT = require('jsonwebtoken');
const config = process.env;

//consts
const userConsts = require('./userConsts');

//utilities
const validators = require('./../validators');

const Schema = mongoose.Schema;

const schema = new Schema({
    username: {
        type: String,
        required: [true, '{PATH} field is required.'],
        unique: true
    },
    password: {
        type: String,
        required: [true, '{PATH} field is required.'],
        validate: validators.password
    },
    accessTokens: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'AccessToken',
        }
    ],
    status: {
        type: String,
        enum: Object.values(userConsts.statuses),
        default: userConsts.statuses.CREATED
    },
    roles: [
        {
            type: String,
            required: true,
            enum: Object.values(userConsts.roles),
        }
    ],
    created: {
        type: Date,
        default: Date.now()
    },
    updated: {
        type: Date,
        default: Date.now()
    },
}, { usePushEach: true });

schema.pre('save', function(next)
{
    //dates handle
    if(this.isNew)
        this.created = new Date();

    this.updated = new Date();

    next();
});

schema.methods.generateAccessTokens = function()
{
    return new Promise ((resolve, reject) => {
        const AccessToken = require('./../accessToken/accessToken');
        const accessTokenConsts = require('./../accessToken/tokensConsts');
        const dateInMinutes = Math.floor(Date.now() / 1000);
        const token = JWT.sign({
            exp: dateInMinutes + (60 * 60 * 24 * accessTokenConsts.EXPIRATION_DAYS),
            data: {
                _id: this._id,
                username: this.username
            }
        }, config.SECRET_AUTH);
    
        const accessToken = new AccessToken({
            token: token,
            user: this._id
        });
    
        accessToken.save()
            .then((accessToken) => {
                this.accessTokens.push(accessToken._id);
                resolve(accessToken.token);
            })
            .catch(err => {
                reject(err);
            });
    });
    
};

schema.statics.parse = function(user)
{
    let parsedUser = {};
    parsedUser._id = user._id;
    parsedUser.name = user.username;
    parsedUser.roles = user.roles.map(role => role);
    parsedUser.status = user.status;

    
    let now = new Date();
    let wasUpdatedInLastTenMinutes = now.getTime() - user.updated.getTime() <= 1000 * 60 * 10; 
    parsedUser.reallyActiveUser = wasUpdatedInLastTenMinutes;

    return parsedUser;
};


schema.plugin(uniqueValidator, { message: 'The {PATH} has already been taken.' });
module.exports = mongoose.model('User', schema);
