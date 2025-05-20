const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    cardNumber: {
        type: String,
        required: true,
        unique: true,
        minlength: 4,
        maxlength: 4,
        match: /^\d{4}$/
    },
    cardHolderName: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        required: true,
        min: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('Account', accountSchema);