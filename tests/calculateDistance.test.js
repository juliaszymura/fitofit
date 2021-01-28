const calculateDistance = require("../utils/calculateDistance");

describe("Calculate distance for valid addresses", () => {
  const start = "Wawel 5, Kraków, Polska";
  const end = "Waszyngtona 1, Kraków, Polska";
  test("calculates distance correctly", async () => {
    const distance = await calculateDistance(start, end);

    expect(distance).toBe(2.92);
  });

  test("throws error when address is invalid", async () => {
    await expect(calculateDistance("hdsfhjhfsd", end)).rejects.toThrow(
      "Invalid address"
    );
  });
});
