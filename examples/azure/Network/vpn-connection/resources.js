// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "LocalNetworkGateway",
    group: "Network",
    properties: ({ config }) => ({
      name: "lng-aws0",
      location: config.location,
      properties: {
        localNetworkAddressSpace: {
          addressPrefixes: ["192.168.0.0/16"],
        },
        gatewayIpAddress: "50.1.2.3",
        fqdn: "",
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "rg-vpn",
    }),
  },
  {
    type: "PublicIPAddress",
    group: "Network",
    properties: ({}) => ({
      name: "vpngw-a-pip",
      sku: {
        name: "Standard",
      },
      zones: ["1"],
      properties: {
        publicIPAllocationMethod: "Static",
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "rg-vpn",
    }),
  },
  {
    type: "Route",
    group: "Network",
    properties: ({}) => ({
      name: "rt-aws",
      properties: {
        addressPrefix: "192.168.0.0/16",
        nextHopType: "VirtualNetworkGateway",
        nextHopIpAddress: "",
        hasBgpOverride: false,
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "rg-vpn",
      routeTable: "rg-vpn::rt-vpn-aws",
    }),
  },
  {
    type: "RouteTable",
    group: "Network",
    properties: ({ config }) => ({
      name: "rt-vpn-aws",
      location: config.location,
      properties: {
        disableBgpRoutePropagation: false,
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "rg-vpn",
    }),
  },
  {
    type: "Subnet",
    group: "Network",
    properties: ({}) => ({
      name: "GatewaySubnet",
      properties: {
        addressPrefix: "10.0.0.0/24",
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "rg-vpn",
      virtualNetwork: "rg-vpn::vnet",
    }),
  },
  {
    type: "Subnet",
    group: "Network",
    properties: ({}) => ({
      name: "subnet",
      properties: {
        addressPrefix: "10.0.1.0/24",
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "rg-vpn",
      routeTable: "rg-vpn::rt-vpn-aws",
      virtualNetwork: "rg-vpn::vnet",
    }),
  },
  {
    type: "VirtualNetwork",
    group: "Network",
    properties: ({}) => ({
      name: "vnet",
      properties: {
        addressSpace: {
          addressPrefixes: ["10.0.0.0/16"],
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "rg-vpn",
    }),
  },
  {
    type: "VirtualNetworkGateway",
    group: "Network",
    properties: ({ config, getId }) => ({
      name: "vpn-gw",
      location: config.location,
      properties: {
        ipConfigurations: [
          {
            properties: {
              privateIPAllocationMethod: "Dynamic",
              subnet: {
                id: `${getId({
                  type: "Subnet",
                  group: "Network",
                  name: "rg-vpn::vnet::GatewaySubnet",
                })}`,
              },
              publicIPAddress: {
                id: `${getId({
                  type: "PublicIPAddress",
                  group: "Network",
                  name: "rg-vpn::vpngw-a-pip",
                })}`,
              },
            },
            name: "default",
          },
        ],
        gatewayType: "Vpn",
        vpnType: "RouteBased",
        vpnGatewayGeneration: "Generation2",
        enableBgp: false,
        enablePrivateIpAddress: false,
        activeActive: false,
        disableIPSecReplayProtection: false,
        sku: {
          name: "VpnGw2AZ",
          tier: "VpnGw2AZ",
        },
        vpnClientConfiguration: {
          vpnClientProtocols: ["OpenVPN", "IkeV2"],
          vpnAuthenticationTypes: [],
        },
        bgpSettings: {
          asn: 65515,
          bgpPeeringAddress: "10.0.0.254",
          peerWeight: 0,
        },
        enableBgpRouteTranslationForNat: false,
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "rg-vpn",
      subnets: ["rg-vpn::vnet::GatewaySubnet"],
      publicIpAddresses: ["rg-vpn::vpngw-a-pip"],
    }),
  },
  {
    type: "VirtualNetworkGatewayConnection",
    group: "Network",
    properties: ({ config }) => ({
      name: "conn-aws0",
      location: config.location,
      properties: {
        connectionType: "IPsec",
        connectionProtocol: "IKEv2",
        routingWeight: 0,
        dpdTimeoutSeconds: 0,
        connectionMode: "Default",
        enableBgp: false,
        useLocalAzureIpAddress: false,
        usePolicyBasedTrafficSelectors: false,
        expressRouteGatewayBypass: false,
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "rg-vpn",
      localNetworkGateway: "rg-vpn::lng-aws0",
      virtualNetworkGateway: "rg-vpn::vpn-gw",
    }),
  },
  {
    type: "VirtualNetworkGatewayConnectionSharedKey",
    group: "Network",
    properties: ({}) => ({
      value: "Microsoft123",
    }),
    dependencies: ({}) => ({
      resourceGroup: "rg-vpn",
      virtualNetworkGatewayConnection: "rg-vpn::conn-aws0",
    }),
  },
  {
    type: "ResourceGroup",
    group: "Resources",
    properties: ({}) => ({
      name: "rg-vpn",
    }),
  },
];
