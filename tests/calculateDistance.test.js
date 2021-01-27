const calculateDistance = require("../utils/calculateDistance");

describe("Calculate distance from geocode", () => {
  test("calculates distance correctly", async () => {
    const distance = await calculateDistance(
      "Gliniana 16, Kraków, Polska",
      "Kasztelańska 9, Kraków, Polska"
    );

    expect(distance).toBe(6.038);
  });
});
