"use strict";

const { okMsg, errMsg } = require("./message");
const axios = require("axios");
const slug = require("slug");
const $ = require("cheerio");

// ======= LowDB =========
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("sites.json");
const db = low(adapter);
// =======================

function readPatternFile() {
   try {
      okMsg("Read pattern.");
      return db.get("sites").value();
   } catch (err) {
      errMsg(err);
   }
}

function formatURl(data, keyword) {
   okMsg("Fetched data.");
   return (
      (data.https ? "https://" : "http://") +
      data.site_url +
      data.site_end_point +
      slug(keyword)
   );
}

function init(keyword) {
   try {
      okMsg("Start to process.");
      const data = {};
      fetchData(keyword).then((res) => (data.html = res));
      readPatternFile().then((pattern) => (data.pattern = pattern));
      okMsg("Finish to process");
      return data.json();
   } catch (err) {
      okMsg(`Process is down, message: ${err}`);
   }
}

function fetchData(keyword) {
   okMsg("Fetcing data...");
   const data = readPatternFile();
   data.map(async (d) => {
      return await axios
         .get(formatURl(d, keyword))
         .then((res) => res.data)
         .catch((err) => console.log(errMsg("Fetching error.")));
   });
   okMsg("Successfully fetched data.");
}

function parseHTML(data) {
   okMsg("Parsed HTML.");
   return $(data.pattern, data.html).text;
}

module.exports = {
   search: init,
};
