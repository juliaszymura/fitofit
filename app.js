const express = require("express");
require("express-async-errors");
const morgan = require("morgan");
const storage = require("./utils/storage");
const calculateDistance = require("./utils/calculateDistance");
const { unknownEndpoint, errorHandler } = require("./utils/middleware");
const groupByDay = require("./utils/groupByDay");

const app = express();

app.use(express.json());
if (process.env.NODE_ENV !== "test") app.use(morgan("dev"));

app.get("/api/exercises", (req, res) => {
  const exercises = storage.read().exercises;
  res.json(exercises);
});

app.get("/api/exercises/grouped/current-month", (req, res) => {
  const exercises = storage.read().exercises;
  const currentMonth = new Date().toISOString().slice(0, 7);
  const regex = new RegExp(currentMonth);
  const exercisesCurrentMonth = exercises.filter((ex) => regex.test(ex.date));
  res.json(groupByDay(exercisesCurrentMonth));
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

app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;
