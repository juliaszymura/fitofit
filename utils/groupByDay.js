const groupByDay = (exercises) => {
  return exercises.reduce((acc, x) => {
    const date = x.date.split("T")[0];
    acc = {
      ...acc,
      [date]: acc[date] + x.distance || x.distance,
    };
    return acc;
  }, {});
};

module.exports = groupByDay;
