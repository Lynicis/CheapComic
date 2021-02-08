#!/usr/bin/env node

const { Command } = require("commander");
const chalk = require("chalk");
const figlet = require("figlet");
const { db, pckg } = require("./libs/db");
const search = require("./commands/search");
const { okMsg } = require("./commands/message");
const { addRoutine, deleteRoutine } = require("./commands/routine");

const app = new Command();

app.name("cheapComic");
app.usage("<command> [flag]");

const versionTag =
   chalk.green("Cheap Comic Current Version: ") +
   chalk.yellow(pckg.get("version").value());
app.version(versionTag, "-v, --version", "output app version");

app.addHelpText("before", function () {
   const wtState = db.get("welcomeText").value();
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
      const wt = db.get("welcomeText").value();
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

app.parse(process.argv);
