// models
const User = require('./../../domain/models/user/user');

// consts
const userConsts = require('./../../domain/models/user/userConsts');

// utilities
const errorProvider = require('./../../infrastructure/utilities/errorProvider');

module.exports = {
    getUsers: async function(req, res) {
        
        let role = req.query.role; 
        let query = {};
        if(role) {
            query.roles = role;
        }

        let users = await User.find(query).exec();

        let parsedUsers = users.map(user => User.parse(user));

        return res.json({users: parsedUsers});
    },

    addRoleToMe: async function(req, res, next) {
        
        let role = req.body.role;
        if(!role || !userConsts.roles[role]){
            errorProvider.throwError(next, 'Provide valid role', req.user._id, 400);
        } else {
            let isUserHaveThisRoleAssigned = req.user.roles.includes(role);
            if(isUserHaveThisRoleAssigned) {
                errorProvider.throwError(next, 'You already have this role!', req.user._id, 400);
            } else {
                req.user.roles.push(role);
                req.user.save();
                return res.json({status: true});
            }
        } 
    }
};