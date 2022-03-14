exports.createResources = () => [
  {
    type: "Certificate",
    group: "ACM",
    name: "grucloud.org",
    properties: ({}) => ({
      SubjectAlternativeNames: ["grucloud.org", "*.grucloud.org"],
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
