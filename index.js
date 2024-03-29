const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config(".env");

const userRouter = require("./routers/user");
const categoryRouter = require("./routers/category");
const songRouter = require("./routers/song");

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(userRouter);
app.use(categoryRouter);
app.use(songRouter);

mongoose
    .connect("mongodb://localhost:27017/song-collection")
    .then(() => {
        console.log("Database successfully connected!");
    })
    .catch((e) => {
        console.log(e.message);
    });

app.listen(port, () => {
    console.log(`The server is on port ${port}.`);
});
