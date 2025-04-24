const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userAuth = async (req, res, next) => {
    try {
    
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).send("Invalid token");
    }
    const decoded = jwt.verify(token, 'Dev@Tinder$793');
    const user = await User.findById(decoded._id);
    if(!user) {
        res.status(404).send('User not found');
    }
    req.user = user;
    next();
} catch (error) {
    res.status(401).send("Unauthorized User");
}

}

module.exports = { userAuth };


