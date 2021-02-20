const axios = require("axios");

axios.interceptors.response.use(
   (response) => Promise.resolve(response),
   (error) => {
      if (error.status === 500) {
         return Promise.reject("Site is down" + error);
      } else if (error.status === 404) {
         return Promise.reject("Wrong page " + error);
      }
      return Promise.reject(error);
   }
);

module.exports = axios;
