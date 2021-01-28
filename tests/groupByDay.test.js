const groupByDay = require("../utils/groupByDay");

describe("Group exercises by day", () => {
  const exercises = [
    {
      date: "2021-01-12T21:56:59.806Z",
      distance: 16.1,
    },
    {
      date: "2021-01-17T05:56:59.806Z",
      distance: 1.11,
    },
    {
      date: "2021-01-17T13:56:59.806Z",
      distance: 2.22,
    },
    {
      date: "2021-01-17T21:56:59.806Z",
      distance: 3.33,
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

  const expected = {
    "2021-01-12": 16.1,
    "2021-01-17": 6.66,
    "2021-01-27": 11.24,
  };

  test("groups exercises by day", () => {
    const result = groupByDay(exercises);
    expect(Object(result).keys).toEqual(Object(expected).keys);
  });

  test("adds exercise distance from same day", () => {
    const result = groupByDay(exercises);
    expect(Object(result).values).toEqual(Object(expected).values);
  });
});
