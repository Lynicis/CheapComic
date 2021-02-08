const slug = require("slug");

slug.defaults.mode = "lyn";
slug.defaults.modes["lyn"] = {
   replacement: "+",
   lower: true,
};

module.exports = slug;
