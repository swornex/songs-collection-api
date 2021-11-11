const jwt = require("jsonwebtoken");

const User = require("../models/userModel");

const auth = async (request, response, next) => {
    try {
        const token = request.header("Authorization").replace("Bearer ", "");
        const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
        const user = await User.findById(decoded.id);
        if (!user) {
            response.status(404).send({ error: "User Not FOund" });
        }
        request.user = user;
        next();
    } catch (e) {
        response.status(401).send({ error: "Please authenticate" });
    }
};

module.exports = auth;
