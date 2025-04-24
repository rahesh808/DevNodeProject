const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');
const { userAuth } = require('./middlewares/auth');
const bcrypt = require('bcrypt');
const  {isAllowedToUpdate, validateSkills,validateSignup} = require('./utils/validate');

const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const app = express();


app.use(express.json());
app.use(cookieParser());
app.post('/signup', async (req, res) => {
    //const {firstName, lastName, emailId, password, age, gender} = req.body;

    try {
        validateSignup(req);

        const {firstName,lastName, emailId,  password} = req.body;

        const passwordHash = await bcrypt.hash(password, 10);

        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
    });
        await user.save();
        res.send('User created successfully');
    } catch (err) {
       // console.log(err);
        res.status(500).send('Error creating user'+err.message);
    }
})

app.post('/login', async (req, res) => {
    try {
        const {emailId, password} = req.body;
        const user = await User.findOne({emailId: emailId});
        if(!user) {
            res.status(400).send('Invalid Credentials');
        } else {
            const isPasswordValid = user.checkValidPassword(password);
            if(isPasswordValid) {
                const token = await user.getJWT();
                res.cookie('token', token, {expire: new Date(Date.now() * 7 + 3600000)});
                res.send('Login successful');
            }
            else {
                res.status(401).send('Invalid Credentials');
            }
        }
    } catch (err) {
        res.status(500).send('Something went wrong'+err.message);
    }
})

app.get('/profile',userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
        
    } catch (err) {
        res.status(500).send('Not loading the profile'+err.message);
    }
        
})

app.post('/sendConnectionRequest', userAuth, async (req, res) => {
    try {
       const user = req.user;
       res.send(user.firstName + ' ' + user.lastName + ' sent you a connection request');
       
        
    } catch (err) {
        res.status(500).send('Connection Request Failed: '+err.message);
    }
})

app.use("/",(err, req, res) => {
    if(err){
        console.log(err);
        res.status(500).send('Error');
    }
})



connectDB().then(() => {
    console.log('Successfully connected to MongoDB');
    app.listen(7778, () => {
        console.log('Server is running on port 7778');
    });
}).catch((err) => {
    console.log('Error connecting to MongoDB:', err);
});

