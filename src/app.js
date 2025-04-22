const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');
const app = express();

app.use(express.json());
app.post('/signup', async (req, res) => {
    //const {firstName, lastName, emailId, password, age, gender} = req.body;
    const user = new User(
       req.body
    );

    try {
        await user.save();
        res.send('User created successfully');
    } catch (err) {
        res.status(500).send('Error creating user');
    }
})

app.get('/feed', async (req, res) => {
    try {
        const users = await User.find({});
        if(users.length  === 0)  {
            res.status(404).send('No users found');
        }else {
            res.send(users);
        }
        
    } catch (err) {
        res.status(500).send('Something went wrong');
    }
})

app.get('/user', async (req, res) => {
    try {
        const userId = req.body.userId;
        const user = await User.findById({_id: userId});
        if(!user) {
            res.status(404).send('User not found');
        } else {
            res.send(user);
        }
        
    } catch (err) {
        res.status(500).send('Something went wrong');
    }
})

app.get('/userByEmail', async (req, res) => {
    try {
        const emailId = req.body.emailId;
        const user = await User.findOne({emailId: emailId});
        res.send(user);
    } catch (err) {
        res.status(500).send('Something went wrong');
    }
})

app.delete('/user', async (req, res) => {
    try {
        const userId = req.body.userId;
        const user = await User.findByIdAndDelete({_id: userId});
        res.send("Deleted the user successfully");
    } catch (err) {
        res.status(500).send('Something went wrong');
    }
})

app.patch('/user', async (req, res) => {
    try {
        const userId = req.body.userId;
        const user = await User.findByIdAndUpdate({_id: userId}, req.body, {returnDocument: 'after'});;
        //console.log(`User after update: ${user}`);
        res.send("Updated the user successfully");
    } catch (err) {
        res.status(500).send('Something went wrong');
    }
})

app.patch('/userByEmail', async (req, res) => {
    try {
        const emailId = req.body.emailId;
        const user = await User.findOneAndUpdate({emailId: emailId}, req.body);;
        res.send("Updated the user successfully");
    } catch (err) {
        res.status(500).send('Something went wrong');
    }
})


app.use("/",(err, req, res) => {
    if(err){
        console.log(err);
        res.status(500).send('Error');
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

