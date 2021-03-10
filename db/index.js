const { Pool } = require("pg");
const testConfig = {
  user: "fitofit",
  password: "Pass2021!",
  database: "fitofit",
  port: 5433,
};

const pool =
  process.env.NODE_ENV !== "test" ? new Pool() : new Pool(testConfig);

const init = async () => {
  // eslint-disable-next-line quotes
  await pool.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  await pool.query(`CREATE TABLE IF NOT EXISTS exercises (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4() ,
    date timestamp with time zone,
    distance float
  )`);
};

module.exports = {
  query: (text, params) => pool.query(text, params),
  end: () => pool.end(),
  init,
};
