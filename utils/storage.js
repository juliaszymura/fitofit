const jsonfile = require("jsonfile");

const storageFile =
  process.env.NODE_ENV === "test" ? "storage_test.json" : "storage_prod.json";

const add = (exercise) => {
  const stored = read();
  stored.exercises.push(exercise);

  jsonfile.writeFileSync(storageFile, stored, {
    flag: "w",
    spaces: 2,
  });
};

const read = () => {
  return jsonfile.readFileSync(storageFile);
};

const clear = () => {
  jsonfile.writeFileSync(
    storageFile,
    { exercises: [] },
    {
      flag: "w",
      spaces: 2,
    }
  );
};

module.exports = { add, read, clear };
