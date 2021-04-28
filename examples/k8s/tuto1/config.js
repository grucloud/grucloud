const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  namespace: "myapp",
  appLabel: "nginx-label",
  service: { name: "nginx-service" },
  deployment: {
    name: "nginx-deployment",
    container: { name: "nginx", image: "nginx:1.14.2" },
  },
});
