const jsonfile = require("jsonfile");
const fs = require("fs");

const storageFile =
  process.env.NODE_ENV === "test" ? "storage_test.json" : "storage_prod.json";

const add = (object) => {
  const storedExercises = read();
  storedExercises.push(object);
  jsonfile.writeFileSync(storageFile, storedExercises, {
    flag: "w",
    spaces: 2,
  });
};

const read = () => {
  return jsonfile.readFileSync(storageFile, (err, data) => {
    if (err) throw err;
    return data;
  });
};

const clear = () => {
  fs.closeSync(fs.openSync(storageFile, "w"));
};

module.exports = { add, read, clear };
