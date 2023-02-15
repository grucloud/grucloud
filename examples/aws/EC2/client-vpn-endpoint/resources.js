// Generated by 'gc gencode'
const path = require("path");

const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Certificate",
    group: "ACM",
    properties: () => ({
      privateKeyFile: path.resolve(__dirname, "pki/client1.domain.tld.key"),
      certificateFile: path.resolve(__dirname, "pki/client1.domain.tld.crt"),
      certificateChainFile: path.resolve(__dirname, "pki/ca.crt"),
    }),
  },
  {
    type: "Certificate",
    group: "ACM",
    properties: () => ({
      privateKeyFile: path.resolve(__dirname, "pki/server.key"),
      certificateFile: path.resolve(__dirname, "pki/server.crt"),
      certificateChainFile: path.resolve(__dirname, "pki/ca.crt"),
    }),
  },
  {
    type: "LogGroup",
    group: "CloudWatchLogs",
    properties: () => ({
      logGroupName: "/client-vpn",
    }),
  },
  {
    type: "ClientVpnAuthorizationRule",
    group: "EC2",
    properties: ({}) => ({
      TargetNetworkCidr: "10.0.0.0/16",
      AuthorizeAllGroups: true,
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
      ClientCidrBlock: "10.20.0.0/22",
      AuthenticationOptions: [
        {
          Type: "certificate-authentication",
          MutualAuthentication: {
            ClientRootCertificateChainArn: `${getId({
              type: "Certificate",
              group: "ACM",
              name: "client1.domain.tld",
            })}`,
          },
        },
      ],
      ConnectionLogOptions: {
        Enabled: true,
      },
    }),
    dependencies: ({ config }) => ({
      vpc: "vpc",
      cloudWatchLogGroup: "/client-vpn",
      //cloudWatchLogStream: `/client-vpn::cvpn-endpoint`,
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
    type: "Vpc",
    group: "EC2",
    name: "vpc",
    properties: ({}) => ({
      CidrBlock: "10.0.0.0/16",
      DnsHostnames: true,
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: ({ config }) => `vpc::subnet-private1-${config.region}a`,
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
    name: ({ config }) => `vpc::subnet-private2-${config.region}b`,
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
    type: "RouteTable",
    group: "EC2",
    name: ({ config }) => `vpc::rtb-private1-${config.region}a`,
    dependencies: ({}) => ({
      vpc: "vpc",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: ({ config }) => `vpc::rtb-private2-${config.region}b`,
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
];