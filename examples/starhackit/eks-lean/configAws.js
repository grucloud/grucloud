const pkg = require("./package.json");
module.exports = ({ stage }) => ({
  projectName: pkg.projectName,
  certificate: {
    rootDomainName: "grucloud.org",
    domainName: "starhackit-eks-lean.grucloud.org",
  },
  eks: { cluster: { name: `cluster` } },
  elb: {
    loadBalancer: { name: `load-balancer` },
    targetGroups: {
      web: { name: `target-group-web`, nodePort: 30010 },
      rest: { name: `target-group-rest`, nodePort: 30020 },
    },
    listeners: {
      http: { name: `listener-http`, port: 80, rules: [] },
      https: {
        name: `listener-https`,
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
