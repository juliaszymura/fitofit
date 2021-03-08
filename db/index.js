const { Pool } = require("pg");
const testConfig = {
  user: "fitofit",
  password: "Pass2021!",
  database: "fitofit",
  port: 5433,
};

const pool =
  process.env.NODE_ENV !== "test" ? new Pool() : new Pool(testConfig);

module.exports = {
  query: (text, params) => pool.query(text, params),
  end: () => pool.end(),
};
