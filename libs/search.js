"use strict";

const { okMsg, errMsg } = require("./message");
const axios = require("axios");
const slug = require("slug");
const $ = require("cheerio");

// ======= LowDB =========
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const { parse } = require("commander");
const adapter = new FileSync("sites.json");
const db = low(adapter);
// =======================

function readPatternFile() {
   return new Promise((resolve, reject) => {
      try {
         const data = db.get("sites").value();
         resolve(data);
      } catch (err) {
         reject(err);
      }
   });
}

function formatURl(data, keyword) {
   const format =
      (data.https ? "https://" : "http://") +
      data.site_url +
      data.search_end_point +
      slug(keyword);
   console.log(format);
   return format;
}

function init(keyword) {
   try {
      readPatternFile()
         .then((pattern) => {
            fetchData(pattern, keyword)
               .then((html) => {
                  pattern.map((p) => {
                     okMsg(parseHTML(p.pattern, html));
                  });
               })
               .catch((err) => errMsg(err));
         })
         .catch((err) => errMsg(err));
   } catch (err) {
      errMsg(err);
   }
}

function fetchData(data, keyword) {
   return new Promise((resolve, reject) => {
      data.map((d) => {
         axios
            .get(formatURl(d, keyword))
            .then((res) => {
               resolve(res.data);
            })
            .catch((err) => reject(err));
      });
   });
}

function parseHTML(pattern, html) {
   return $(pattern, html);
}

module.exports = {
   search: init,
};
