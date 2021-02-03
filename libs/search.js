var axios = require("axios");
var slug = require("slug");
var $ = require("cheerio");
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
   return data.site_url + data.search_end_point + slug(keyword);
}

function search(keyword) {
   try {
      readPatternFile()
         .then(function (pattern) {
            fetchData(pattern, keyword)
               .then(function (html) {
                  pattern.map(function (p) {
                     okMsg(parseHTML(p.pattern, html, keyword));
                  });
               })
               .catch(function (err) {
                  errMsg(err);
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
      data.map(function (d) {
         axios
            .get(formatURl(d, keyword))
            .then(function (res) {
               resolve(res.data);
            })
            .catch(function (err) {
               reject(err);
            });
      });
   });
}

function parseHTML(pattern, html, keyword) {
   var parsed = $(pattern, html);
   var elmArr = [];
   parsed.each(function (i, elm) {
      $(elm).each(function (i, elm) {
         if ($(elm).text().includes(keyword) === true) {
            elmArr.push($(elm).text().replace(/\s/g, ""));
         }
      });
   });
   var result = {};
   result.name = elmArr[0].match(keyword);
   return result;
}

module.exports = {
   search: search,
};
