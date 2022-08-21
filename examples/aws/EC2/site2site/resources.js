// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "CustomerGateway",
    group: "EC2",
    name: "cgw",
    properties: ({}) => ({
      BgpAsn: "65000",
      IpAddress: "1.1.1.1",
    }),
  },
  {
    type: "Vpc",
    group: "EC2",
    name: "vpc-vpn",
    properties: ({}) => ({
      CidrBlock: "172.16.0.0/16",
    }),
  },
  { type: "InternetGateway", group: "EC2", name: "my-ig" },
  {
    type: "InternetGatewayAttachment",
    group: "EC2",
    dependencies: ({}) => ({
      vpc: "vpc-vpn",
      internetGateway: "my-ig",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "vpc-vpn::subnet-1",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}a`,
      NewBits: 8,
      NetworkNumber: 0,
    }),
    dependencies: ({}) => ({
      vpc: "vpc-vpn",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: "vpc-vpn::my-rt",
    dependencies: ({}) => ({
      vpc: "vpc-vpn",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({}) => ({
      routeTable: "vpc-vpn::my-rt",
      subnet: "vpc-vpn::subnet-1",
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "192.168.0.0/16",
    }),
    dependencies: ({}) => ({
      routeTable: "vpc-vpn::my-rt",
      vpnGateway: "vpw",
    }),
  },
  {
    type: "VpnGateway",
    group: "EC2",
    name: "vpw",
    properties: ({}) => ({
      AmazonSideAsn: 64512,
    }),
  },
  {
    type: "VpnGatewayAttachment",
    group: "EC2",
    dependencies: ({}) => ({
      vpc: "vpc-vpn",
      vpnGateway: "vpw",
    }),
  },
  {
    type: "VpnGatewayRoutePropagation",
    group: "EC2",
    dependencies: ({}) => ({
      routeTable: "vpc-vpn::my-rt",
      vpnGateway: "vpw",
    }),
  },
  {
    type: "VpnConnection",
    group: "EC2",
    name: "vpn-connection",
    properties: ({}) => ({
      Category: "VPN",
    }),
    dependencies: ({}) => ({
      customerGateway: "cgw",
      vpnGateway: "vpw",
    }),
  },
];
