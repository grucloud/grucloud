const pkg = require("./package.json");

module.exports = ({ stage }) => ({
  elb: {
    loadBalancer: { name: `load-balancer` },
    targetGroups: {
      web: {
        name: `target-group-web`,
        properties: {
          Port: 30010,
        },
      },
      rest: {
        name: `target-group-rest`,
        properties: {
          Port: 30020,
          HealthCheckPath: "/api/v1/version",
        },
      },
    },
    listeners: {
      http: { name: `listener-http` },
      https: { name: `listener-https` },
    },
    rules: {
      http2https: {
        name: `rule-http-redirect-https`,
        properties: {
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
        },
      },
      https: {
        rest: {
          name: `rule-rest-https`,
          properties: {
            Conditions: [
              {
                Field: "path-pattern",
                Values: ["/api/*"],
              },
            ],
            Priority: 10,
          },
        },
        web: {
          name: `rule-web-https`,
          properties: {
            Conditions: [
              {
                Field: "path-pattern",
                Values: ["/*"],
              },
            ],
            Priority: 11,
          },
        },
      },
    },
  },
});
