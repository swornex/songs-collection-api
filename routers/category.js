const { Router } = require("express");

const Category = require("../models/categoryModel");
const validationHandler = require("../handler/validationHandler");
const auth = require("../middleware/authenticate");

const categoryRouter = Router();

categoryRouter.post("/categories", auth, async (request, response) => {
    const { categoryName } = request.body;
    const category = new Category({ categoryName });
    try {
        await category.save();
        response.status(201).send(category);
    } catch (e) {
        const error = validationHandler(e);
        response.status(500).send({ error });
    }
});

categoryRouter.get("/categories", auth, async (request, response) => {
    try {
        const categories = await Category.find();
        response.send(categories);
    } catch (e) {
        response.status(500).send({ error: e.message });
    }
});

categoryRouter.get("/categories/:id", auth, async (request, response) => {
    try {
        const category = await Category.findById(request.params.id);
        if (!category) {
            return response.status(404).send({ error: "Id not found." });
        }
        response.send(category);
    } catch (e) {
        response.status(500).send({ error: e.message });
    }
});

categoryRouter.patch("/categories/:id", auth, async (request, response) => {
    const properties = Object.keys(request.body);

    if (properties.length != 1 || properties[0] != "categoryName") {
        return response.status(400).send({ error: "Invalid value." });
    }
    try {
        const category = await Category.findById(request.params.id);
        if (!category) {
            return response.status(404).send("Category ID not found.");
        }
        properties.forEach((property) => {
            category[property] = request.body[property];
        });
        await category.save();
        response.send(category);
    } catch (e) {
        const error = validationHandler(e);
        response.status(500).send({ error });
    }
});

categoryRouter.delete("/categories/:id", auth, async (request, response) => {
    try {
        const category = await Category.findByIdAndDelete(request.params.id);
        if (!category) {
            return response
                .status(404)
                .send({ error: "Category Id not found" });
        }
        response.send(category);
    } catch (e) {
        response.status(500).send({ error: e.message });
    }
});

module.exports = categoryRouter;
