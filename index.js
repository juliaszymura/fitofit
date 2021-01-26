const express = require("express");
const morgan = require("morgan");

const app = express();
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/ping", (req, res) => {
  res.send("pong");
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`fitofit app started on port ${PORT}`);
});
