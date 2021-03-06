const axios = require("../libs/axiosOpt");
const slug = require("slug");
const $ = require("cheerio");
const lyn = require("../libs/slugOpt");
const { db } = require("../libs/db");
const { okMsg, errMsg } = require("./message");
const chalk = require("chalk");

let globalKeyword = "";

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
      globalKeyword = keyword;
      readPatternFile()
         .then((db) => {
            db.map((pattern) => {
               fetchData(pattern, keyword)
                  .then((html) => {
                     okMsg(parseHTML(pattern.pattern, html));
                     console.log(
                        `${chalk.yellow(
                           "tip: If your saw empty. You can use this command 'cheapComic edit <name>'"
                        )}`
                     );
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
      [data].forEach((d) => {
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
   const parsed = $(pattern, html);
   const possibleElms = [];
   parsed.each((i, elm) => {
      if ($(elm).text().includes(globalKeyword) === true) {
         possibleElms.push(
            $(elm)
               .text()
               .split(/\w\//g)
               .filter((filterElm) => filterElm)
         );
         console.log($(elm).text());
      }
   });
   return possibleElms;
};

module.exports = search;
