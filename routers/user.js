const { Router } = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const auth = require("../middleware/authenticate");

const userRouter = Router();

userRouter.post("/users", async (request, response) => {
    const { name, email, password } = request.body;
    const user = new User({ name, email, password });
    try {
        await user.save();
        console.log(process.env.SECRET_TOKEN);
        const token = jwt.sign({ id: user._id }, process.env.SECRET_TOKEN, {
            expiresIn: "5h"
        });
        response.status(201).send({ user, token });
    } catch (e) {
        response.status(400).send({ error: e.message });
    }
});

userRouter.post("/users/login", auth, async (request, response) => {
    const { email, password } = request.body;
    try {
        const user = await User.findOne({ email });
        console.log(user);
        if (!user) {
            throw new Error("Incorect email or password.");
        }
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            throw new Error("Incorrect email or password,");
        }
        const token = jwt.sign({ id: user._id }, process.env.SECRET_TOKEN, {
            expiresIn: "5h"
        });
        response.status(200).send({ user, token });
    } catch (e) {
        response.status(400).send({ error: e.message });
    }
});

userRouter.post("/users/logout", auth, async (request, response) => {
    try {
        const token = "remove";
        response.send({ token });
    } catch (e) {
        response.status(500).send({ error: e.message });
    }
});

userRouter.get("/users", auth, async (request, response) => {
    try {
        const users = await User.find();
        response.send(users);
    } catch (e) {
        response.status(500).send({ error: e.message });
    }
});

userRouter.get("/users/:id", auth, async (request, response) => {
    try {
        const user = await User.findById(request.params.id);
        if (!user) {
            return response.status(404).send({ error: "User not found." });
        }
        response.send(user);
    } catch (e) {
        response.status(500).send({ error: e.message });
    }
});

userRouter.patch("/users/:id", auth, async (request, response) => {
    const allowedProperties = ["name", "email", "password"];
    const properties = Object.keys(request.body);
    const isValid = properties.every((property) =>
        allowedProperties.includes(property)
    );
    if (!isValid || properties.length < 1) {
        return response.status(400).send({ error: "Invalid value." });
    }

    try {
        const user = await User.findById(request.params.id);
        if (!user) {
            return response.status(404).send({ error: "User Not Found." });
        }
        properties.forEach((property) => {
            user[property] = request.body[property];
        });
        await user.save();
        response.send(user);
    } catch (e) {
        response.status(500).send(e.message);
    }
});
userRouter.delete("/users/:id", auth, async (request, response) => {
    try {
        const user = await User.findByIdAndDelete(request.params.id);
        if (!user) {
            return response.status(404).send({ error: "User Not Found." });
        }
        response.send(user);
    } catch (e) {
        response.status(500).send(e.message);
    }
});

module.exports = userRouter;
