const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const storage = require("../utils/storage");

describe("Exercise API", () => {
  const initialExercises = [
    {
      date: "2021-01-03T20:56:59.806Z",
      distance: 6.34,
    },
    {
      date: "2021-01-12T21:56:59.806Z",
      distance: 16.1,
    },
    {
      date: "2021-01-17T21:56:59.806Z",
      distance: 34.68,
    },
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

    test("responds with json format", async () => {
      await api
        .get("/api/exercises")
        .expect("Content-Type", /application\/json/);
    });

    test("responds with all entries", async () => {
      await api.get("/api/exercises").expect(initialExercises);
    });
  });

  describe("GET /api/exercises/grouped/current-month - exercises from current month grouped by day", () => {
    const path = "/api/exercises/grouped/current-month";
    const groupedByDay = {
      "2021-01-03": 6.34,
      "2021-01-12": 16.1,
      "2021-01-17": 34.68,
      "2021-01-27": 11.24,
    };

    test("responds with 200 status code", async () => {
      await api.get(path).expect(200);
    });

    test("responds with json format", async () => {
      await api.get(path).expect("Content-Type", /application\/json/);
    });

    test("responds with exercises from current month grouped by day", async () => {
      await api.get(path).expect(groupedByDay);
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

      expect(exercisesAfter.length - exercisesBefore.length).toBe(1);
      expect(savedExercise).toHaveProperty("date");
      expect(savedExercise).toHaveProperty("distance", distance);
    });

    test("responds with 201 status code", async () => {
      await api
        .post(path)
        .set("accept", "application/json")
        .send(points)
        .expect(201);
    });

    test("responds with saved exercise", async () => {
      const response = await api
        .post(path)
        .set("accept", "application/json")
        .send(points);

      expect(response.body).toHaveProperty("date");
      expect(response.body).toHaveProperty("distance", distance);
    });

    test("responds with 400 status code and error message when missing address", async () => {
      const errorMessage = { error: "missing start or end address" };
      await api
        .post(path)
        .set("accept", "application/json")
        .expect(400)
        .expect(errorMessage);

      await api
        .post(path)
        .set("accept", "application/json")
        .send(points.start)
        .expect(400)
        .expect(errorMessage);

      await api
        .post(path)
        .set("accept", "application/json")
        .send(points.end)
        .expect(400)
        .expect(errorMessage);
    });

    test("responds with 400 status code and error message when provided incorrect address", async () => {
      const errorMessage = { error: "invalid address" };

      await api
        .post(path)
        .set("accept", "application/json")
        .send({ start: "hdfjdhfjdfshf", end: points.end })
        .expect(400)
        .expect(errorMessage);
    });
  });
});
