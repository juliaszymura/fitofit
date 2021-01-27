const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);

describe("Exercise API", () => {
  test("returns 200 status code", async () => {
    await api.get("/api/exercises").expect(200);
  });
});
