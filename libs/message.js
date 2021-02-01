const chalk = require("chalk");

function errMsg(data) {
   return console.log(chalk.red("[❗] ") + data);
}

function okMsg(data) {
   return console.log(chalk.green("[✔️] ") + data);
}

module.exports = {
   errMsg,
   okMsg,
};
