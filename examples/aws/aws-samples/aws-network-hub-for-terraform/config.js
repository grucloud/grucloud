const { pipe, tap, get, not } = require("rubico");
const { includes } = require("rubico/x");

const pkg = require("./package.json");

module.exports = () => ({
  projectName: pkg.name,
  organisationManagement:
    "arn:aws:organizations::840541460064:organization/o-xs8pjirjbw",
  filterTags: pipe([
    get("Key"),
    (key) =>
      pipe([
        () => [
          "Env",
          "Environment",
          "Owner",
          "Product",
          "Project_ID",
          "automation",
        ],
        not(includes(key)),
      ])(),
  ]),
});
