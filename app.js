const express = require("express");
require("express-async-errors");
const morgan = require("morgan");
const calculateDistance = require("./utils/calculateDistance");
const { unknownEndpoint, errorHandler } = require("./utils/middleware");
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
    response = await db.query(`
      SELECT TO_CHAR(DATE(date), 'YYYY-MM-DD') as date, SUM(distance) as distance
      FROM exercises 
      WHERE EXTRACT(YEAR FROM date) = EXTRACT(YEAR FROM CURRENT_DATE) 
      AND EXTRACT(MONTH FROM date) = EXTRACT(MONTH FROM CURRENT_DATE)
      GROUP BY DATE(date) 
      ORDER BY date`);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
  const groupedCurrentMonth = response.rows.reduce(
    (paired, current) => ({
      ...paired,
      [current.date]: current.distance,
    }),
    {}
  );
  res.json(groupedCurrentMonth);
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
