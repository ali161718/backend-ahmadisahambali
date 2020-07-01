const mongoose = require('mongoose');
require('mongoose-type-email');

const UsersSchema = mongoose.Schema({
    userName: {
        type: String,
        require: false
    },
    accountNumber: {
        type: Number,
        require: false
    },
    emailAddress: {
        type: mongoose.SchemaTypes.Email,
        require: false
    },
    identityNumber: {
        type: Number,
        require: false
    } 
});

module.exports = mongoose.model('Users', UsersSchema);