// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  { type: "KeyPair", group: "EC2", name: "kp-ec2-example" },
  { type: "ElasticIpAddress", group: "EC2", name: "eip" },
  {
    type: "ElasticIpAddressAssociation",
    group: "EC2",
    dependencies: ({}) => ({
      eip: "eip",
      instance: "web-server-ec2-example",
    }),
  },
  {
    type: "Instance",
    group: "EC2",
    name: "web-server-ec2-example",
    properties: ({ config }) => ({
      InstanceType: "t2.micro",
      Image: {
        Description: "Amazon Linux 2 AMI 2.0.20211001.1 x86_64 HVM gp2",
      },
      Placement: {
        AvailabilityZone: `${config.region}d`,
      },
    }),
    dependencies: ({}) => ({
      keyPair: "kp-ec2-example",
      eip: "eip",
    }),
  },
];
