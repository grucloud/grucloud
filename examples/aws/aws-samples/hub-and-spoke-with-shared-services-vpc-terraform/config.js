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
    "Route53",
    "Route53Resolver",
  ],

  filterTags: pipe([
    tap((params) => {
      //assert(true);
    }),
    get("Key"),
    (key) =>
      pipe([
        () => ["Project", "automation", "Terraform", "Region"],
        not(includes(key)),
      ])(),
  ]),
});
