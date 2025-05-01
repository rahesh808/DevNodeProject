const express = require('express');
require('dotenv-flow').config();
const connectDB = require('./config/database');

const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');

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


app.use('/', authRouter, profileRouter, requestRouter, userRouter);



app.use("/",(err, req, res) => {
    if(err){
        //console.log(err);
        res.status(500).send('Error'+err.message);
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

