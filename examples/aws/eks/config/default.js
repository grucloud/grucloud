const pkg = require("../package.json");
//TODO use variable for region
module.exports = () => ({
  projectName: pkg.name,
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
});
