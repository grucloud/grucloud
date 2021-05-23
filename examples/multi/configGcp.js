const pkg = require("./package.json");

module.exports = ({ stage }) => ({
  projectId: "grucloud-test",
  region: "europe-west4",
  zone: "europe-west4-a",
  domainName: "grucloud.org",
});
