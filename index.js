const app = require("./app");
const http = require("http");

const PORT = 3001;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`fitofit app started on port ${PORT}`);
});
