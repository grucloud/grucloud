const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  namespace: "myapp",
  appLabel: "nginx-label",
  service: { name: "nginx-service" },
  deployment: { name: "nginx-deployment" },
});
