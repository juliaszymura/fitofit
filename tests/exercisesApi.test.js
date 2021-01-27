const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const storage = require("../utils/storage");

describe("Exercise API", () => {
  const initialExercises = [
    {
      date: "2021-01-27T20:56:59.806Z",
      distance: 1.23,
    },
    {
      date: "2021-01-27T21:56:59.806Z",
      distance: 10.01,
    },
  ];
  beforeEach(() => {
    storage.clear();
    initialExercises.forEach((exercise) => storage.add(exercise));
  });

  describe("GET /api/exercises - all exercises", () => {
    test("responds with 200 status code", async () => {
      await api.get("/api/exercises").expect(200);
    });
    test("responds with all entries", async () => {
      await api.get("/api/exercises").expect(initialExercises);
    });
  });

  describe("POST /api/exercises - submit exercise", () => {
    const path = "/api/exercises";
    const points = {
      start: "Wawel 5, Kraków, Polska",
      end: "Waszyngtona 1, Kraków, Polska",
    };
    const distance = 2.92;

    test("saves exercise to storage with correct data", async () => {
      const exercisesBefore = storage.read().exercises;

      await api.post(path).set("accept", "application/json").send(points);

      const exercisesAfter = storage.read().exercises;
      const savedExercise = exercisesAfter.slice(-1).pop();
      console.log(savedExercise);

      expect(exercisesAfter.length - exercisesBefore.length).toBe(1);
      expect(savedExercise).toHaveProperty("date");
      expect(savedExercise).toHaveProperty("distance", distance);
    });

    test("responds with 201 status code", async () => {
      await api.post(path).expect(201);
    });

    test("responds with saved exercise", async () => {
      const response = await api
        .post(path)
        .set("accept", "application/json")
        .send(points);

      expect(response.body).toHaveProperty("date");
      expect(response.body).toHaveProperty("distance", distance);
    });

    test("responds with 400 status code when missing params", () => {
      expect(1).toBe(0);
    });
  });
});
