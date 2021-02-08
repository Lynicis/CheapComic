const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const dbAdapter = new FileSync("db.json");
const db = low(dbAdapter);

db.defaults({
   sites: [],
   welcomeText: {
      state: true,
   },
}).write();

const pckgAdapter = new FileSync("package.json");
const pckg = low(pckgAdapter);

module.exports = {
   db,
   pckg,
};
