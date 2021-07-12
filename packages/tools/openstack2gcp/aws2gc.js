#!/usr/bin/env node
const assert = require("assert");
const { pipe, tap, get, eq, map, switchCase, any, not } = require("rubico");
const { identity, pluck, includes } = require("rubico/x");
const { createProgramOptions, generatorMain } = require("./generatorUtils");

const { configTpl } = require("./src/configTpl");
const { iacTpl } = require("./src/aws/iacTpl");

const { writeResources, findLiveById } = require("./generatorUtils");

const writers = [
  //EC2
  writeResources({
    type: "Vpc",
    group: "ec2",
    pickProperties: () => ["CidrBlock", "DnsSupport", "DnsHostnames"],
  }),
  writeResources({
    type: "Subnet",
    group: "ec2",
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
  }),
  writeResources({
    type: "KeyPair",
    group: "ec2",
    pickProperties: () => [],
    createPrefix: "use",
  }),
  writeResources({
    type: "Volume",
    group: "ec2",
    pickProperties: () => ["Size", "VolumeType", "Device"],
    ignoreResource:
      ({ lives }) =>
      (resource) =>
        pipe([
          () => resource,
          get("live.Attachments"),
          map(({ Device, InstanceId }) =>
            pipe([
              () => InstanceId,
              findLiveById({ type: "Instance", lives }),
              eq(get("live.RootDeviceName"), Device),
            ])()
          ),
          any(identity),
        ])(),
  }),
  writeResources({
    type: "ElasticIpAddress",
    group: "ec2",
    pickProperties: () => [],
  }),
  writeResources({
    type: "SecurityGroup",
    group: "ec2",
    pickProperties: () => ["Description"],
    dependencies: () => ({ vpc: { type: "Vpc", group: "ec2" } }),
  }),
  writeResources({
    type: "SecurityGroupRuleIngress",
    group: "ec2",
    pickProperties: () => ["IpPermissions"],
    dependencies: () => ({
      securityGroup: { type: "SecurityGroup", group: "ec2" },
    }),
  }),
  writeResources({
    type: "SecurityGroupRuleEgress",
    group: "ec2",
    pickProperties: () => ["IpPermissions"],
    dependencies: () => ({
      securityGroup: { type: "SecurityGroup", group: "ec2" },
    }),
  }),
  writeResources({
    type: "Instance",
    group: "ec2",
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
  }),
  writeResources({
    type: "InternetGateway",
    group: "ec2",
    pickProperties: () => [],
    dependencies: () => ({ vpc: { type: "Vpc", group: "ec2" } }),
  }),
  // Route 53
  writeResources({
    type: "HostedZone",
    group: "route53",
    pickProperties: () => ["Name"],
  }),
  writeResources({
    type: "Record",
    group: "route53",
    pickProperties: () => ["Name", "Type", "TTL", "ResourceRecords"],
    dependencies: () => ({
      hostedZone: { type: "HostedZone", group: "route53" },
    }),
    ignoreResource: () => get("cannotBeDeleted"),
  }),
  // IAM
  writeResources({
    type: "Policy",
    group: "iam",
    pickProperties: switchCase([
      get("resource.cannotBeDeleted"),
      () => ["Arn", "name"],
      () => ["PolicyName", "PolicyDocument", "Path", "Description"],
    ]),
  }),
  writeResources({
    type: "Role",
    group: "iam",
    pickProperties: () => ["RoleName", "Path", "AssumeRolePolicyDocument"],
    dependencies: () => ({ policies: { type: "Policy", group: "iam" } }),
  }),
];

//TODO read version from package.json
const options = createProgramOptions({ version: "1.0" });

generatorMain({ name: "aws2gc", options, writers, iacTpl, configTpl })
  .then(() => {})
  .catch((error) => {
    console.error("error");
    console.error(error);
    throw error;
  });
