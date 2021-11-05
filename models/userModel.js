const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        lowercase: true,
        required: true,
        trim: true,
        unique: true,
        //validate: validator.isEmail
        //validate: function(email){} == validate(email){}
        validate(email) {
            if (!validator.isEmail(email)) {
                throw new Error("Inavalid email!");
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    }
});

userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    return user;
};

const User = mongoose.model("user", userSchema);

module.exports = User;
