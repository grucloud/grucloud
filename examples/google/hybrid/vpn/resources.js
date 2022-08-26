// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Address",
    group: "compute",
    name: "ip-vpn",
    properties: ({}) => ({
      name: "ip-vpn",
      description: "",
      address: "34.148.99.6",
      networkTier: "PREMIUM",
      addressType: "EXTERNAL",
    }),
  },
  {
    type: "ForwardingRule",
    group: "compute",
    name: "vpn-1-rule-esp",
    properties: ({}) => ({
      name: "vpn-1-rule-esp",
      description: "",
      IPAddress: "34.148.99.6",
      IPProtocol: "ESP",
      target:
        "https://www.googleapis.com/compute/v1/projects/grucloud-test/regions/us-east1/targetVpnGateways/vpn-1",
      loadBalancingScheme: "EXTERNAL",
      networkTier: "PREMIUM",
    }),
  },
  {
    type: "ForwardingRule",
    group: "compute",
    name: "vpn-1-rule-udp4500",
    properties: ({}) => ({
      name: "vpn-1-rule-udp4500",
      description: "",
      IPAddress: "34.148.99.6",
      IPProtocol: "UDP",
      portRange: "4500-4500",
      target:
        "https://www.googleapis.com/compute/v1/projects/grucloud-test/regions/us-east1/targetVpnGateways/vpn-1",
      loadBalancingScheme: "EXTERNAL",
      networkTier: "PREMIUM",
    }),
  },
  {
    type: "ForwardingRule",
    group: "compute",
    name: "vpn-1-rule-udp500",
    properties: ({}) => ({
      name: "vpn-1-rule-udp500",
      description: "",
      IPAddress: "34.148.99.6",
      IPProtocol: "UDP",
      portRange: "500-500",
      target:
        "https://www.googleapis.com/compute/v1/projects/grucloud-test/regions/us-east1/targetVpnGateways/vpn-1",
      loadBalancingScheme: "EXTERNAL",
      networkTier: "PREMIUM",
    }),
  },
  {
    type: "Network",
    group: "compute",
    name: "network",
    properties: ({}) => ({
      autoCreateSubnetworks: false,
      routingConfig: {
        routingMode: "REGIONAL",
      },
    }),
  },
  {
    type: "Route",
    group: "compute",
    name: "vpn-1-tunnel-1-route-1",
    properties: ({}) => ({
      name: "vpn-1-tunnel-1-route-1",
      description: "",
      network:
        "https://www.googleapis.com/compute/v1/projects/grucloud-test/global/networks/network",
      destRange: "10.0.0.0/16",
      priority: 1000,
      nextHopVpnTunnel:
        "https://www.googleapis.com/compute/v1/projects/grucloud-test/regions/us-east1/vpnTunnels/vpn-1-tunnel-1",
    }),
  },
  {
    type: "Subnetwork",
    group: "compute",
    name: "subnet-1",
    properties: ({}) => ({
      ipCidrRange: "10.0.0.0/24",
    }),
    dependencies: ({}) => ({
      network: "network",
    }),
  },
  {
    type: "TargetVpnGateway",
    group: "compute",
    name: "vpn-1",
    properties: ({}) => ({
      name: "vpn-1",
      description: "",
      network:
        "https://www.googleapis.com/compute/v1/projects/grucloud-test/global/networks/network",
    }),
  },
  {
    type: "VpnTunnel",
    group: "compute",
    name: "vpn-1-tunnel-1",
    properties: ({}) => ({
      name: "vpn-1-tunnel-1",
      description: "",
      targetVpnGateway:
        "https://www.googleapis.com/compute/v1/projects/grucloud-test/regions/us-east1/targetVpnGateways/vpn-1",
      peerIp: "50.1.2.3",
      sharedSecret: "*************",
      sharedSecretHash: "ANDk9hJBjtmLIUWcwjnRcQgPYY_R",
      ikeVersion: 2,
      localTrafficSelector: ["0.0.0.0/0"],
      remoteTrafficSelector: ["0.0.0.0/0"],
    }),
  },
];
