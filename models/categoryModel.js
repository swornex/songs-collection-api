const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    categoryName: {
        type: String,
        trim: true,
        required: [true, "Category name required."],
        unique: true
    }
});

const Category = mongoose.model("category", categorySchema);

module.exports = Category;
