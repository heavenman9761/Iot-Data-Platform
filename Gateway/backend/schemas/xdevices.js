const mongoose = require('mongoose');

const { Schema } = mongoose;
const device = new Schema({
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
        unique: true,
    },
    datakeys: {
        type: String,
    },
    onem2mkeys: {
        type: String,
    },
    createdAt: {
        type: String,
    },
});

module.exports = mongoose.model('Device', device);