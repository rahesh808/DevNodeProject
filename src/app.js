const express = require('express');
require('dotenv-flow').config();
require('./utils/cronjob');
const connectDB = require('./config/database');
const initiateSocket = require('./utils/socket');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');

const http = require('http');
const server = http.createServer(app);

initiateSocket(server);

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
   
}));
app.use(express.json());
app.use(cookieParser());



const authRouter = require('./routes/authRouter');
const profileRouter = require('./routes/profileRouter');
const requestRouter = require('./routes/requestRouter');
const userRouter = require('./routes/userRouter');
const paymentRouter = require('./routes/paymentRouter');
const chatRouter = require('./routes/chatRouter');


app.use('/', authRouter, profileRouter, requestRouter, userRouter, paymentRouter, chatRouter);






connectDB().then(() => {
    console.log('Successfully connected to MongoDB');
    server.listen(7778, () => {
        console.log('Server is running on port 7778');
    });
}).catch((err) => {
    console.log('Error connecting to MongoDB:', err);
});

