const mongoose = require('mongoose');

const { Schema } = mongoose;
const serverInfoSchema = new Schema({
    ip: {
        type: String,
        required: true,
        unique: true,
    },
    port: {
        type: String,
        required: true,
    },
    createdAt: {
        type: String,
    },
});

module.exports = mongoose.model('ServerInfo', serverInfoSchema);