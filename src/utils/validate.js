const validator = require('validator');

const isAllowedToUpdate = (data) => {
    const allowedFields = ['age', 'gender', 'photoUrl', 'about', 'skills', 'firstName', 'lastName'];

    // Check if all keys in the data object are in the allowedFields array
    return Object.keys(data).every(field => allowedFields.includes(field));
};
const validateSkills = (skills) => {
    if(skills != null && skills.length >= 10) {
        return false;
    }
    return true;

}

const validateAbout = (about) => {
    if(about.length > 100) {
        throw new Error('About should be less than 100 characters');
    }
    return true;
}

const photoUrlValidator = (photoUrl) => {
    if(!validator.isURL(photoUrl)) {
        throw new Error('Invalid URL');
    }
    return true;
}

const validateSignup = (req) => {
    const { firstName, lastName, emailId, password} = req.body;
    if (!firstName || !lastName) {
        throw new Error('Missing required fields');

    }
    else if(!validator.isEmail(emailId)) {
        throw new Error('Invalid email format');
    }
    else if(!validator.isStrongPassword(password)) {
        throw new Error('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character');
    }
    
   
}


module.exports = { isAllowedToUpdate,  validateSkills, validateSignup , photoUrlValidator, validateAbout};