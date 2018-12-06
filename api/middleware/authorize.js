//utilities
const errorProvider = require('./../../infrastructure/utilities/errorProvider');


module.exports = function(roles){
    return function(req, res, next) {
        let status = true;
        for(let role of roles) {

            let userHasPermission = req.user.roles.includes(role);
            if(!userHasPermission) {
                status = false;
                break;
            }
        }

        if(status)
            next();
        else
            errorProvider.throwError(next, 'You dont have permission for this action', req.user._id, 401);
    };
};