const pkg = require("./package.json");

module.exports = ({}) => ({
  projectName: pkg.name,
  awsLoadBalancerController: {
    iamOpenIdConnectProvider: { name: "oidc-eks" },
    role: { name: "role-load-balancer" },
  },
});
