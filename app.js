const express = require("express");
const morgan = require("morgan");

const app = express();

app.use(express.json());
app.use(morgan("dev"));

const exercises = [];

app.get("/api/ping", async (req, res) => {
  res.send("pong");
});

app.get("/api/exercises", (req, res) => {
  res.json(exercises);
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

module.exports = app;
