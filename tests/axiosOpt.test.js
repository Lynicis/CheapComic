var lynFetch = require("../libs/axiosOpt").lynFetch;

test("global axios options", function () {
   return lynFetch.get("http://google.com").then(function (data) {
      expect(data).toBe(data);
   });
});

test("global axios options to false url", function () {
   return lynFetch
      .get("http://asdasda.asda")
      .then(function (data) {
         expect(data).not.toBe(data);
      })
      .catch(function (err) {
         expect(err).toBe(err);
      });
});
