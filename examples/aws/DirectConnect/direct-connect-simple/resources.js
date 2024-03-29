// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Connection",
    group: "DirectConnect",
    properties: ({}) => ({
      bandwidth: "10Gbps",
      connectionName: "165HS-Connection-1",
      location: "165HS",
      providerName: "Equinix, Inc.",
      tags: [
        {
          key: "mytag",
          value: "myvalue",
        },
      ],
    }),
  },
  {
    type: "Connection",
    group: "DirectConnect",
    properties: ({}) => ({
      bandwidth: "10Gbps",
      connectionName: "165HS-Connection-2",
      location: "165HS",
      providerName: "Equinix, Inc.",
      tags: [
        {
          key: "mytag",
          value: "myvalue",
        },
      ],
    }),
  },
  {
    type: "ConnectionAssociation",
    group: "DirectConnect",
    dependencies: ({}) => ({
      connection: "165HS-Connection-1",
      lag: "lag",
    }),
  },
  {
    type: "Gateway",
    group: "DirectConnect",
    properties: ({}) => ({
      amazonSideAsn: 64512,
      directConnectGatewayName: "my-gateway",
    }),
  },
  {
    type: "Lag",
    group: "DirectConnect",
    properties: ({}) => ({
      connectionsBandwidth: "10Gbps",
      lagName: "lag",
      location: "165HS",
      numberOfConnections: 1,
    }),
    dependencies: ({}) => ({
      connections: ["165HS-Connection-1"],
    }),
  },
  {
    type: "VirtualInterface",
    group: "DirectConnect",
    properties: ({}) => ({
      addressFamily: "ipv4",
      amazonAddress: "169.254.96.1/29",
      asn: 65001,
      authKey: process.env.VIF_PRIVATE_AUTH_KEY,
      customerAddress: "169.254.96.6/29",
      enableSiteLink: false,
      mtu: 1500,
      virtualInterfaceName: "vif-private",
      virtualInterfaceType: "private",
      vlan: 100,
    }),
    dependencies: ({}) => ({
      lag: "lag",
      gateway: "my-gateway",
    }),
  },
];
