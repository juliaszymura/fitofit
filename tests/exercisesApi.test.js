const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const moment = require("moment");
const groupByDay = require("../utils/groupByDay");
const db = require("../db");

describe("Exercises API", () => {
  const initialExercises = [
    {
      date: moment().subtract(2, "months").toISOString(),
      distance: 6.34,
    },
    {
      date: moment().subtract(7, "days").toISOString(),
      distance: 16.1,
    },
    {
      date: moment().subtract(7, "days").toISOString(),
      distance: 34.68,
    },
    {
      date: moment().toISOString(),
      distance: 1.23,
    },
    {
      date: moment().toISOString(),
      distance: 10.01,
    },
  ];

  beforeAll(async () => await db.init());

  afterAll(async () => {
    await db.query("TRUNCATE exercises");
    await db.end();
  });

  beforeEach(async () => {
    await db.query("TRUNCATE exercises");

    await Promise.all(
      initialExercises.map(
        async (exercise) =>
          await db.query({
            name: "add-exercise-test",
            text: "INSERT INTO exercises (date, distance) VALUES ($1, $2)",
            values: [exercise.date, exercise.distance],
          })
      )
    );
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
      const response = await api.get("/api/exercises");
      expect(response.body).toHaveLength(initialExercises.length);
    });
  });

  describe("GET /api/exercises/grouped/current-month - exercises from current month grouped by day", () => {
    const path = "/api/exercises/grouped/current-month";
    const lastMonth = initialExercises
      .filter((ex) => moment(ex.date).year() === moment().year())
      .filter((ex) => moment(ex.date).month() === moment().month());
    const groupedLastMonth = groupByDay(lastMonth);

    test("responds with 200 status code", async () => {
      await api.get(path).expect(200);
    });

    test("responds with json format", async () => {
      await api.get(path).expect("Content-Type", /application\/json/);
    });

    test("responds with exercises from current month grouped by day", async () => {
      await api.get(path).expect(groupedLastMonth);
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
      const exercisesBefore = await db.query("SELECT * FROM exercises");

      await api.post(path).set("accept", "application/json").send(points);

      const exercisesAfter = await db.query("SELECT * FROM exercises");
      const savedExercise = exercisesAfter.rows.slice(-1).pop();

      expect(exercisesAfter.rows.length - exercisesBefore.rows.length).toBe(1);
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

      await api
        .post(path)
        .set("accept", "application/json")
        .send({ start: points.start, end: 1 })
        .expect(400)
        .expect(errorMessage);
    });
  });
});
