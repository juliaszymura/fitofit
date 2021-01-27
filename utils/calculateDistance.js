const geocoder = require("./geocoder");
const geolib = require("geolib");

const calculateDistance = async (start, end) => {
  try {
    const startGeocoded = await geocoder.geocode(start);
    const endGeocoded = await geocoder.geocode(end);

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

    return distance;
  } catch (error) {
    console.error(error);
  }
};

module.exports = calculateDistance;
