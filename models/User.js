const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['student', 'admin'],
        default: 'student'
    },
    group: {
        type: String,
        enum: ['vs', 'kd', 'is', 'isp', 'kd', 'SYSt'],
        required: true
    },
    taotlus: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'taotlus'
    },
    date: {
        type: Date,
        default: Date.now
    }
})

UserSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

UserSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({ id: this._id }, config.get('jwtSecret'), {
        expiresIn: config.get('jwt_expire')
    })
}

UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

module.exports = User = mongoose.model('User', UserSchema);