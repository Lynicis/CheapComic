var axios = require("axios");
var errMsg = require("./message").errMsg;

axios.interceptors.response.use(
   function (response) {
      return Promise.resolve(response);
   },
   function (error) {
      if (error.status === 500) {
         errMsg("Site is down" + error);
      } else if (error.status === 404) {
         errMsg("Wrong page " + error);
      }
      errMsg(error);
   }
);

module.exports = {
   lynFetch: axios,
};
