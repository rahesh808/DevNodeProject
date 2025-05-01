const  mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:4
    },
    lastName:{
        type:String,

    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        index: true,
        lowercase:true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }

    },
    password: {
        type:String,
        required:true,
        
        
    },
    age:{
        type:Number,
        min: 18
    },
    gender:{
        type:String,
        validate: {
            validator: function (value) {
                return ['male', 'female', 'other'].includes(value);
            },
            message: 'Gender must be male, female, or other'
        }
    },
    photoUrl:{
        type:String,
        default: "https://media.istockphoto.com/id/1430978895/photo/portrait-of-excited-elegant-man.jpg?s=612x612&w=0&k=20&c=E0cHFmMd6-5HURg2_w5m9vnl-nv15Tx_otEt6IUsQVs=",
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error('Invalid URL')
            }
        }
    }, about: {
        type:String,
        default:"This is a default about of the user"
    },
    skills:{
        type:[String]
    }

}, {
    timestamps: true
})

userSchema.methods.getJWT = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    return token;
}

userSchema.methods.checkValidPassword = async function (password) {
    const user = this;
    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch;
}

const User = mongoose.model('User',userSchema);
module.exports = User;