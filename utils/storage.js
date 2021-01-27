const jsonfile = require("jsonfile");

const storageFile =
  process.env.NODE_ENV === "test" ? "storage_test.json" : "storage_prod.json";

const save = (object) => {
  jsonfile.writeFileSync(storageFile, object, { flag: "a" });
};

const read = () => {
  return jsonfile.readFileSync(storageFile, (err, data) => {
    if (err) throw err;
    return data;
  });
};

module.exports = { save, read };
