const  socket  = require("socket.io");
const Chat = require("../models/chat");

const jwt = require("jsonwebtoken");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");


const initiateSocket = (server) => {
    const io = socket(server, {
        cors: {
            origin: "http://localhost:5173"
            
        },
    });

    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token; 
            if (!token) {
                return next(new Error("Authentication error: token missing"));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded._id);
            if (!user) {
                return next(new Error("Authentication error: user not found"));
            }

            socket.user = user; 
            next();
        } catch (err) {
            console.error("Socket auth error:", err.message);
            next(new Error("Authentication error"));
        }
    });

    io.on('connection', (socket) => {
        socket.on('joinChat',  ({ firstName, userId, targetUserId }) => {
            const roomId = [userId, targetUserId].sort().join('_');
           
            socket.join(roomId);
        });
        socket.on('sendMessage', async ({firstName, lastName, userId, targetUserId, text}) => {
            try {
                const connections = await ConnectionRequest.findOne({
                    $or: [
                        { fromUserId: userId, toUserId: targetUserId ,status: 'accepted'},
                        { fromUserId: targetUserId, toUserId: userId , status: 'accepted'}
                    ]
                });
                if (!connections) {
                    return socket.emit('messageError', { message: 'You are not connected with this user' });
                }
            const roomId = [userId, targetUserId].sort().join('_');
            
            let chat = await Chat.findOne({ participants: { $all: [userId, targetUserId] } });
            if (!chat) {
                chat = new Chat({
                    participants: [userId, targetUserId],
                    messages: [{ senderId: userId, text }]
                });
            
            }
                chat.messages.push({ senderId: userId, text });
                await chat.save();
            
            
            io.to(roomId).emit('messageReceived', { firstName, lastName, text });
        } catch (error) {
            console.error('Error sending message:', error);
        }
          
        });
        socket.on('disconnect', () => {
           
        });
    });

   

}
module.exports = initiateSocket;