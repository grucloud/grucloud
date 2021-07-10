exports.configTpl = (content) => `const pkg = require("./package.json");
module.exports = ({ stage }) => ({
  projectName: pkg.name,
  ${content}
});`;
