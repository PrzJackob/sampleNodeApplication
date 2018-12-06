//core
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;
const schema = new Schema({
    token: {
        type: String,
        required: [true, '{PATH} field is required.'],
        unique: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
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

//statics
schema.statics.parse = function(token)
{
    let parsedToken = {};
    parsedToken.token = this.token;
    
    if(token.user && token.user._id)
        parsedToken.user = token.user._id;
    else
        parsedToken.user = token.user;

    parsedToken.created = token.created;

    return token;
};


schema.plugin(uniqueValidator, { message: 'The {PATH} has already been taken.' });
module.exports = mongoose.model('AccessToken', schema);
