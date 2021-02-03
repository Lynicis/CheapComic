var inquirer = require("inquirer");
var db = require("./db").db;
var messages = require("./message");
var errMsg = messages.errMsg;
var okMsg = messages.okMsg;

function checkValidate(input) {
   return new Promise(function (resolve) {
      input.trim();
      if (input != "") {
         resolve(input);
      }
   });
}

function checkPrefix(input) {
   return new Promise(function (resolve) {
      var prefix = input.search(/(https?)([:][\/]{2})/);
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
      .then(function (ans) {
         db.get("sites")
            .push({
               site_name: ans.siteName,
               site_url: ans.siteURl,
               search_end_point: ans.siteSearch,
               pattern: ans.sitePattern,
            })
            .write();
      })
      .catch(function (err) {
         errMsg("Upss.. I have a error. Message: " + err);
      });
}

function deleteRoutine(siteName) {
   try {
      db.get("sites").remove({ site_name: siteName }).write();
      okMsg("Successfully deleted site from routine.");
   } catch (error) {
      errMsg(error);
   }
}

module.exports = {
   addRoutine: addRoutine,
   deleteRoutine: deleteRoutine,
};
