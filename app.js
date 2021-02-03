#!/usr/bin/env node

const { Command } = require("commander");
const $ = require("chalk");
const figlet = require("figlet");
const inquirer = require("inquirer");
const { pckg, opt } = require("./libs/db");
const { search } = require("./libs/search");
const { okMsg } = require("./libs/message");

const app = new Command();

app.name("cheapComic");
app.usage("[command] <flag>");

const versionTag = `${$.green("Cheap Comic Current Version: ")} ${$.yellow(
   pckg.get("version").value()
)}`;
app.version(versionTag, "-v, --version", "output app version");

app.addHelpText("before", () => {
   const wtState = opt.get("welcomeText").value();
   if (wtState.state === true) {
      console.log(
         $.red(figlet.textSync("Cheap Comic", { font: "Star Wars" })) +
            $.blue("\n'may the cheapest be with you'\n")
      );
   }
});

app.command("wt")
   .description("open/close the welcome text")
   .action(() => {
      const wt = opt.get("welcomeText").value();
      opt.get("welcomeText").set("state", !wt.state).write();
      okMsg("Turn " + wt.state);
   });

app.command("search <keyword>")
   .description("output result")
   .action((keyword) => {
      search(keyword);
   });

app.command("add")
   .description("add site")
   .action(() => {
      inquirer
         .prompt([
            {
               type: "",
            },
         ])
         .then((ans) => {})
         .catch((err) => {});
   });

app.parse(process.argv);
