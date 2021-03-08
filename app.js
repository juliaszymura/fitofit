const express = require("express");
require("express-async-errors");
const morgan = require("morgan");
// const storage = require("./utils/storage");
const calculateDistance = require("./utils/calculateDistance");
const { unknownEndpoint, errorHandler } = require("./utils/middleware");
const groupByDay = require("./utils/groupByDay");
const db = require("./db");

const app = express();

app.use(express.json());
if (process.env.NODE_ENV !== "test") app.use(morgan("dev"));

app.get("/api/exercises", async (req, res) => {
  let response;
  try {
    response = await db.query("SELECT * FROM exercises");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
  res.json(response.rows);
});

app.get("/api/exercises/grouped/current-month", async (req, res) => {
  let response;
  try {
    response = await db.query("SELECT * FROM exercises");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
  const currentMonth = new Date().toISOString().slice(0, 7);
  const regex = new RegExp(currentMonth);
  const exercisesCurrentMonth = response.rows
    .filter((ex) => regex.test(ex.date.toISOString()))
    .map((ex) => ({ date: ex.date.toISOString(), distance: ex.distance }));
  res.json(groupByDay(exercisesCurrentMonth));
});

app.post("/api/exercises", async (req, res) => {
  const body = req.body;
  if (!body.start || !body.end) {
    res.status(400).json({ error: "missing start or end address" });
  } else {
    const distance = await calculateDistance(body.start, body.end);
    const date = new Date().toISOString();
    try {
      await db.query({
        name: "add-exercise",
        text: "INSERT INTO exercises (date, distance) VALUES ($1, $2)",
        values: [date, distance],
      });
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
    res.status(201).json({ date, distance });
  }
});

app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;
