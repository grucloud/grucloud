const pkg = require("./package.json");
module.exports = ({ stage }) => ({
  projectName: pkg.name,
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
    properties: {
      CidrBlock: "10.1.0.0/24",
      AvailabilityZone: "eu-west-2a",
      MapPublicIpOnLaunch: false,
    },
  },
  kp: {
    name: "kp",
  },
  vol_0b9f83a9d3d0ee391: {
    name: "vol-0b9f83a9d3d0ee391",
    properties: {
      Size: 8,
      VolumeType: "gp2",
    },
  },
  volume: {
    name: "volume",
    properties: {
      Size: 5,
      VolumeType: "standard",
    },
  },
  webServer: {
    name: "web-server",
    properties: {
      InstanceType: "t2.micro",
      ImageId: "ami-00f61f0016c09a299",
      Placement: {
        AvailabilityZone: "eu-west-2a",
      },
    },
  },
});
