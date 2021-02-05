var slug = require("slug");

slug.defaults.mode = "lyn";
slug.defaults.modes["lyn"] = {
   replacement: "+",
};

module.exports = {
   lyn: slug,
};
