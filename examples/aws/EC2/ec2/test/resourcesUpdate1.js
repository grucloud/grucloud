// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Instance",
    group: "EC2",
    name: "web-server-ec2-example",
    properties: ({ config }) => ({
      InstanceType: "t3.micro",
      Image: {
        Description: "Amazon Linux 2 AMI 2.0.20211001.1 x86_64 HVM gp2",
      },
      Placement: {
        AvailabilityZone: `${config.region}d`,
      },
    }),
    dependencies: () => ({
      keyPair: "kp-ec2-example",
      eip: "eip",
    }),
  },
];