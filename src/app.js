const express = require('express');
const connectDB = require('./config/database');

const app = express();
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(cookieParser());


const authRouter = require('./routes/authRouter');
const profileRouter = require('./routes/profileRouter');
const requestRouter = require('./routes/requestRouter');


app.use('/', authRouter, profileRouter, requestRouter);



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

