const axios = require("../libs/axiosOpt").lynFetch;
const slug = require("slug");
const $ = require("cheerio");
const lyn = require("../libs/slugOpt");
const { db } = require("../libs/db");
const { okMsg, errMsg } = require("./message");

const readPatternFile = () => {
   return new Promise((resolve, reject) => {
      const data = db.get("sites").value();
      if (data.length > 0) {
         resolve(data);
      } else {
         reject("Routine is empty");
      }
   });
};

const formatURl = (data, keyword) => {
   return data.site_url + data.search_end_point + slug(keyword, lyn);
};

const search = (keyword) => {
   try {
      readPatternFile()
         .then((db) => {
            db.map((pattern) => {
               fetchData(pattern, keyword)
                  .then((html) => {
                     okMsg(parseHTML(pattern.pattern, html));
                  })
                  .catch((err) => {
                     errMsg(err);
                  });
            });
         })
         .catch((err) => {
            errMsg(err);
         });
   } catch (err) {
      errMsg(err);
   }
};

const fetchData = (data, keyword) => {
   return new Promise((resolve, reject) => {
      [data].map((d) => {
         axios
            .get(formatURl(d, keyword))
            .then((response) => {
               resolve(response.data);
            })
            .catch((error) => {
               reject(error);
            });
      });
   });
};

const parseHTML = (pattern, html) => {
   return $(pattern, html).text();
};

module.exports = search;
