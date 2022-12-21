// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "LogGroup",
    group: "CloudWatchLogs",
    properties: ({}) => ({
      logGroupName: "log-group-data-protection",
      retentionInDays: 1,
      dataProtectionPolicy: {
        Name: "data-protection-policy",
        Description: "",
        Version: "2021-06-01",
        Statement: [
          {
            Sid: "audit-policy",
            DataIdentifier: [
              "arn:aws:dataprotection::aws:data-identifier/Address",
            ],
            Operation: {
              Audit: {
                FindingsDestination: {},
              },
            },
          },
          {
            Sid: "redact-policy",
            DataIdentifier: [
              "arn:aws:dataprotection::aws:data-identifier/Address",
            ],
            Operation: {
              Deidentify: {
                MaskConfig: {},
              },
            },
          },
        ],
      },
    }),
  },
];
