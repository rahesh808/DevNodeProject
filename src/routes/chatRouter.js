const express = require("express");
const { userAuth } = require('../middlewares/auth');
const Chat = require("../models/chat");
const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
    try {
        const targetUserId = req.params.targetUserId; 
        const userId = req.user._id;

        const chat = await Chat.findOne({ participants: { $all: [userId, targetUserId] } })
        .populate({
            path: 'messages.senderId', 
            select: 'firstName lastName email' 
        });
    
        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }
        res.status(200).json(chat.toJSON());
    } catch (error) {
        console.error("Error fetching chat:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = chatRouter;