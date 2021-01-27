const calculateDistance = require("../utils/calculateDistance");

describe("Calculate distance from geocode", () => {
  test("calculates distance correctly", async () => {
    const distance = await calculateDistance(
      "Wawel 5, Kraków, Polska",
      "Waszyngtona 1, Kraków, Polska"
    );

    expect(distance).toBe(2.92);
  });
});
