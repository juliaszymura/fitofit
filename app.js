const express = require("express");
const morgan = require("morgan");
const storage = require("./utils/storage");

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.get("/api/ping", async (req, res) => {
  res.send("pong");
});

app.get("/api/exercises", (req, res) => {
  const data = storage.read();
  res.json(data);
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

module.exports = app;
