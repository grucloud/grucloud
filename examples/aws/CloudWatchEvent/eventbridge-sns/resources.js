// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Rule",
    group: "CloudWatchEvents",
    properties: ({ config }) => ({
      Description: "EventRule",
      EventPattern: {
        account: [`${config.accountId()}`],
        source: ["demo.cli"],
      },
      Name: "sam-app-EventRule-1GU7K8YOHRH1N",
    }),
  },
  {
    type: "Target",
    group: "CloudWatchEvents",
    properties: ({}) => ({
      Id: "SNStopic",
    }),
    dependencies: ({}) => ({
      rule: "sam-app-EventRule-1GU7K8YOHRH1N",
      snsTopic: "sam-app-MySnsTopic-4zKsbzEFMsaq",
    }),
  },
  {
    type: "Topic",
    group: "SNS",
    name: "sam-app-MySnsTopic-4zKsbzEFMsaq",
    properties: ({ config }) => ({
      Attributes: {
        Policy: {
          Statement: [
            {
              Action: "sns:Publish",
              Effect: "Allow",
              Principal: {
                Service: "events.amazonaws.com",
              },
              Resource: `arn:aws:sns:${
                config.region
              }:${config.accountId()}:sam-app-MySnsTopic-4zKsbzEFMsaq`,
            },
          ],
          Version: "2008-10-17",
        },
      },
    }),
  },
];
