const geocoder = require("./geocoder");
const geolib = require("geolib");

const calculateDistance = async (start, end) => {
  const startGeocoded = await geocoder.geocode(start);
  const endGeocoded = await geocoder.geocode(end);

  // empty array means no results found
  if (startGeocoded.length === 0 || endGeocoded.length === 0) {
    throw new Error("Invalid address");
  } else {
    const startCoordinates = {
      latitude: startGeocoded[0].latitude,
      longitude: startGeocoded[0].longitude,
    };

    const endCoordinates = {
      latitude: endGeocoded[0].latitude,
      longitude: endGeocoded[0].longitude,
    };

    const distance =
      geolib.getDistance(startCoordinates, endCoordinates) / 1000;

    return Number(distance.toFixed(2));
  }
};

module.exports = calculateDistance;
