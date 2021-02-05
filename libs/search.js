var axios = require("./axiosOpt").lynFetch;
var slug = require("slug");
var $ = require("cheerio");
var lyn = require("./slugOpt").lyn;
var db = require("./db").db;
var messages = require("./message");
var okMsg = messages.okMsg;
var errMsg = messages.errMsg;

function readPatternFile() {
   return new Promise(function (resolve, reject) {
      var data = db.get("sites").value();
      if (data.length > 0) {
         resolve(data);
      } else {
         reject("Routine is empty");
      }
   });
}

function formatURl(data, keyword) {
   return data.site_url + data.search_end_point + slug(keyword, lyn);
}

function search(keyword) {
   try {
      readPatternFile()
         .then(function (db) {
            db.map(function (pattern) {
               fetchData(pattern, keyword)
                  .then(function (html) {
                     okMsg(parseHTML(pattern.pattern, html));
                  })
                  .catch(function (err) {
                     errMsg(err);
                  });
            });
         })
         .catch(function (err) {
            errMsg(err);
         });
   } catch (err) {
      errMsg(err);
   }
}

function fetchData(data, keyword) {
   return new Promise(function (resolve, reject) {
      [data].map(function (d) {
         axios
            .get(formatURl(d, keyword))
            .then(function (response) {
               resolve(response.data);
            })
            .catch(function (error) {
               reject(error);
            });
      });
   });
}

function parseHTML(pattern, html) {
   return $(pattern, html).text();
}

module.exports = search;
