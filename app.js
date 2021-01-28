const express = require("express");
const morgan = require("morgan");
const storage = require("./utils/storage");
const calculateDistance = require("./utils/calculateDistance");

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.get("/api/ping", async (req, res) => {
  res.send("pong");
});

app.get("/api/exercises", (req, res) => {
  const exercises = storage.read().exercises;
  res.json(exercises);
});

app.post("/api/exercises", async (req, res) => {
  const body = req.body;
  if (!body.start || !body.end) {
    res.status(400).json({ error: "missing start or end address" });
  } else {
    const distance = await calculateDistance(body.start, body.end);
    const exercise = { date: new Date().toISOString(), distance };
    storage.add(exercise);
    res.status(201).json(exercise);
  }
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

module.exports = app;
