const { Router } = require("express");

const Song = require("../models/songModel");
const Category = require("../models/categoryModel");
const auth = require("../middleware/authenticate");
const validationHandler = require("../handler/validationHandler");

const songRouter = Router();

songRouter.post("/songs", auth, async (request, response) => {
    const { name, categoryName } = request.body;
    const song = new Song({ name, categoryName, creatorId: request.user._id });
    try {
        const category = await Category.findOne({ categoryName });
        if (!category) {
            return response.status(404).send({ error: "Category not found." });
        }
        await song.save();
        response.status(201).send(song);
    } catch (e) {
        const error = validationHandler(e);
        response.status(500).send({ error });
    }
});

songRouter.get("/songs", auth, async (request, response) => {
    try {
        const songs = await Song.find();
        response.send(songs);
    } catch (e) {
        response.status(500).send({ error: e.message });
    }
});

songRouter.get("/songs/:id", auth, async (request, response) => {
    try {
        const song = await Song.findById(request.params.id);
        if (!song) {
            return response.status(404).status({ error: "Id not found" });
        }
        response.send(song);
    } catch (e) {
        response.status(500).send({ error: e.message });
    }
});

songRouter.patch("/songs/:id", auth, async (request, response) => {
    try {
        const song = await Song.findById(request.params.id);
        if (!song) {
            return response.status(404).send({ error: "Id not found." });
        }
        if (song.creatorId.toString() != request.user._id.toString()) {
            return response
                .status(403)
                .send({ error: "You are not allowed to update." });
        }
        const allowedProperties = ["name", "categoryName"];
        const properties = Object.keys(request.body);
        const isValid = properties.every((property) =>
            allowedProperties.includes(property)
        );
        if (!isValid || properties.length < 1) {
            return response.status(400).send({ error: "invalid value." });
        }
        properties.forEach((property) => {
            song[property] = request.body[property];
        });
        const category = await Category.findOne({
            categoryName: song.categoryName
        });
        if (!category) {
            return response.status(404).send({ error: "category not found." });
        }
        await song.save();
        response.send(song);
    } catch (e) {
        const error = validationHandler(e);
        response.status(500).send({ error });
    }
});

songRouter.delete("/songs/:id", auth, async (request, response) => {
    try {
        const song = await Song.findById(request.params.id);
        if (!song) {
            return response.status(404).send({ errror: "Id not found" });
        }
        if (song.creatorId.toString() != request.user._id.toString()) {
            return response
                .status(403)
                .send({ error: "You are not allowed to delete." });
        }
        await song.delete();
        response.send(song);
    } catch (e) {
        response.status(500).send({ error: e.message });
    }
});

module.exports = songRouter;
