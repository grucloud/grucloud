// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "HostedZone",
    group: "Route53",
    properties: ({}) => ({
      Name: "grucloud.org.",
    }),
  },
  {
    type: "TrafficPolicy",
    group: "Route53",
    properties: ({}) => ({
      Document: {
        AWSPolicyFormatVersion: "2015-10-01",
        Endpoints: {
          "endpoint-start-OlMP": {
            Type: "value",
            Value: "192.168.0.3",
          },
        },
        RecordType: "A",
        StartEndpoint: "endpoint-start-OlMP",
      },
      Name: "my-policy",
      Type: "A",
    }),
  },
];
