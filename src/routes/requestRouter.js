const express = require('express');

const requestRouter = express.Router();
const { userAuth } = require('../middlewares/auth');

requestRouter.post('/sendConnectionRequest', userAuth, async (req, res) => {
    try {
       const user = req.user;
       res.send(user.firstName + ' ' + user.lastName + ' sent you a connection request');
       
        
    } catch (err) {
        res.status(500).send('Connection Request Failed: '+err.message);
    }
})

module.exports = requestRouter;