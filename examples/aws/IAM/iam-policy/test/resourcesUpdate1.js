exports.createResources = () => [
  {
    type: "Policy",
    group: "IAM",
    properties: ({}) => ({
      PolicyName: "policy-allow-ec2",
      PolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: ["s3:*"],
            Effect: "Allow",
            Resource: "*",
          },
          {
            Action: ["sqs:*"],
            Effect: "Allow",
            Resource: "*",
          },
        ],
      },
      Path: "/",
      Description: "Allow ec2:Describe",
      Tag: [{ Key: "mykey", Value: "myvalue" }],
    }),
  },
];
