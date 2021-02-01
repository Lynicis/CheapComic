"use strict";

const fs = require("fs");
const axios = require("axios");
const chalk = require("chalk");
const slug = require("slug");
const $ = require("cheerio");

function errMsg(data) {
   return chalk.red("[❗]") + data;
}

function okMsg(data) {
   return chalk.green("[✔️]") + data;
}

function readPatternFile() {
   try {
      fs.readFileSync("sites.json", (err, data) => {
         const json = JSON.parse(data);
         // console.log("Read the pattern.json file.");
         console.log(json.sites);
         return json.sites;
      });
   } catch (err) {
      console.log(errMsg(err));
   }
}

function formatURl(data, keyword) {
   console.log("Formated URl.");
   return (
      (data.https ? "https://" : "http://") +
      data.site_url +
      data.site_end_point +
      slug(keyword)
   );
}

function init(keyword) {
   try {
      console.log(okMsg("Start to process."));
      const data = {};
      fetchData(keyword).then((res) => (data.html = res));
      readPatternFile().then((pattern) => (data.pattern = pattern));
      console.log(okMsg("Finish to process"));
      return data.json();
   } catch (err) {
      console.log(okMsg(`Process is down, message: ${err}`));
   }
}

function fetchData(keyword) {
   console.log(okMsg("Fetcing data..."));
   const data = readPatternFile();
   data.map(async (d) => {
      return await axios
         .get(formatURl(d, keyword))
         .then((res) => res.data)
         .catch((err) => console.log(errMsg("Fetching error.")));
   });
   console.log(okMsg("Successfully fetched data."));
}

function parseHTML(data) {
   console.log(okMsg("Parsed HTML."));
   return $(data.pattern, data.html).text;
}

module.exports = {
   search: init,
};
