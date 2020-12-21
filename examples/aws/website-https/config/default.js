const path = require("path");

module.exports = () => ({
  DomainName: "grucloud.org",
  websiteDir: path.resolve(__dirname, "../react-app/build/"),
});
