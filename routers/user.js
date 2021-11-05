const { Router } = require("express");
const User = require("../models/userModel");

const userRouter = Router();

userRouter.post("/users", async (request, response) => {
    const { name, email, password } = request.body;
    const user = new User({ name, email, password });
    try {
        await user.save();
        response.status(201).send(user);
    } catch (e) {
        response.status(400).send({ error: e.message });
    }
});

userRouter.get("/users", async (request, response) => {
    try {
        const user = await User.find();
        response.send(user);
    } catch (e) {
        response.status(500).send({ error: e.message });
    }
});

userRouter.get("/users/:id", async (request, response) => {
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

module.exports = userRouter;
