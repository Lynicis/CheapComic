var low = require("lowdb");
var FileSync = require("lowdb/adapters/FileSync");

var dbAdapter = new FileSync("db.json");
var db = low(dbAdapter);

db.defaults({
   sites: [],
   welcomeText: {
      state: true,
   },
}).write();

var pckgAdapter = new FileSync("package.json");
var pckg = low(pckgAdapter);

module.exports = {
   db: db,
   pckg: pckg,
};
