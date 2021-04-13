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
      web: {
        name: `target-group-web`,
        properties: () => ({
          Port: 30010,
        }),
      },
      rest: {
        name: `target-group-rest`,
        properties: () => ({
          Port: 30020,
          HealthCheckPath: "/api/v1/version",
        }),
      },
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
          name: `rule-rest-http`,
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
          name: `rule-web-http`,
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
      https: {
        rest: {
          name: `rule-rest-https`,
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
          name: `rule-web-https`,
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
