#!/usr/bin/env node

var Command = require("commander").Command;
var chalk = require("chalk");
var figlet = require("figlet");
var lowdb = require("./libs/db");
var db = lowdb.db;
var pckg = lowdb.pckg;
var search = require("./libs/search").search;
var messages = require("./libs/message");
var okMsg = messages.okMsg;
var routine = require("./libs/routine");
var addRoutine = routine.addRoutine;
var deleteRoutine = routine.deleteRoutine;

var app = new Command();

app.name("cheapComic");
app.usage("<command> [flag]");

var versionTag =
   chalk.green("Cheap Comic Current Version: ") +
   chalk.yellow(pckg.get("version").value());
app.version(versionTag, "-v, --version", "output app version");

app.addHelpText("before", function () {
   var wtState = db.get("welcomeText").value();
   if (wtState.state === true) {
      console.log(
         chalk.red(figlet.textSync("Cheap Comic", { font: "Star Wars" })) +
            chalk.blue("\n'may the cheapest be with you'\n")
      );
   }
});

app.command("wt")
   .description("open/close the welcome text")
   .action(function () {
      var wt = db.get("welcomeText").value();
      db.get("welcomeText").set("state", !wt.state).write();
      okMsg("Turn " + wt.state);
   });

app.command("search <keyword>")
   .description("output result")
   .action(function (keyword) {
      search(keyword);
   });

app.command("add")
   .description("add site to routine")
   .action(function () {
      addRoutine();
   });

app.command("delete <keyword>")
   .description("delete site from routine")
   .action(function (keyword) {
      deleteRoutine(keyword);
   });

app.parse();
