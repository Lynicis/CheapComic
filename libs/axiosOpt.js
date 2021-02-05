var axios = require("axios");

axios.interceptors.response.use(
   function (response) {
      return Promise.resolve(response);
   },
   function (error) {
      if (error.status === 500) {
         return Promise.reject("Site is down" + error);
      } else if (error.status === 404) {
         return Promise.reject("Wrong page " + error);
      }
      return Promise.reject(error);
   }
);

module.exports = {
   lynFetch: axios,
};
