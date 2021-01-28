const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.message === "Invalid address") {
    response.status(400).json({ error: "invalid address" });
  }

  next(error);
};

module.exports = { unknownEndpoint, errorHandler };
