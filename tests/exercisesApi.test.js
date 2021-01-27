const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);

describe("Exercise API", () => {
  const initialExercises = [
    {
      date: "1-1-2021",
      distance: 1.23,
    },
    {
      date: "12-11-2021",
      distance: 10.01,
    },
  ];

  test("returns 200 status code", async () => {
    await api.get("/api/exercises").expect(200);
  });
  test("returns all entries", async () => {
    await api.get("/api/exercises").expect(initialExercises);
  });
});
