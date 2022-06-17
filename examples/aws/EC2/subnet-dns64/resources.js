const createResources = ({ provider }) => [
  {
    type: "Subnet",
    group: "EC2",
    name: ({ config }) => `dns_vpc::dns_attachment_${config.region}b`,
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}b`,
      AssignIpv6AddressOnCreation: true,
      Tags: [
        {
          Key: "Network",
          Value: "private",
        },
        {
          Key: "Type",
          Value: "attachment",
        },
      ],
      EnableDns64: true,
      NewBits: 5,
      NetworkNumber: 1,
      Ipv6SubnetPrefix: "01",
    }),
    dependencies: ({}) => ({
      vpc: "dns_vpc",
    }),
  },
  {
    type: "Vpc",
    group: "EC2",
    name: "dns_vpc",
    properties: ({}) => ({
      CidrBlock: "10.0.0.0/16",
      DnsHostnames: true,
      AmazonProvidedIpv6CidrBlock: true,
    }),
    dependencies: ({}) => ({}),
  },
];

exports.createResources = createResources;
