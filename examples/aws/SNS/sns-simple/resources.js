// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Topic",
    group: "SNS",
    name: "my-topic",
    properties: ({ config }) => ({
      Attributes: {
        Policy: {
          Version: "2008-10-17",
          Id: "__default_policy_ID",
          Statement: [
            {
              Sid: "__default_statement_ID",
              Effect: "Allow",
              Principal: {
                AWS: "*",
              },
              Action: [
                "SNS:GetTopicAttributes",
                "SNS:SetTopicAttributes",
                "SNS:AddPermission",
                "SNS:RemovePermission",
                "SNS:DeleteTopic",
                "SNS:Subscribe",
                "SNS:ListSubscriptionsByTopic",
                "SNS:Publish",
              ],
              Resource: `arn:aws:sns:${
                config.region
              }:${config.accountId()}:my-topic`,
              Condition: {
                StringEquals: {
                  "AWS:SourceOwner": `${config.accountId()}`,
                },
              },
            },
          ],
        },
        DisplayName: "My Topic",
        DeliveryPolicy: {
          http: {
            defaultHealthyRetryPolicy: {
              minDelayTarget: 20,
              maxDelayTarget: 20,
              numRetries: 3,
              numMaxDelayRetries: 0,
              numNoDelayRetries: 0,
              numMinDelayRetries: 0,
              backoffFunction: "linear",
            },
            disableSubscriptionOverrides: false,
          },
        },
      },
      Tags: [
        {
          Key: "mykey",
          Value: "myvalue",
        },
      ],
    }),
  },
];
