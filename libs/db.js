const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const dbAdapter = new FileSync("../sites.json");
const db = low(dbAdapter);

const optAdapter = new FileSync("../options.json");
const opt = low(optAdapter);
opt.defaults({ welcomeText: { state: true } }).write();

const pckgAdapter = new FileSync("../package.json");
const pckg = low(pckgAdapter);

module.exports = {
   db,
   pckg,
   opt,
};
