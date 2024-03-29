// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Topic",
    group: "SNS",
    name: "my-topic",
    properties: ({}) => ({
      Attributes: {
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
