// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "AutoScalingGroup",
    group: "AutoScaling",
    name: "asg",
    properties: ({}) => ({
      MinSize: 1,
      MaxSize: 2,
      DesiredCapacity: 1,
    }),
    dependencies: () => ({
      subnets: ["Vpc::PubSubnetAz1", "Vpc::PubSubnetAz2"],
      launchTemplate: "lt-ec2-micro",
    }),
  },
];
