require("dotenv").config();

const express = require("express");
const path = require("node:path");
const app = require("./src/app");
const port = process.env.PORT || 3000;

app.use(express.static(path.resolve(__dirname, "../frontend")));

app.listen(port, () => console.log(`Backend server listening on port ${port}`));
