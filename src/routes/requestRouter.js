const express = require('express');

const requestRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const  User = require('../models/user');

requestRouter.post('/request/send/:status/:userId', userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.userId;
        const status = req.params.status;
        const allowedStatuses = ['ignored', 'interested'];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).send('Invalid status');
        }
        const toUser = await User.findById(toUserId);
        if(!toUser) {
            return res.status(404).send('User not found');
        }
        const existingCOnnectionRequest = await ConnectionRequest.findOne({
            $or:[
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });
        if(existingCOnnectionRequest) {
            return res.status(400).send('Connection Request Already Exists');
        }
        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });
        const data = await connectionRequest.save();
        res.status(200).json({
            message: `${req.user.firstName} ${req.user.lastName} is ${status} in ${toUser.firstName} ${toUser.lastName}`,
            data
        });
    
    } catch (err) {
        res.status(500).send('Connection Request Failed: '+err.message);
    }
})

requestRouter.post('/request/receive/:status/:requestId', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const {status, requestId} = req.params;
        const allowedStatuses = ['accepted', 'rejected'];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: 'Invalid status'
            });
        }
        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: 'interested'
        });
        if(!connectionRequest) {
            return res.status(404).json({
                message: 'Connection Request not found or not interested'
            });
        }
        connectionRequest.status = status;
        const data = await connectionRequest.save();
        res.status(200).json({
            message: `${loggedInUser.firstName} ${loggedInUser.lastName} is ${status} in ${connectionRequest.fromUserId}`,
            data: data
        });

    }catch (err) {
        res.status(500).send('Connection Request Failed: '+err.message);
    }
})
module.exports = requestRouter;