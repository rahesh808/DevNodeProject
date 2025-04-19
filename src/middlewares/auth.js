const adminAuth = (req, res, next) => {
    try {
    const token = "xyz";
    const isAdminAuthorized = token === "xyz";
    if(isAdminAuthorized) {
        next();
    } else {
        res.status(401).send("Unauthorized Admin");
    }
} catch (error) {
    res.status(401).send("Unauthorized Admin");

}
}

const userAuth = (req, res, next) => {
    try {
    const token = "xyz";
    const isAdminAuthorized = token === "xyz";
    if(isAdminAuthorized) {
        next();
    } else {
        res.status(401).send("Unauthorized User");
    }
} catch (error) {
    res.status(401).send("Unauthorized User");
}

}

module.exports = { adminAuth, userAuth };


