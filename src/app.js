const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');
const bcrypt = require('bcrypt');
const  {isAllowedToUpdate, validateSkills,validateSignup} = require('./utils/validate');
const app = express();

app.use(express.json());
app.post('/signup', async (req, res) => {
    //const {firstName, lastName, emailId, password, age, gender} = req.body;

    try {
        validateSignup(req);

        const {firstName,lastName, emailId,  password} = req.body;

        const passwordHash = await bcrypt.hash(password, 10);

        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
    });
        await user.save();
        res.send('User created successfully');
    } catch (err) {
       // console.log(err);
        res.status(500).send('Error creating user'+err.message);
    }
})

app.post('/login', async (req, res) => {
    try {
        const {emailId, password} = req.body;
        const user = await User.findOne({emailId: emailId});
        if(!user) {
            res.status(400).send('Invalid Credentials');
        } else {
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if(isPasswordValid) {
                res.send('Login successful');
            }
            else {
                res.status(401).send('Invalid Credentials');
            }
        }
    } catch (err) {
        res.status(500).send('Something went wrong'+err.message);
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
        res.status(500).send('Something went wrong'+err.message);
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
        res.status(500).send('Something went wrong'+err.message);
    }
})

app.get('/userByEmail', async (req, res) => {
    try {
        const emailId = req.body.emailId;
        const user = await User.findOne({emailId: emailId});
        res.send(user);
    } catch (err) {
        res.status(500).send('Something went wrong'+err.message);
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

app.patch('/user/:userId', async (req, res) => {
    try {
        if(!isAllowedToUpdate(req.body)) {
            throw new Error('Invalid fields to update');
        }
        if(!validateSkills(req?.body?.skills)) {
            throw new Error('Skills should be less than 10');  
        }
        const userId = req.params.userId;
        const user = await User.findByIdAndUpdate({_id: userId}, req.body, {returnDocument: 'after',
            runValidators: true,
            context: 'query' 
        });;
        //console.log(`User after update: ${user}`);
        res.send("Updated the user successfully");
    } catch (err) {
        res.status(500).send('Something went wrong'+err.message);
    }
})

app.patch('/userByEmail', async (req, res) => {
    try {
        const emailId = req.body.emailId;
        const user = await User.findOneAndUpdate({emailId: emailId}, req.body);;
        res.send("Updated the user successfully");
    } catch (err) {
        res.status(500).send('Something went wrong'+ err.message);
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

