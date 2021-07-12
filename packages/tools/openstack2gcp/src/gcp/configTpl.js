exports.configTpl = (content) => `const pkg = require("./package.json");
module.exports = ({ stage }) => ({
  projectId: pkg.name,
  ${content}
});`;
