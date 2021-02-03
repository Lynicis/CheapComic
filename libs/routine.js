const inquirer = require("inquirer");
const { db } = require("./db");

function checkValidate(input) {
   return new Promise((resolve) => {
      if (input != "" || input != null) {
         resolve(input);
      }
   });
}

function checkPrefix(input) {
   return new Promise((resolve) => {
      const prefix = input.search(/(https?)([:][\/]{2})/);
      if (prefix === 0) {
         resolve(input);
         return true;
      }
   });
}

function addRoutine() {
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
               https: ans.siteURl == "http" ? false : true,
               site_url: ans.siteURl,
               search_end_point: ans.siteSearch,
               pattern: ans.sitePattern,
            })
            .write();
      })
      .catch((err) => {
         errMsg(`Upss.. I have a error. Message: ${err}`);
      });
}

module.exports = {
   addRoutine,
};
