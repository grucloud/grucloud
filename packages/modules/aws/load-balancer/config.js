const pkg = require("./package.json");

module.exports = ({ stage }) => ({
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
      http2https: {
        name: `rule-http-redirect-https`,
        properties: () => ({
          Actions: [
            {
              Type: "redirect",
              Order: 1,
              RedirectConfig: {
                Protocol: "HTTPS",
                Port: "443",
                Host: "#{host}",
                Path: "/#{path}",
                Query: "#{query}",
                StatusCode: "HTTP_301",
              },
            },
          ],
          Conditions: [
            {
              Field: "path-pattern",
              Values: ["/*"],
            },
          ],
          Priority: 1,
        }),
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
            Priority: 10,
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
