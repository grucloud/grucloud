exports.createResources = () => [
  {
    type: "Certificate",
    group: "ACM",
    properties: ({}) => ({
      DomainName: "grucloud.org",
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
