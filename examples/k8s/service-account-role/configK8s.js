const pkg = require("./package.json");

module.exports = () => ({
  projectName: pkg.name,
  namespaceName: "default",
  domainName: "grucloud.org",
  ui: {
    serviceName: "web",
    deploymentName: "web",
    label: "ui",
    port: 80,
    containerPort: 3000,
  },
});
