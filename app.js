"use strict";
const { Command } = require("commander");
const app = new Command();
app.version("1.0.0", "-v, --version", "output app version");
app.parse(process.argv);
