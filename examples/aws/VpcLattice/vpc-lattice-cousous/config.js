const pkg = require("./package.json");
const { pipe, tap, get, not } = require("rubico");
const { isIn } = require("rubico/x");

module.exports = () => ({
  projectName: pkg.name,
  includeGroups: [
    "EC2",
    "ECS",
    "ElasticLoadBalancingV2",
    "IAM",
    "Lambda",
    "VpcLattice",
  ],
  filterTags: pipe([get("Key"), not(isIn(["Owner", "Project"]))]),
});
