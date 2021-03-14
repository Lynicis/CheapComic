const chalk = require("chalk");

const errMsg = (data) => {
   return console.log(chalk.red("[!] ") + data);
};

const okMsg = (data) => {
   return console.log(chalk.green("[✔️] ") + data);
};

module.exports = {
   errMsg,
   okMsg,
};
