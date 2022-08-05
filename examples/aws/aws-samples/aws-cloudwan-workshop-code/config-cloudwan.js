const { pipe, tap, get, not } = require("rubico");
const { includes } = require("rubico/x");

const pkg = require("./package.json");

// https://www.npmjs.com/package/@aws-sdk/credential-providers#fromini
module.exports = () => ({
  projectName: pkg.name,
  credentials: { profile: "oregon" },
  filterTags: pipe([
    get("Key"),
    (key) => pipe([() => ["Project", "Terraform"], not(includes(key))])(),
  ]),
});
