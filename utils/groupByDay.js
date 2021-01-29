const groupByDay = (exercises) => {
  return exercises.reduce((acc, x) => {
    const date = x.date.slice(0, 10);
    acc = {
      ...acc,
      [date]: acc[date] + x.distance || x.distance,
    };
    return acc;
  }, {});
};

module.exports = groupByDay;
