// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  { type: "Vpc", group: "EC2", name: "vpc-default", isDefault: true },
  {
    type: "PrivateDnsNamespace",
    group: "ServiceDiscovery",
    properties: ({}) => ({
      Name: "appmeshworkshop.pvt.local",
      Properties: {
        DnsProperties: {
          SOA: {
            TTL: 15,
          },
        },
      },
    }),
    dependencies: ({}) => ({
      vpc: "vpc-default",
    }),
  },
  {
    type: "PublicDnsNamespace",
    group: "ServiceDiscovery",
    properties: ({}) => ({
      Name: "publicnamespace.grucloud.org",
      Properties: {
        DnsProperties: {
          SOA: {
            TTL: 60,
          },
        },
      },
    }),
  },
  {
    type: "Service",
    group: "ServiceDiscovery",
    properties: ({}) => ({
      DnsConfig: {
        DnsRecords: [
          {
            TTL: 300,
            Type: "A",
          },
        ],
        RoutingPolicy: "WEIGHTED",
      },
      Name: "crystal",
    }),
    dependencies: ({}) => ({
      namespacePrivateDns: "appmeshworkshop.pvt.local",
    }),
  },
];