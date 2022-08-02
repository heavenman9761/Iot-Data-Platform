const mongoose = require('mongoose');

const { Schema } = mongoose;
const user = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    saupja: {
        type: String,
        required: true,
        unique: true,
    },
    saupjaname: {
        type: String,
        required: true,
    },
    tel: {
        type: String,
        required: true,
    },
    createdAt: {
        type: String,
    },
});

module.exports = mongoose.model('User', user);