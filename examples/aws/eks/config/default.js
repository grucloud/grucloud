const pkg = require("../package.json");

module.exports = () => ({
  projectName: pkg.name,
  vpc: {
    subnetsPrivate: [
      {
        name: "subnet-private-1",
        CidrBlock: "10.1.1.1/24",
        AvailabilityZone: "eu-west-2a",
      },
      {
        name: "subnet-private-2",
        CidrBlock: "10.1.2.1/24",
        AvailabilityZone: "eu-west-2b",
      },
      {
        name: "subnet-private-3",
        CidrBlock: "10.1.3.1/24",
        AvailabilityZone: "eu-west-2c",
      },
    ],
  },
});
