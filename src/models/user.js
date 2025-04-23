const  mongoose = require('mongoose');
const validator = require('validator');

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

const User = mongoose.model('User',userSchema);
module.exports = User;