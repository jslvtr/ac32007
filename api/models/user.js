// load the things we need
var bcrypt   = require('bcrypt-nodejs');
var hat      = require('hat');

// define the schema for our user model
var userSchema = {

    local            : {
        email        : String,
        password     : String
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    }

};

// methods
// generating a hash
function generateHash (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

// generating an access token
function generateToken (password) {
    return hat();
}

// checking if password is valid
function validPassword (password) {
    return bcrypt.compareSync(password, this.local.password);
}

// create the model for users and expose it to our app
module.exports = {
    schema: userSchema,
    validPassword: validPassword,
    generateHash: generateHash,
    generateToken: generateToken
};