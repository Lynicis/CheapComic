#!/usr/bin/env node

"use strict";

const { Command } = require("commander");
const $ = require("chalk");
const figlet = require("figlet");
const { search } = require("./libs/search");
const chalk = require("chalk");

// ======= LowDB =========
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("options.json");
const db = low(adapter);

const pckgAdapter = new FileSync("package.json");
const pckg = low(pckgAdapter);

// Write global option
db.defaults({ welcomeText: { state: true } }).write();

// =======================

const app = new Command();

app.name("cheapComic");
app.usage("[command] <flag>");

const versionTag = `${$.green("Cheap Comic Current Version: ")} ${$.yellow(
   pckg.get("version").value()
)}`;
app.version(versionTag, "-v, --version", "output app version");

app.addHelpText("before", () => {
   const wtState = db.get("welcomeText").value();
   if (wtState.state === true) {
      console.log(chalk.blue(figlet.textSync("CheapComic")));
      console.log("\n");
   }
});

app.command("wt")
   .description("open/close the welcome text")
   .action(() => {
      const wt = db.get("welcomeText").value();
      db.get("welcomeText").set("state", !wt.state).write();
      console.log("Turn " + wt.state);
   });

app.command("search <keyword>")
   .description("output result")
   .action((keyword) => {
      search(keyword);
   });

app.parse(process.argv);
