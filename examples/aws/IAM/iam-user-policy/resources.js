// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Policy",
    group: "IAM",
    properties: ({}) => ({
      PolicyName: "policy-new",
      PolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Sid: "VisualEditor0",
            Effect: "Allow",
            Action: "s3:*",
            Resource: `*`,
          },
        ],
      },
      Path: "/",
      Description: "my fancy policy",
      Tags: [
        {
          Key: "mytag",
          Value: "myvalue",
        },
      ],
    }),
  },
];
