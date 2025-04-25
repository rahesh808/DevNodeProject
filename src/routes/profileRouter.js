const express = require('express');
const profileRouter = express.Router();
const bcrypt = require('bcrypt');
const { userAuth } = require('../middlewares/auth');
const User = require('../models/user');
const validator = require('validator');
const { isAllowedToUpdate, photoUrlValidator,validateSkills,validateAbout } = require('../utils/validate');
profileRouter.get('/profile/view',userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
        
    } catch (err) {
        res.status(500).send('Not loading the profile'+err.message);
    }
        
})
profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
    try {
      if(!isAllowedToUpdate(req.body)) {
        throw new Error('Invalid fields sent for update');
      }
      if(!photoUrlValidator(req.body.photoUrl)) {
        throw new Error('Invalid photoUrl');
      }
      if(!validateSkills(req.body.skills)) {
        throw new Error('Skills should be less than 10');
      }
      if(!validateAbout(req.body.about)) {
        throw new Error('About should be less than 100 characters');
      }
      const loggedInUser = req.user;

      Object.keys(req.body).forEach((key) => {
        loggedInUser[key] = req.body[key];
      });
      await loggedInUser.save();
      res.json({
        message: `${loggedInUser.firstName} ${loggedInUser.lastName}, your profile has been updated successfully.`,
        data: loggedInUser,
    });

    }
    catch (err) {
        res.status(500).send('Not updating the profile'+err.message);
    }
})

profileRouter.patch('/profile/password', async (req, res) => {
    try {
        const {emailId, oldPassword, newPassword} = req.body;
        if(!emailId || !oldPassword || !newPassword) {
            throw new Error('Missing required fields');
        }
        const loggedInUser = await User.findOne({emailId: emailId});
        if(!loggedInUser) {
            throw new Error('User not found');
        }
       
        if(oldPassword === newPassword) {
            throw new Error('Old password and new password cannot be same');
        }  
        if(!validator.isStrongPassword(newPassword)) {
            throw new Error('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character');
        }
        const isMatch = await loggedInUser.checkValidPassword(oldPassword);
        console.log(isMatch);
        if(!isMatch) {
            throw new Error('Old password is incorrect');
        }
        const passwordHash = await bcrypt.hash(newPassword, 10);
        loggedInUser.password = passwordHash;
        await loggedInUser.save();
        res.status(200).json({
            message: 'Password updated successfully',
            data: loggedInUser,
        });
    }
    catch (err) {
        res.status(500).send('Not updating the password'+err.message);
    }
})

profileRouter.delete('/profile/delete', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        await loggedInUser.deleteOne();
        res.cookie('token', null, {expire: new Date(Date.now())});
        res.status(200).json({
            message: 'User deleted successfully',
            data: loggedInUser,
        });
    }
    catch (err) {
        res.status(500).send('Not deleting the user'+err.message);
    }
})

profileRouter.patch('/profile/forgotpassword', async (req, res) => {
    try {
        const {emailId, newPassword} = req.body;
        if(!emailId || !newPassword) {
            throw new Error('Missing required fields');
        }
        const loggedInUser = await User.findOne({emailId: emailId});
        if(!loggedInUser) {
            throw new Error('User not found');
        }
       
        if(!validator.isStrongPassword(newPassword)) {
            throw new Error('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character');
        }
        const passwordHash = await bcrypt.hash(newPassword, 10);
        loggedInUser.password = passwordHash;
        await loggedInUser.save();
        res.status(200).json({
            message: 'Password updated successfully',
            data: loggedInUser,
        });

    } catch (err) { 
        res.status(500).send('Not updating the password: ' + err.message);
    }

})


module.exports = profileRouter;