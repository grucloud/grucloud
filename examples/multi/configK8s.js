const pkg = require("./package.json");

module.exports = ({ region, stage }) => ({
  k8s: { projectName: pkg.name },
});
