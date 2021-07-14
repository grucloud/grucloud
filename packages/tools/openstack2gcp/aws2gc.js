#!/usr/bin/env node
const assert = require("assert");
const { pipe, tap, get, eq, map, switchCase, any, not, or } = require("rubico");
const { identity, pluck, includes } = require("rubico/x");
const { createProgramOptions, generatorMain } = require("./generatorUtils");

const { configTpl } = require("./src/configTpl");
const { iacTpl } = require("./src/aws/iacTpl");

const { findLiveById } = require("./generatorUtils");

const securityGroupRulePickProperties = () => [
  "IpProtocol",
  "FromPort",
  "ToPort",
  "CidrIpv4",
  "CidrIpv6",
  "ReferencedGroupInfo",
  "Description",
];
const writersSpec = [
  {
    group: "ec2",
    types: [
      {
        type: "Vpc",
        pickProperties: () => ["CidrBlock", "DnsSupport", "DnsHostnames"],
      },
      {
        type: "Subnet",
        pickProperties: () => [
          "CidrBlock",
          "Ipv6CidrBlock",
          "AvailabilityZone",
          "MapPublicIpOnLaunch",
          "CustomerOwnedIpv4Pool",
          "MapCustomerOwnedIpOnLaunch",
          "MapPublicIpOnLaunch",
        ],
        dependencies: () => ({ vpc: { type: "Vpc", group: "ec2" } }),
        ignoreResource: () => get("isDefault"),
      },
      {
        type: "KeyPair",
        createPrefix: "use",
      },
      {
        type: "Volume",
        pickProperties: () => ["Size", "VolumeType", "Device"],
        ignoreResource:
          ({ lives }) =>
          (resource) =>
            pipe([
              () => resource,
              or([
                get("managedByOther"),
                pipe([
                  get("live.Attachments"),
                  map(({ Device, InstanceId }) =>
                    pipe([
                      () => InstanceId,
                      findLiveById({ type: "Instance", lives }),
                      eq(get("live.RootDeviceName"), Device),
                    ])()
                  ),
                  any(identity),
                ]),
              ]),
            ])(),
      },
      {
        type: "ElasticIpAddress",
        pickProperties: () => [],
      },
      {
        type: "InternetGateway",
        pickProperties: () => [],
        dependencies: () => ({ vpc: { type: "Vpc", group: "ec2" } }),
        ignoreResource: () => get("isDefault"),
      },
      {
        type: "NatGateway",
        pickProperties: () => [],
        dependencies: () => ({
          subnet: { type: "Subnet", group: "ec2" },
          eip: { type: "ElasticIpAddress", group: "ec2" },
        }),
        ignoreResource: () => get("isDefault"),
      },
      {
        type: "RouteTable",
        pickProperties: () => [],
        ignoreResource: () => get("isDefault"),
        dependencies: () => ({
          vpc: { type: "Vpc", group: "ec2" },
          subnets: { type: "Subnet", group: "ec2" },
        }),
      },
      {
        type: "Route",
        pickProperties: () => ["DestinationCidrBlock"],
        ignoreResource: () => get("isDefault"),
        dependencies: () => ({
          routeTable: { type: "RouteTable", group: "ec2" },
          ig: { type: "InternetGateway", group: "ec2" },
          natGateway: { type: "NatGateway", group: "ec2" },
        }),
      },
      {
        type: "SecurityGroup",
        pickProperties: () => ["Description"],
        dependencies: () => ({ vpc: { type: "Vpc", group: "ec2" } }),
      },
      {
        type: "SecurityGroupRuleIngress",
        pickProperties: securityGroupRulePickProperties,
        dependencies: () => ({
          securityGroup: { type: "SecurityGroup", group: "ec2" },
        }),
      },
      {
        type: "SecurityGroupRuleEgress",
        pickProperties: securityGroupRulePickProperties,
        dependencies: () => ({
          securityGroup: { type: "SecurityGroup", group: "ec2" },
        }),
      },

      {
        type: "Instance",
        pickProperties: () => [
          "InstanceType",
          "ImageId",
          "Placement.AvailabilityZone",
        ],
        dependencies: () => ({
          subnet: { type: "Subnet", group: "ec2" },
          keyPair: { type: "KeyPair", group: "ec2" },
          eip: { type: "ElasticIpAddress", group: "ec2" },
          iamInstanceProfile: { type: "InstanceProfile", group: "iam" },
          securityGroups: { type: "SecurityGroup", group: "ec2" },
          volumes: {
            type: "Volume",
            group: "ec2",
            filterDependency:
              ({ resource }) =>
              (dependency) =>
                pipe([
                  tap(() => {
                    assert(resource);
                    assert(resource.live);
                    assert(dependency);
                    assert(dependency.live);
                  }),
                  () => dependency,
                  get("live.Attachments"),
                  pluck("Device"),
                  not(includes(resource.live.RootDeviceName)),
                ])(),
          },
        }),
      },
    ],
  },
  {
    group: "acm",
    types: [
      {
        type: "Certificate",
        pickProperties: () => ["DomainName", "SubjectAlternativeNames"],
      },
    ],
  },
  {
    group: "elb",
    types: [
      {
        type: "LoadBalancer",
        pickProperties: () => ["Scheme", "Type", "IpAddressType"],
        dependencies: () => ({
          subnets: { type: "Subnet", group: "ec2" },
          securityGroups: { type: "SecurityGroup", group: "ec2" },
          role: { type: "Role", group: "iam" },
          key: { type: "Key", group: "kms" },
        }),
      },
      {
        type: "TargetGroup",
        pickProperties: () => [
          "Protocol",
          "Port",
          "HealthCheckProtocol",
          "HealthCheckPort",
          "HealthCheckEnabled",
          "HealthCheckIntervalSeconds",
          "HealthCheckTimeoutSeconds",
          "HealthyThresholdCount",
          "HealthCheckPath",
          "Matcher",
          "TargetType",
          "ProtocolVersion",
        ],
        dependencies: () => ({
          vpc: { type: "Vpc", group: "ec2" },
          nodeGroup: { type: "NodeGroup", group: "eks" },
        }),
      },
      {
        type: "Listener",
        pickProperties: () => ["Port", "Protocol", "DefaultActions"],
        dependencies: () => ({
          loadBalancer: { type: "LoadBalancer", group: "elb" },
          targetGroups: { type: "TargetGroup", group: "elb" },
          certificate: { type: "Certificate", group: "acm" },
        }),
      },
      {
        type: "Rule",
        pickProperties: () => ["Priority", "Conditions", "Actions"],
        dependencies: () => ({
          listener: { type: "Listener", group: "elb" },
          targetGroup: { type: "TargetGroup", group: "elb" },
        }),
      },
    ],
  },
  {
    group: "kms",
    types: [
      {
        type: "Key",
        pickProperties: () => [],
      },
    ],
  },
  {
    group: "eks",
    types: [
      {
        type: "Cluster",
        pickProperties: () => ["version"],
        dependencies: () => ({
          subnets: { type: "Subnet", group: "ec2" },
          securityGroups: { type: "SecurityGroup", group: "ec2" },
          role: { type: "Role", group: "iam" },
          key: { type: "Key", group: "kms" },
        }),
      },
      {
        type: "NodeGroup",
        pickProperties: () => [
          "capacityType",
          "scalingConfig",
          "instanceTypes",
          "amiType",
          "labels",
          "diskSize",
        ],
        dependencies: () => ({
          cluster: { type: "Cluster", group: "eks" },
          subnets: { type: "Subnet", group: "ec2" },
          role: { type: "Role", group: "iam" },
        }),
      },
    ],
  },
  {
    group: "route53",
    types: [
      {
        type: "HostedZone",
        pickProperties: () => ["Name"],
      },
      {
        type: "Record",
        pickProperties: () => [
          "Name",
          "Type",
          "TTL",
          "ResourceRecords",
          "AliasTarget",
        ],
        dependencies: () => ({
          hostedZone: { type: "HostedZone", group: "route53" },
          loadBalancer: { type: "LoadBalancer", group: "elb" },
          certificate: { type: "Certificate", group: "acm" },
        }),
        ignoreResource: () => get("cannotBeDeleted"),
      },
    ],
  },

  {
    group: "iam",
    types: [
      {
        type: "Policy",
        pickProperties: switchCase([
          get("resource.cannotBeDeleted"),
          () => ["Arn"],
          () => ["PolicyName", "PolicyDocument", "Path", "Description"],
        ]),
      },
      {
        type: "Role",
        pickProperties: () => ["RoleName", "Path", "AssumeRolePolicyDocument"],
        dependencies: () => ({ policies: { type: "Policy", group: "iam" } }),
      },
      {
        type: "OpenIDConnectProvider",
        pickProperties: () => ["ClientIDList"],
        dependencies: () => ({
          cluster: { type: "Cluster", group: "eks" },
          role: { type: "Role", group: "iam" },
        }),
      },
    ],
  },
];

//TODO read version from package.json
const options = createProgramOptions({ version: "1.0" });

generatorMain({ name: "aws2gc", options, writersSpec, iacTpl, configTpl })
  .then(() => {})
  .catch((error) => {
    console.error("error");
    console.error(error);
    throw error;
  });
