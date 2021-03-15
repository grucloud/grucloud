const pkg = require("../package.json");

module.exports = () => ({
  google: {
    projectName: () => "grucloud-e2e",
    projectId: () => "grucloud-e2e",
    region: "europe-west4",
    zone: "europe-west4-a",
    domainName: "grucloud.org",
  },
  aws: {
    projectName: pkg.name,
    region: "eu-west-2",
    zone: "eu-west-2a",
    rootDomainName: "grucloud.org",
    domainName: "multi-test.grucloud.org",
    vpc: {
      CidrBlock: "192.168.0.0/16",
      subnetsPublic: [
        {
          name: "subnet-public-1",
          CidrBlock: "192.168.0.0/19",
          AvailabilityZone: "eu-west-2a",
        },
        {
          name: "subnet-public-2",
          CidrBlock: "192.168.32.0/19",
          AvailabilityZone: "eu-west-2b",
        },
        {
          name: "subnet-public-3",
          CidrBlock: "192.168.64.0/19",
          AvailabilityZone: "eu-west-2c",
        },
      ],
      subnetsPrivate: [
        {
          name: "subnet-private-1",
          CidrBlock: "192.168.96.0/19",
          AvailabilityZone: "eu-west-2a",
        },
        {
          name: "subnet-private-2",
          CidrBlock: "192.168.128.0/19",
          AvailabilityZone: "eu-west-2b",
        },
        {
          name: "subnet-private-3",
          CidrBlock: "192.168.160.0/19",
          AvailabilityZone: "eu-west-2c",
        },
      ],
    },
  },
  azure: {
    location: "uksouth",
  },
  k8s: { projectName: pkg.name },
  scaleway: {
    zone: "fr-par-1",
  },
});
