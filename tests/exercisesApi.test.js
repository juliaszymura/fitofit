const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const storage = require("../utils/storage");

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
  beforeEach(() => {
    storage.clear();
    storage.add(initialExercises);
  });

  describe("GET /api/exercises - all exercises", () => {
    test("responds with 200 status code", async () => {
      await api.get("/api/exercises").expect(200);
    });
    test("responds with all entries", async () => {
      await api.get("/api/exercises").expect(initialExercises);
    });
    test("responds with 400 status code when missing params", () => {
      expect(1).toBe(0);
    });
  });

  describe("POST /api/exercises - submit exercise", () => {
    const path = "/api/exercises";
    const points = {
      start: "Kasztelańska 9, Kraków, Polska",
      end: "Bajeczna 4a, Kraków, Polska",
    };
    const distance = 12.34;
    test("saves exercise to storage with correct data", async () => {
      const storageBefore = storage.read();

      await api
        .post(path)
        .set("accept", "application/json")
        .send(JSON.stringify(points));

      const storageAfter = storage.read();
      const savedExercise = storageAfter.slice(-1);

      expect(storageAfter.length - storageBefore.length).toBe(1);
      expect(savedExercise).toHaveProperty("date");
      expect(savedExercise).toHaveProperty("distance", distance);
    });
    test("responds with 201 status code", async () => {
      await api.post(path).expect(201);
    });
    test("responds with saved exercise", async () => {
      const exercise = { date: Date.now(), distance: 12.34 };
      await api
        .post(path)
        .set("accept", "application/json")
        .send(JSON.stringify(points))
        .expect(exercise);
    });
  });
});
