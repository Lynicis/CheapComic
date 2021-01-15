const { Command } = require("commander");
const $ = require("chalk");
// const commands = require("./libs/commands");

const app = new Command();
app.name("cheapComic");
app.usage("[command] <flag>");
const versionTag = `${$.green("Cheap Comic Current Version: ")} ${$.yellow(
  "1.0.0"
)} - ${$.magenta("alanMoore-watchmen")}`;
app.version(versionTag, "-v, --version", "output app version");

app.parse(process.argv);
