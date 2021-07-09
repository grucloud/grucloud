const pkg = require("./package.json");
module.exports = ({ stage }) => ({
  projectName: pkg.name,
  vpcDefault: {
    name: "vpc-default",
    properties: {
      CidrBlock: "172.31.0.0/16",
      DnsSupport: true,
      DnsHostnames: true,
    },
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
    properties: {
      CidrBlock: "10.1.0.0/24",
      AvailabilityZone: "eu-west-2a",
      MapPublicIpOnLaunch: false,
      MapCustomerOwnedIpOnLaunch: false,
    },
  },
  kp: {
    name: "kp",
  },
  volume: {
    name: "volume",
    properties: {
      Size: 5,
      VolumeType: "standard",
    },
  },
  myip: {
    name: "myip",
  },
  securityGroup: {
    name: "security-group",
    properties: {
      Description: "Security Group Description",
    },
  },
  sgDefaultVpcEc2Example: {
    name: "sg-default-vpc-ec2-example",
    properties: {
      Description: "default VPC security group",
    },
  },
  sgDefaultVpcDefault: {
    name: "sg-default-vpc-default",
    properties: {
      Description: "default VPC security group",
    },
  },
  webServerEc2Vpc: {
    name: "web-server-ec2-vpc",
    properties: {
      InstanceType: "t2.micro",
      ImageId: "ami-0baa0a5cc6cd768ac",
      Placement: {
        AvailabilityZone: "eu-west-2a",
      },
    },
  },
  igw_041e0d42bb3b4149c: {
    name: "igw-041e0d42bb3b4149c",
  },
  ig: {
    name: "ig",
  },
});
