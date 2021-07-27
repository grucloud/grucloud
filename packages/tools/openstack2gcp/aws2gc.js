#!/usr/bin/env node
const assert = require("assert");
const {
  pipe,
  tap,
  get,
  eq,
  pick,
  switchCase,
  omit,
  not,
  or,
  and,
  assign,
  map,
} = require("rubico");
const { identity, pluck, includes } = require("rubico/x");
const { createProgramOptions, generatorMain } = require("./generatorUtils");

const { configTpl } = require("./src/configTpl");
const { iacTpl } = require("./src/aws/iacTpl");

const { findLiveById, hasDependency } = require("./generatorUtils");

const securityGroupRulePickProperties = pipe([
  tap((params) => {
    assert(true);
  }),
  ({ resource }) =>
    (live) =>
      pipe([
        () => live,
        switchCase([
          () => hasDependency({ type: "SecurityGroup" })(resource),
          omit(["IpPermission.UserIdGroupPairs"]),
          identity,
        ]),
        tap((params) => {
          assert(true);
        }),
        pick(["IpPermission"]),
      ])(),
]);

const writersSpec = [
  {
    group: "iam",
    types: [
      {
        type: "Policy",
        filterLive: switchCase([
          get("resource.cannotBeDeleted"),
          () => pick(["Arn"]),
          () => pick(["PolicyName", "PolicyDocument", "Path", "Description"]),
        ]),
      },
      {
        type: "Role",
        filterLive: () =>
          pick(["RoleName", "Path", "AssumeRolePolicyDocument"]),
        dependencies: () => ({
          policies: { type: "Policy", group: "iam" },
          openIdConnectProvider: {
            type: "OpenIDConnectProvider",
            group: "iam",
          },
        }),
        hasNoProperty: ({ lives, resource }) =>
          pipe([
            () => resource,
            or([hasDependency({ type: "OpenIDConnectProvider" })]),
          ])(),
      },
      {
        type: "InstanceProfile",
        filterLive: () => pick([]),
        dependencies: () => ({ roles: { type: "Role", group: "iam" } }),
      },
      {
        type: "OpenIDConnectProvider",
        filterLive: () => pick(["ClientIDList"]),
        dependencies: () => ({
          cluster: { type: "Cluster", group: "eks" },
          role: { type: "Role", group: "iam" },
        }),
        hasNoProperty: ({ lives, resource }) =>
          pipe([() => resource, or([hasDependency({ type: "Cluster" })])])(),
      },
    ],
  },
  {
    group: "ec2",
    types: [
      {
        type: "Vpc",
        filterLive: () => pick(["CidrBlock", "DnsSupport", "DnsHostnames"]),
      },
      {
        type: "Subnet",
        filterLive: () =>
          pick([
            "CidrBlock",
            "Ipv6CidrBlock",
            "AvailabilityZone",
            "MapPublicIpOnLaunch",
            "CustomerOwnedIpv4Pool",
            "MapCustomerOwnedIpOnLaunch",
            "MapPublicIpOnLaunch",
          ]),
        dependencies: () => ({ vpc: { type: "Vpc", group: "ec2" } }),
        ignoreResource: () => get("isDefault"),
      },
      {
        type: "KeyPair",
      },
      {
        type: "Volume",
        filterLive: () => pick(["Size", "VolumeType", "Device"]),
        // ignoreResource:
        //   ({ lives }) =>
        //   (resource) =>
        //     pipe([
        //       () => resource,
        //       or([
        //         get("managedByOther"),
        //         pipe([
        //           get("live.Attachments"),
        //           map(({ Device, InstanceId }) =>
        //             pipe([
        //               () => InstanceId,
        //               findLiveById({ type: "Instance", lives }),
        //               eq(get("live.RootDeviceName"), Device),
        //             ])()
        //           ),
        //           any(identity),
        //         ]),
        //       ]),
        //     ])(),
      },
      {
        type: "ElasticIpAddress",
        filterLive: () => pick([]),
      },
      {
        type: "InternetGateway",
        filterLive: () => pick([]),
        dependencies: () => ({ vpc: { type: "Vpc", group: "ec2" } }),
        ignoreResource: () => get("isDefault"),
      },
      {
        type: "NatGateway",
        filterLive: () => pick([]),
        dependencies: () => ({
          subnet: { type: "Subnet", group: "ec2" },
          eip: { type: "ElasticIpAddress", group: "ec2" },
        }),
        ignoreResource: () => get("isDefault"),
      },
      {
        type: "RouteTable",
        filterLive: () => pick([]),
        ignoreResource: () => get("isDefault"),
        dependencies: () => ({
          vpc: { type: "Vpc", group: "ec2" },
          subnets: { type: "Subnet", group: "ec2" },
        }),
      },
      {
        type: "Route",
        filterLive: () => pick(["DestinationCidrBlock"]),
        ignoreResource: () => get("isDefault"),
        dependencies: () => ({
          routeTable: { type: "RouteTable", group: "ec2" },
          ig: { type: "InternetGateway", group: "ec2" },
          natGateway: { type: "NatGateway", group: "ec2" },
        }),
      },
      {
        type: "SecurityGroup",
        filterLive: () => pick(["Description"]),
        dependencies: () => ({ vpc: { type: "Vpc", group: "ec2" } }),
      },
      {
        type: "SecurityGroupRuleIngress",
        filterLive: securityGroupRulePickProperties,
        dependencies: () => ({
          securityGroup: {
            type: "SecurityGroup",
            group: "ec2",
            filterDependency:
              ({ resource }) =>
              (dependency) =>
                pipe([
                  () => resource,
                  eq(get("live.GroupId"), dependency.live.GroupId),
                ])(),
          },
          securityGroupFrom: {
            type: "SecurityGroup",
            group: "ec2",
            filterDependency:
              ({ resource }) =>
              (dependency) =>
                pipe([
                  () => resource,
                  tap(() => {
                    assert(dependency.live.GroupId);
                  }),
                  get("live.IpPermission.UserIdGroupPairs[0].GroupId", ""),
                  and([
                    eq(identity, dependency.live.GroupId),
                    not(eq(resource.live.GroupId, dependency.live.GroupId)),
                  ]),
                ])(),
          },
        }),
      },
      {
        type: "SecurityGroupRuleEgress",
        filterLive: securityGroupRulePickProperties,
        dependencies: () => ({
          securityGroup: { type: "SecurityGroup", group: "ec2" },
        }),
      },

      {
        type: "Instance",
        filterLive: () =>
          pick(["InstanceType", "ImageId", "Placement.AvailabilityZone"]),
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
        filterLive: () => pick(["DomainName", "SubjectAlternativeNames"]),
      },
    ],
  },
  {
    group: "autoscaling",
    types: [
      {
        type: "AutoScalingGroup",
        //TODO
        filterLive: () => pick([]),
      },
    ],
  },
  {
    group: "elb",
    types: [
      {
        type: "LoadBalancer",
        filterLive: () => pick(["Scheme", "Type", "IpAddressType"]),
        dependencies: () => ({
          subnets: { type: "Subnet", group: "ec2" },
          securityGroups: { type: "SecurityGroup", group: "ec2" },
          role: { type: "Role", group: "iam" },
          key: { type: "Key", group: "kms" },
        }),
      },
      {
        type: "TargetGroup",
        filterLive: () =>
          pick([
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
          ]),

        dependencies: () => ({
          vpc: { type: "Vpc", group: "ec2" },
          nodeGroup: {
            type: "NodeGroup",
            group: "eks",
          },
          //TODO autoScalingGroup
        }),
      },
      {
        type: "Listener",
        filterLive: pipe([
          tap((params) => {
            assert(true);
          }),
          ({ resource }) =>
            (live) =>
              pipe([
                () => live,
                switchCase([
                  () => hasDependency({ type: "TargetGroup" })(resource),
                  omit(["DefaultActions"]),
                  identity,
                ]),
                tap((params) => {
                  assert(true);
                }),
                pick(["Port", "Protocol", "DefaultActions"]),
              ])(),
        ]),
        dependencies: () => ({
          loadBalancer: { type: "LoadBalancer", group: "elb" },
          targetGroup: { type: "TargetGroup", group: "elb" },
          certificate: { type: "Certificate", group: "acm" },
        }),
      },
      {
        type: "Rule",
        filterLive: pipe([
          ({ resource }) =>
            (live) =>
              pipe([
                () => live,
                switchCase([
                  () => hasDependency({ type: "TargetGroup" })(resource),
                  omit(["Actions"]),
                  identity,
                ]),
                pick(["Priority", "Conditions", "Actions"]),
                assign({
                  Conditions: pipe([
                    get("Conditions"),
                    map(omit(["PathPatternConfig"])),
                  ]),
                }),
              ])(),
        ]),
        //TODO do we need this ?
        configBuildProperties: ({ properties, lives }) =>
          pipe([
            tap(() => {
              assert(lives);
            }),
            () => `\n,properties: ${JSON.stringify(properties, null, 4)}`,
          ])(),
        codeBuildProperties: ({ group, type, resourceVarName }) =>
          pipe([
            tap(() => {
              assert(true);
            }),
            () =>
              `\nproperties: () => config.${group}.${type}.${resourceVarName}.properties,`,
          ])(),

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
        filterLive: () => pick([]),
      },
    ],
  },
  {
    group: "eks",
    types: [
      {
        type: "Cluster",
        filterLive: () => pick(["version"]),
        dependencies: () => ({
          subnets: { type: "Subnet", group: "ec2" },
          securityGroups: {
            type: "SecurityGroup",
            group: "ec2",
            filterDependency:
              ({ resource }) =>
              (dependency) =>
                pipe([
                  tap(() => {
                    assert(dependency);
                  }),
                  () => dependency,
                  not(get("managedByOther")),
                  tap((result) => {
                    assert(true);
                  }),
                ])(),
          },
          role: { type: "Role", group: "iam" },
          key: { type: "Key", group: "kms" },
        }),
      },
      {
        type: "NodeGroup",
        filterLive: () =>
          pick([
            "capacityType",
            "scalingConfig",
            "instanceTypes",
            "amiType",
            "labels",
            "diskSize",
          ]),
        dependencies: () => ({
          cluster: { type: "Cluster", group: "eks" },
          subnets: { type: "Subnet", group: "ec2" },
          role: { type: "Role", group: "iam" },
        }),
      },
    ],
  },
  {
    group: "route53Domain",
    types: [
      {
        type: "Domain",
        filterLive: () => pick([]),
      },
    ],
  },
  {
    group: "route53",
    types: [
      {
        type: "HostedZone",
        filterLive: () => pick(["Name"]),
      },
      {
        type: "Record",
        filterLive: () =>
          pick(["Name", "Type", "TTL", "ResourceRecords", "AliasTarget"]),
        hasNoProperty: ({ lives, resource }) =>
          pipe([
            () => resource,
            or([
              hasDependency({ type: "LoadBalancer" }),
              hasDependency({ type: "Certificate" }),
            ]),
          ])(),
        dependencies: () => ({
          domain: { type: "Domain", group: "route53" },
          hostedZone: { type: "HostedZone", group: "route53" },
          loadBalancer: { type: "LoadBalancer", group: "elb" },
          certificate: { type: "Certificate", group: "acm" },
        }),
        ignoreResource: () => get("cannotBeDeleted"),
      },
    ],
  },
  {
    group: "lambda",
    types: [
      {
        type: "Layer",
        filterLive: (input) =>
          pipe([
            tap((params) => {
              assert(true);
            }),
            pick([
              "LayerName",
              "Description",
              "CompatibleRuntimes",
              "LicenseInfo",
            ]),
            tap((params) => {
              assert(true);
            }),
          ]),
      },
      {
        type: "Function",
        filterLive: () =>
          pick([
            "FunctionName",
            "Handler",
            "PackageType",
            "Runtime",
            "Description",
            "LicenseInfo",
          ]),
        dependencies: () => ({
          layers: { type: "Layer", group: "lambda" },
          role: { type: "Role", group: "iam" },
        }),
      },
    ],
  },
  {
    group: "rds",
    types: [
      {
        type: "DBCluster",
        filterLive: () =>
          pick([
            "DatabaseName",
            "Engine",
            "EngineVersion",
            "EngineMode",
            "Port",
            "ScalingConfiguration",
            "MasterUsername",
            "AvailabilityZones",
          ]),
        dependencies: () => ({
          dbSubnetGroup: { type: "DBSubnetGroup", group: "rds" },
          securityGroups: { type: "SecurityGroup", group: "ec2" },
          key: { type: "Key", group: "kms" },
        }),
      },
      {
        type: "DBInstance",
        filterLive: () =>
          pick([
            "DBInstanceClass",
            "Engine",
            "EngineVersion",
            "AllocatedStorage",
            "MaxAllocatedStorage",
          ]),
        dependencies: () => ({
          dbSubnetGroup: { type: "DBSubnetGroup", group: "rds" },
          securityGroups: { type: "SecurityGroup", group: "ec2" },
        }),
      },
      {
        type: "DBSubnetGroup",
        filterLive: () => pick(["DBSubnetGroupDescription"]),
        dependencies: () => ({
          subnets: { type: "Subnet", group: "ec2" },
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
