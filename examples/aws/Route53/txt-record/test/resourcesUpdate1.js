exports.createResources = () => [
  {
    type: "HostedZone",
    group: "Route53",
    name: "grucloud.org.",
    properties: ({}) => ({
      Name: "grucloud.org.",
      Tags: [{ Key: "mykey1", Value: "value" }],
    }),
    dependencies: () => ({
      domain: "grucloud.org",
    }),
  },
  {
    type: "Record",
    group: "Route53",
    properties: ({}) => ({
      Name: "gcrun.grucloud.org.",
      Type: "TXT",
      TTL: 300,
      ResourceRecords: [
        {
          Value:
            '"DEADBEEFgoogle-site-verification=DPVEQ54F8sKTj__itc4iAXA4my_hB-bzUlMYFqx6gCI"',
        },
      ],
    }),
    dependencies: () => ({
      hostedZone: "grucloud.org.",
    }),
  },
];
