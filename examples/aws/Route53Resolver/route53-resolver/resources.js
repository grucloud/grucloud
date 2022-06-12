// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Vpc",
    group: "EC2",
    name: "vpc-resolver-endpoint",
    properties: ({}) => ({
      CidrBlock: "10.0.0.0/16",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "vpc-resolver-endpoint::subnet-1",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}a`,
      CidrBlock: "10.0.0.0/24",
    }),
    dependencies: ({}) => ({
      vpc: "vpc-resolver-endpoint",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "vpc-resolver-endpoint::subnet-2",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}b`,
      CidrBlock: "10.0.1.0/24",
    }),
    dependencies: ({}) => ({
      vpc: "vpc-resolver-endpoint",
    }),
  },
  {
    type: "SecurityGroup",
    group: "EC2",
    properties: ({}) => ({
      GroupName: "dns",
      Description: "dns",
    }),
    dependencies: ({}) => ({
      vpc: "vpc-resolver-endpoint",
    }),
  },
  {
    type: "SecurityGroupRuleIngress",
    group: "EC2",
    properties: ({}) => ({
      IpPermission: {
        FromPort: 53,
        IpProtocol: "tcp",
        IpRanges: [
          {
            CidrIp: "0.0.0.0/0",
          },
        ],
        ToPort: 53,
      },
    }),
    dependencies: ({}) => ({
      securityGroup: "sg::vpc-resolver-endpoint::dns",
    }),
  },
  {
    type: "Endpoint",
    group: "Route53Resolver",
    name: "endpoint",
    properties: ({ getId }) => ({
      Direction: "OUTBOUND",
      Name: "endpoint",
      IpAddresses: [
        {
          SubnetId: `${getId({
            type: "Subnet",
            group: "EC2",
            name: "vpc-resolver-endpoint::subnet-1",
          })}`,
        },
        {
          SubnetId: `${getId({
            type: "Subnet",
            group: "EC2",
            name: "vpc-resolver-endpoint::subnet-2",
          })}`,
        },
      ],
    }),
    dependencies: ({}) => ({
      securityGroups: ["sg::vpc-resolver-endpoint::dns"],
      subnets: [
        "vpc-resolver-endpoint::subnet-1",
        "vpc-resolver-endpoint::subnet-2",
      ],
    }),
  },
  {
    type: "Rule",
    group: "Route53Resolver",
    name: "my-rule",
    properties: ({}) => ({
      DomainName: "internal.grucloud.org.",
      Name: "my-rule",
      RuleType: "FORWARD",
    }),
    dependencies: ({}) => ({
      resolverEndpoint: "endpoint",
    }),
  },
  {
    type: "RuleAssociation",
    group: "Route53Resolver",
    properties: ({}) => ({
      Name: "-",
    }),
    dependencies: ({}) => ({
      resolverRule: "my-rule",
      vpc: "vpc-resolver-endpoint",
    }),
  },
];
