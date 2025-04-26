const express = require('express');
const userRouter = express.Router();

const { userAuth } = require('../middlewares/auth');
const User = require('../models/user');
const ConnectionRequest = require('../models/connectionRequest');

const USER_SAVE_DATA = "firstName lastName about skills photoUrl gender age";
userRouter.get('/user/requests/received', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: 'interested'
        }).populate('fromUserId', USER_SAVE_DATA);
        
        res.status(200).json({
            message: 'Connection Requests Received',
            data: connectionRequests
        });
    } catch (err) {
        res.status(500).send('Error fetching connection requests: ' + err.message);
    }
})

userRouter.get('/user/connections', userAuth, async (req, res) => {
try {

    const loggedInUser = req.user;
    const connections = await ConnectionRequest.find({
        $or: [
            { fromUserId: loggedInUser._id, status: 'accepted' },
            { toUserId: loggedInUser._id, status: 'accepted' }
        ]
    }).populate('fromUserId', USER_SAVE_DATA).populate('toUserId', USER_SAVE_DATA);
    const data = connections.map((row) => {
        if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
            return row.toUserId;
        }else {
            return row.fromUserId;
        }
    })
    res.status(200).json({
        data: data
    });
}catch (err) {
    res.status(500).send('Error fetching connections: ' + err.message);
}
})

userRouter.get('/user/feed', userAuth, async (req, res) => {
    try {

        const loggeInUser = req.user;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1) * limit;
        const connections = await ConnectionRequest.find({
            $or:[
                { fromUserId: loggeInUser._id },
                { toUserId: loggeInUser._id }
            ]
        }).select('fromUserId toUserId');

        const hiddenUserIds = new Set();
        connections.forEach((connection)=> {
            hiddenUserIds.add(connection.fromUserId.toString());
            hiddenUserIds.add(connection.toUserId.toString());
        })
       
        const users = await User.find({
            $and: [
                { _id: { $ne: loggeInUser._id } },
                { _id: { $nin: Array.from(hiddenUserIds) } }
            ]
        }).select(USER_SAVE_DATA).skip(skip).limit(limit);
            
       res.status(200).json({
            message: 'User Feed',
            data: users
        });
    }catch (err) {
        res.status(500).send('Error fetching feed: ' + err.message);
    }
})

module.exports = userRouter;