const { pipe, tap, get, not } = require("rubico");
const { includes } = require("rubico/x");

const pkg = require("./package.json");

module.exports = () => ({
  projectName: pkg.name,
  includeGroups: [
    "CloudWatchLogs",
    "EC2",
    "IAM",
    "KMS",
    "NetworkFirewall",
    "Organisations",
    "RAM",
    "Route53",
    "Route53Resolver",
    "SSM",
  ],
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
