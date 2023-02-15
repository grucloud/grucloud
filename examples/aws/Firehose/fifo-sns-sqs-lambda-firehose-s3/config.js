const pkg = require("./package.json");
const { pipe, tap, get, not } = require("rubico");
const { includes, isIn } = require("rubico/x");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: ["Firehose", "IAM", "S3", "Lambda", "SNS", "SQS"],
  filterTags: pipe([
    get("Key"),
    not(isIn(["pattern", "repository", "deployed_by"])),
  ]),
});
