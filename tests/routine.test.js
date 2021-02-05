var routine = require("../libs/routine.js");
var checkValidate = routine.checkValidate;
var checkPrefix = routine.checkPrefix;

test("check validate", () => {
   const fakeData = "test";

   return checkValidate(fakeData).then((ans) => {
      expect(ans).toBe(fakeData);
   });
});

test("false data to check validate", () => {
   const fakeData = null;

   return checkValidate(fakeData).then((ans) => {
      expect(ans);
   });
});

test("check prefix", () => {
   const fakeData = "http://aga.io";

   return checkPrefix(fakeData).then((ans) => {
      expect(ans).toBe(ans);
   });
});

test("check prefix to false data", () => {
   const fakeData = "http://aga.io";

   return checkPrefix(fakeData).then((ans) => {
      expect(ans);
   });
});
