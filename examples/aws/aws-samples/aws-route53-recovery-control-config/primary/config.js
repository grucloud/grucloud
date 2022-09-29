const { pipe, tap, get, not } = require("rubico");
const { includes } = require("rubico/x");

const pkg = require("../package.json");

// https://www.npmjs.com/package/@aws-sdk/credential-providers#fromini
module.exports = () => ({
  projectName: pkg.name,
  credentials: { profile: "regionA" },
  filterTags: pipe([
    tap((params) => {
      //assert(true);
    }),
    get("Key"),
    (key) =>
      pipe([
        () => ["costcenter", "environment", "ManagedBy"],
        not(includes(key)),
      ])(),
  ]),
});
