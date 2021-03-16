const app = require("./app");
const http = require("http");
const db = require("./db");

const PORT = 3001;

db.init().then(() => {
  const server = http.createServer(app);

  server.listen(PORT, () => {
    console.log(`fitofit app started on port ${PORT}`);
  });
});
