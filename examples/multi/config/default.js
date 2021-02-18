const pkg = require("../package.json");

module.exports = () => ({
  google: {
    projectName: () => "grucloud-e2e",
    projectId: () => "grucloud-e2e",
    region: "europe-west4",
    zone: "europe-west4-a",
    domainName: "grucloud.org",
  },
  aws: {
    projectName: pkg.name,
    region: "eu-west-2",
    zone: "eu-west-2a",
  },
  azure: {
    location: "uksouth",
  },
  k8s: { projectName: pkg.name },
  scaleway: {
    zone: "fr-par-1",
  },
});
