const User = require('./../domain/models/user/user');
const userConsts = require('./../domain/models/user/userConsts');

const bcrypt = require('bcrypt-nodejs');



User.find({})
    .then((docs) => {
        if(docs.length === 0) {
            let hashedPassword = bcrypt.hashSync('Admin123', null);
            console.log(hashedPassword);
            let user = new User({
                username: 'Admin',
                password: hashedPassword,
                roles: [userConsts.roles.ADMIN]
            });    

            user.save()
                .then(() => console.log('Admin with username: "Admin" and password: "Admin123" created'))
                .catch(error => console.error(error));
            
        }
    })
    .catch(error => console.error(error));