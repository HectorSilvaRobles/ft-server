const {coachUser} = require('../models/coachSchema');

let auth = (req, res, next) => {
    let token = req.cookies.w_auth;

    coachUser.findByToken(token, (err, user) => {
        console.log('this is the user in auth middleware', user)
        if(err){
            return res.json({error: err})
        }
        if(!user){
            return res.json({
                isAuth: false,
                error: true
            })
        }
        req.token = token;
        req.user = user;
        next()
    })
}

module.exports = {auth}