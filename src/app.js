const express = require('express');
const app = express();

app.get("/", (req, res) => {
    res.send("Namaste Node");
});

app.get("/test", (req, res) => {
    res.send("Hello World from test Api");
});

app.get("/hello", (req, res) => {
    res.send("Hello World from Hello Api");
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
