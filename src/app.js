const express = require('express');
const app = express();

const { adminAuth, userAuth } = require('./middlewares/auth');

app.use("/admin", (req, res, next)=> {
    adminAuth(req, res, next);
})

app.get("/user", userAuth,(req, res) => {
    res.send("Fecthing users");
});

app.get("/admin/getAllUsers", (req, res) => {
    res.send("Fecthing all users");
});

app.get("/admin/deleteUser", (req, res) => {
    res.send("Deleting user");
});

app.get("/checkError", (req, res) => {
    throw new Error("Error");
});

app.use("/", (err, req, res, next) => {
   if(err) {
    res.status(500).send("Internal Server Error");
   }
});

app.listen(7778, () => {

});
