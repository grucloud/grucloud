const pkg = require("./package.json");

module.exports = ({ stage }) => ({
  projectName: () => "grucloud-e2e",
  projectId: () => "grucloud-e2e",
  region: "europe-west4",
  zone: "europe-west4-a",
  domainName: "grucloud.org",
});
