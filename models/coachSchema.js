const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const coachSchema = mongoose.Schema({
    profile_pic: {
        type: String
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minglenght: 5
    },
    lastname: {
        type: String,
        maxlength: 70
    },
    firstname: {
        type: String,
        maxlength: 70
    },
    token: {
        type: String,
    },
    tokenExp: {
        type: Number
    },
    accountRole: {
        type: String
    }
})


// Hashing User Passwords
coachSchema.pre('save', function(next){
    var user = this;

    // only hash the password if it has been modified or is new
    if(user.isModified('password')){
        console.log('password has been modified');

        // Generate a salt
        bcrypt.genSalt(saltRounds, (err, salt) => {
            if(err){
                return next(err)
            }

            // Hash the password along with our new salt
            bcrypt.hash(user.password, salt, function(err, hash){
                if(err){
                    return next(err)
                }
                user.password = hash
                next();
            })
        })
    } else {
        next()
    }
});


// Password Verification
coachSchema.methods.comparePassword = function(candidatePassword, cb){
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
        if(err){
            return cb(err)
        }
        cb(null, isMatch);
    });
};


// Generating Auth Tokens
coachSchema.methods.generateToken = function(cb){
    var user = this;
    var token = jwt.sign(user._id.toHexString(), 'secret');

    user.token = token;
    user.save(function(err, user){
        console.log('this is user in schema method', user)
        if(err){
            return cb(err);
        }
        cb(null, user);
    });
};

coachSchema.statics.findByToken = function(token, cb){
    var user = this;
    jwt.verify(token, 'secret', function(err, decode){
        user.findOne({"_id":decode, "token": token}, function(err, user){
            if(err){
                return cb(err)
            }
            cb(null, user)
        })
    })
}

const coachUser = mongoose.model('Coach_User', coachSchema);

module.exports = { coachUser }
