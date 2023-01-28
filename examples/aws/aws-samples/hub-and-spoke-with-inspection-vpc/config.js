const { pipe, tap, get, not } = require("rubico");
const { includes } = require("rubico/x");

const pkg = require("./package.json");

module.exports = () => ({
  projectName: pkg.name,
  includeGroups: ["CloudWatchLogs", "EC2", "IAM", "KMS", "NetworkFirewall"],
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
