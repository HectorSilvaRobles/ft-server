const express = require('express');
const router = express.Router();
const { coachUser} = require('../models/coachSchema');
const bcrypt = require('bcryptjs');
const saltRounds = 10;

const {auth} = require('../middleware/auth');

// Authenticate user token
router.get('/auth', auth, (req, res) => {
    console.log('this is the req.user in /auth endpoint', req.user)
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.accountRole === 'admin' ? true : false,
        isAuth: true,
        email: req.user.email,
        firstname: req.user.firstname,
        lastname: req.user.lastname,
        accountRole: req.user.accountRole,
        profile_pic: req.user.profile_pic
    })
})


// Register new coach user (api endpoint)
router.post('/register', (req, res) => {
    const coach_user = new coachUser(req.body);

    coach_user.save((err, doc) => {
        if(err){
            return res.status(404).json({
                message: 'there was an error with creating new user',
                error: err
            })
        }


        // Generate Token
        coach_user.generateToken((err, user) => {
            if(err){
                return res.status(400).send(err)
            }

            res.cookie('w_authExp', user.tokenExp);
            res.cookie('w_auth', user.token).status(200).json({
                loginSuccess: true,
                user: user
            })
        })
    })
})



// Login coach users (api endpoint)
router.post('/login', (req, res) => {
    // find the coach user's email
    coachUser.findOne({email: req.body.email}, (err, user) => {
        if(!user){
            return res.status(404).json({
                loginSucess: false,
                message: 'login failed, email not found'
            })
        }

        // compare password
        user.comparePassword(req.body.password, (err, isMatch) => {
            if(!isMatch){
                return res.status(404).json({
                    loginSuccess: false,
                    message: 'login failed, wrong password entered'
                })
            }

            // generate token 
            user.generateToken((err, user) => {
                if(err){
                    return res.status(400).send(err)
                }
                console.log('the user in login user', user)
                res.cookie("w_authExp", user.tokenExp);
                res.cookie("w_auth", user.token).status(200).json({
                    loginSuccess: true,
                    user: user
                })
            })
        })
    })
})



// Logout user (api endpoint)
router.get('/logout', auth, (req, res) => {
    coachUser.findOneAndUpdate({_id: req.user._id}, {token: '', tokenExp: ''}, (err, doc) => {
        if(err){
            return res.status(404).json({
                sucess: false,
                error: err
            })
        }

        return res.status(200).send({
            success: true,
            message: 'successfully logged out'
        })
    })
})



// Update coach user's information in database
router.put('/update-coach/:coach_id', (req, res) => {
    var param = req.params.coach_id

    // If coach user is updating password run this code so we can properly hash the new password
    if(req.body.password){
        bcrypt.genSalt(saltRounds, (err, salt) => {
            if(err){
                return res.status(400).json({
                    success: false,
                    message: 'Could not generate salt for password',
                    error: err
                })
            }

            bcrypt.hash(req.body.password, salt, function(err, hash){
                if(err){
                    return res.status(400).json({
                        success: false,
                        message: 'Could not hash your password',
                        error: err
                    })
                }

                req.body.password = hash
                coachUser.findByIdAndUpdate(param, req.body, (err, update_coach) => {
                    if(err){
                        return res.status(400).json({
                            success: false,
                            message: 'Could not update your information',
                            error: err
                        })
                    }

                    return res.status(200).json({
                        success: true,
                        message: 'Successfully updated your password'
                    })
                })
            })
        })
    } else {
        // Does not include a password change

        coachUser.findByIdAndUpdate(param, req.body, (err, updated_coach) => {
            if(err){
                return res.status(400).json({
                    success: false,
                    message: 'Could not update your information',
                    error: err
                })
            }

            return res.status(200).json({
                success: true,
                message: "Successfully updated your information",
                updatedInfo: req.body,
                old_info: updated_coach
            })
        })
    }
})


module.exports = router;