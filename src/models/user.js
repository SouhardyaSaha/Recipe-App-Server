const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const tokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    }
})

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        validate(email) {
            if (!validator.isEmail(email)) {
                throw new Error('Please enter a valid email address');
            }
        },
        required: true
    },
    password: {
        type: String,
        minlength: 6,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('can not have the term "password"');
            }
        },
        required: true
    },
    tokens: {
        type: [tokenSchema],
        default: []
    }

}, {
    timestamps: true
});

userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;
    delete userObject.__v;

    return userObject;
}

userSchema.methods.generateAuthToken = async function () {

    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '1 hours' });

    user.tokens = await user.tokens.concat({ token });
    await user.updateOne({tokens: user.tokens})

    return token;
}

userSchema.statics.findByCredentials = async (email, password) => {

    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Invalid Credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid Credentials');
    }

    return user;
}

userSchema.pre('save', async function (next) {

    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();

});

userSchema.pre('remove', async function (next) {

    const user = this;

    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;