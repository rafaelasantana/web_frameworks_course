const mongoose = require('mongoose');

// define UserSchema with email, password, token
const UserSchema = new mongoose.schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    token: {
        type: String,
        default: null
    }
});

// create User model
const User = mongoose.model('User', UserSchema);

// export User model
module.exports = User;