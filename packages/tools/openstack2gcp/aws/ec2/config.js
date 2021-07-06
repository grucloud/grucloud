const pkg = require("./package.json");
module.exports = ({ stage }) => ({
  projectName: pkg.name,
  kp: {
    name: "kp",
  },
  vpcEc2Example: {
    name: "vpc-ec2-example",
    properties: {
      CidrBlock: "10.1.0.0/16",
      DnsSupport: true,
      DnsHostnames: false,
    },
  },
  subnet: {
    name: "subnet",
    attributes: {
      MapPublicIpOnLaunch: "false",
    },
    properties: {
      CidrBlock: "10.1.0.0/24",
      AvailabilityZone: "eu-west-2a",
    },
  },
  webServer: {
    name: "web-server",
    properties: {
      InstanceType: "t2.micro",
      ImageId: "ami-00f61f0016c09a299",
    },
  },
});
