exports.createResources = () => [
  {
    type: "Certificate",
    group: "ACM",
    name: "grucloud.org",
    properties: ({}) => ({
      Tags: [
        {
          Key: "mykeynew",
          Value: "myvaluenew",
        },
        {
          Key: "mykey2",
          Value: "myvalue2",
        },
      ],
    }),
  },
];
