const pkg = require("./package.json");
module.exports = ({ stage }) => ({
  projectName: pkg.projectName,
  certificate: {
    rootDomainName: "grucloud.org",
    domainName: "starhackit-eks-lean.grucloud.org",
  },
  eks: { cluster: { name: `cluster-${pkg.projectName}` } },
  elb: {
    loadBalancer: { name: `load-balancer-${pkg.projectName}` },
    targetGroups: {
      web: { name: `target-group-web-${pkg.projectName}`, port: 300 },
      rest: { name: `target-group-rest-${pkg.projectName}`, port: 900 },
    },
    listeners: {
      http: { name: `listener-http-${pkg.projectName}`, port: 80, rules: [] },
      https: {
        name: `listener-https-${pkg.projectName}`,
        port: 443,
      },
    },
    rules: {
      http: {
        rest: {
          name: `rule-rest`,
          properties: ({ dependencies: { targetGroup } }) => ({
            Actions: [
              {
                TargetGroupArn: targetGroup.live?.TargetGroupArn,
                Type: "forward",
              },
            ],
            Conditions: [
              {
                Field: "path-pattern",
                Values: ["/api/*"],
              },
            ],
            Priority: 100,
          }),
        },
        web: {
          name: `rule-web`,
          properties: ({ dependencies: { targetGroup } }) => ({
            Actions: [
              {
                TargetGroupArn: targetGroup.live?.TargetGroupArn,
                Type: "forward",
              },
            ],
            Conditions: [
              {
                Field: "path-pattern",
                Values: ["/*"],
              },
            ],
            Priority: 11,
          }),
        },
      },
    },
  },
});
