const pkg = require("./package.json");
module.exports = ({ region }) => ({
  projectName: pkg.name,
  certificate: {
    rootDomainName: "grucloud.org",
    domainName: "multi-test.grucloud.org",
  },
  eks: {
    vpc: {
      CidrBlock: "192.168.0.0/16",
      subnetsPublic: [
        {
          name: "subnet-public-1",
          CidrBlock: "192.168.0.0/19",
          AvailabilityZone: `${region}a`,
        },
        {
          name: "subnet-public-2",
          CidrBlock: "192.168.32.0/19",
          AvailabilityZone: `${region}b`,
        },
        {
          name: "subnet-public-3",
          CidrBlock: "192.168.64.0/19",
          AvailabilityZone: `${region}c`,
        },
      ],
      subnetsPrivate: [
        {
          name: "subnet-private-1",
          CidrBlock: "192.168.96.0/19",
          AvailabilityZone: `${region}a`,
        },
        {
          name: "subnet-private-2",
          CidrBlock: "192.168.128.0/19",
          AvailabilityZone: `${region}b`,
        },
        {
          name: "subnet-private-3",
          CidrBlock: "192.168.160.0/19",
          AvailabilityZone: `${region}c`,
        },
      ],
    },
  },
});
