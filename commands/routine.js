const inquirer = require("inquirer");
const { table, getBorderCharacters } = require("table");
const chalk = require("chalk");
const { db } = require("../libs/db");
const { okMsg, errMsg } = require("./message");

const checkValidate = (input) => {
   return new Promise((resolve) => {
      if (input != "") {
         resolve(input);
      }
   });
};

const checkPrefix = (input) => {
   return new Promise((resolve) => {
      const prefix = input.search(/(https?)([:]\/{2})/g);
      if (prefix > -1) {
         resolve(input);
      }
   });
};

const addRoutine = () => {
   inquirer
      .prompt([
         {
            type: "input",
            message: "The name of the site you want to add to your routine?",
            name: "siteName",
            filter: checkValidate,
         },
         {
            type: "input",
            message:
               "The url of the site you want to add to your routine? (with http or https)",
            name: "siteURl",
            filter: checkPrefix,
         },
         {
            type: "input",
            message:
               "The search endpoint of the site you want to add to your routine?",
            name: "siteSearch",
            filter: checkValidate,
         },
         {
            type: "input",
            message:
               "The site pattern of the site you want to add to your routine? (will be here url)",
            name: "sitePattern",
            filter: checkValidate,
         },
         {
            type: "confirm",
            message: "Do you really want to add this site to your routine?",
            default: true,
            name: "routineConfirm",
            filter: checkValidate,
         },
      ])
      .then((ans) => {
         db.get("sites")
            .push({
               site_name: ans.siteName,
               site_url: ans.siteURl,
               search_end_point: ans.siteSearch,
               pattern: ans.sitePattern,
            })
            .write();
      })
      .catch((err) => {
         errMsg("Upss.. I have a error. Message: " + err);
      });
};

const deleteRoutine = (siteName) => {
   try {
      db.get("sites").remove({ site_name: siteName }).write();
      okMsg("Successfully deleted site from routine.");
   } catch (error) {
      errMsg(error);
   }
};

const listRoutine = () => {
   const sitesDB = db.get("sites").value();
   if (sitesDB.length > 0) {
      let col = [
            [
               chalk.red("ID"),
               chalk.blue("Site Name"),
               chalk.blue("Site URl"),
               chalk.blue("Site Endpoint"),
               chalk.blue("Site Pattern"),
            ],
         ],
         count = 0;
      sitesDB.map((elm) => {
         count++;
         col.push([
            chalk.red(count),
            elm.site_name,
            elm.site_url,
            elm.search_end_point,
            elm.pattern,
         ]);
      });
      console.log(
         table(col, {
            border: getBorderCharacters(`norc`),
         })
      );
   } else {
      errMsg("Routine is empty.");
   }
};

module.exports = {
   addRoutine,
   deleteRoutine,
   listRoutine,
};
