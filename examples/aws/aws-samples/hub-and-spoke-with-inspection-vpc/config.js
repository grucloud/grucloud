const { pipe, tap, get, not } = require("rubico");
const { includes } = require("rubico/x");

const pkg = require("./package.json");

module.exports = () => ({
  projectName: pkg.name,
  filterTags: pipe([
    get("Key"),
    (key) =>
      pipe([
        () => [
          "createdBy",
          "Environment",
          "environment",
          "Owner",
          "Project",
          "Provisioner",
        ],
        not(includes(key)),
      ])(),
  ]),
});
