const express = require('express');
const authRouter = express.Router();

const  {validateSignup} = require('../utils/validate');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const { userAuth } = require('../middlewares/auth');


authRouter.post('/signup', async (req, res) => {
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
        const savedUser = await  user.save();
        const token = await savedUser.getJWT();
        res.cookie('token', token, {expire: new Date(Date.now() * 8 + 3600000)});
        res.send({message: 'User created successfully', data: savedUser});
    } catch (err) {
       // console.log(err);
        res.status(500).send('Error creating user'+err.message);
    }
})

authRouter.post('/login', async (req, res) => {
    try {
        const {emailId, password} = req.body;
        const user = await User.findOne({emailId: emailId});
        if(!user) {
            res.status(400).send('Invalid Credentials');
        } else {
            const isPasswordValid =  await user.checkValidPassword(password);
            if(isPasswordValid) {
                const token = await user.getJWT();
                res.cookie('token', token, {expire: new Date(Date.now() * 7 + 3600000)});
                res.send(user);
            }
            else {
                res.status(401).json('Invalid Credentials');
            }
        }
    } catch (err) {
        res.status(500).send('Something went wrong'+err.message);
    }
})

authRouter.post('/logout', async (req, res) => {
    try {
        
        res.cookie('token', null, {expire: new Date(Date.now())});
        res.send('Logout successfull');
    } catch (err) {
        res.status(500).send('Something went wrong'+err.message);
    }
})

module.exports = authRouter;
