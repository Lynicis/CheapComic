const { okMsg, errMsg } = require("./message");
const axios = require("axios");
const slug = require("slug");
const $ = require("cheerio");
const { db } = require("./db");
const { keyword } = require("chalk");

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
   return data.site_url + data.search_end_point + slug(keyword);
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
   var elmArr = [];
   var parsed = $(pattern, html);
   parsed.each(function (i, elm) {
      $(elm).each(function (i, elm) {
         if ($(elm).text().includes(keyword) === true) {
            elmArr.push($(elm).text().replace(/\s/g, " "));
         }
      });
   });
   var result = {};
   result.name = elmArr[0].match(keyword);
   //result.price = elmArr[0].match();
   return result.name;
}

module.exports = {
   search: init,
};
