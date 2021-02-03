const { okMsg, errMsg } = require("./message");
const axios = require("axios");
const slug = require("slug");
const $ = require("cheerio");
const { db } = require("./db");

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
   const data = new Array();
   $(pattern, html).map((d) => {
      data.push(d.tex);
   });
   return data;
}

module.exports = {
   search: init,
};
