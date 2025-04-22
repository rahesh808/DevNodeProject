const mongoose = require('mongoose');

const connectDB = async () => {
  await mongoose.connect('mongodb+srv://raheshpersonal2103:LzcWHWYClRqiiCFF@node.vull6c4.mongodb.net/devTinder')

}

module.exports = connectDB;

