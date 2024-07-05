const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String, 
        required: true,
    },
    passwordHash: { // Corrected case
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    street: {
        type: String,
        default: '', // Corrected typo
    },
    apartment: {
        type: String,
        default: '', // Corrected typo
    },
    zip: {
        type: String,
        default: '',
    },
    city: {
        type: String,
        default: '',
    },
    country: {
        type: String,
        default: '',
    }
});

userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

userSchema.set('toJSON', {
    virtuals: true,
});

module.exports = mongoose.model('User', userSchema);
