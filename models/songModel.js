const mongoose = require("mongoose");

const songSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    creatorId: {
        type: mongoose.Schema.Types.ObjectId
    },
    categoryName: {
        type: String,
        trim: true
    }
});

const Song = mongoose.model("song", songSchema);

module.exports = Song;
