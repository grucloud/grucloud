exports.createResources = () => [
  {
    type: "Vpc",
    group: "EC2",
    name: "my-vpc",
    properties: ({}) => ({
      CidrBlock: "10.0.0.0/16",
      DnsHostnames: true,
      DnsSupport: false,
      Tags: [
        {
          Key: "mytagnew",
          Value: "myvalue2",
        },
      ],
    }),
  },
];
