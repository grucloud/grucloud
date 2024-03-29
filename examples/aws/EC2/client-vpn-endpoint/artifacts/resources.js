// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Certificate",
    group: "ACM",
    properties: ({}) => ({
      DomainName: "client1.domain.tld",
    }),
  },
  {
    type: "Certificate",
    group: "ACM",
    properties: ({}) => ({
      DomainName: "server",
    }),
  },
  {
    type: "LogGroup",
    group: "CloudWatchLogs",
    properties: ({}) => ({
      logGroupName: "/client-vpn",
    }),
  },
  {
    type: "ClientVpnAuthorizationRule",
    group: "EC2",
    properties: ({}) => ({
      AuthorizeAllGroups: true,
      TargetNetworkCidr: "10.0.0.0/16",
    }),
    dependencies: ({}) => ({
      clientVpnEndpoint: "client-vpn",
    }),
  },
  {
    type: "ClientVpnEndpoint",
    group: "EC2",
    name: "client-vpn",
    properties: ({ getId }) => ({
      AuthenticationOptions: [
        {
          MutualAuthentication: {
            ClientRootCertificateChainArn: `${getId({
              type: "Certificate",
              group: "ACM",
              name: "client1.domain.tld",
            })}`,
          },
          Type: "certificate-authentication",
        },
      ],
      ClientCidrBlock: "10.20.0.0/22",
      ConnectionLogOptions: {
        Enabled: true,
      },
    }),
    dependencies: ({}) => ({
      vpc: "vpc",
      cloudWatchLogGroup: "/client-vpn",
      serverCertificate: "server",
      clientCertificate: "client1.domain.tld",
    }),
  },
  {
    type: "ClientVpnTargetNetwork",
    group: "EC2",
    dependencies: ({ config }) => ({
      clientVpnEndpoint: "client-vpn",
      subnet: `vpc::subnet-private1-${config.region}a`,
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: ({ config }) => `rtb-private1-${config.region}a`,
    dependencies: ({}) => ({
      vpc: "vpc",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: ({ config }) => `rtb-private2-${config.region}b`,
    dependencies: ({}) => ({
      vpc: "vpc",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({ config }) => ({
      routeTable: `vpc::rtb-private1-${config.region}a`,
      subnet: `vpc::subnet-private1-${config.region}a`,
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({ config }) => ({
      routeTable: `vpc::rtb-private2-${config.region}b`,
      subnet: `vpc::subnet-private2-${config.region}b`,
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: ({ config }) => `subnet-private1-${config.region}a`,
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}a`,
      NewBits: 4,
      NetworkNumber: 8,
    }),
    dependencies: ({}) => ({
      vpc: "vpc",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: ({ config }) => `subnet-private2-${config.region}b`,
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}b`,
      NewBits: 4,
      NetworkNumber: 9,
    }),
    dependencies: ({}) => ({
      vpc: "vpc",
    }),
  },
  {
    type: "Vpc",
    group: "EC2",
    name: "vpc",
    properties: ({}) => ({
      CidrBlock: "10.0.0.0/16",
      DnsHostnames: true,
    }),
  },
];
