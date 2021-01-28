const pkg = require("../package.json");
const path = require("path");

module.exports = () => ({
  projectName: pkg.name,
  DomainName: "grucloud.org",
  websiteDir: path.resolve(__dirname, "../vue-app/dist/"),
});
