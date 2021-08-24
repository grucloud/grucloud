const { pipe, assign, map } = require("rubico");
const { isOurMinion } = require("../AwsCommon");

const {
  AutoScalingAutoScalingGroup,
} = require("./AutoScalingAutoScalingGroup");
const {
  AutoScalingLaunchConfiguration,
} = require("./AutoScalingLaunchConfiguration");

const GROUP = "autoscaling";

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "AutoScalingGroup",
      dependsOn: [
        "autoscaling::LaunchConfiguration",
        "ec2::LaunchTemplate",
        "ec2::Subnet",
        "elb::LoadBalancer",
        "elb::TargetGroup",
        "eks::Cluster",
      ],
      Client: AutoScalingAutoScalingGroup,
      isOurMinion,
    },
    {
      type: "LaunchConfiguration",
      dependsOn: [
        "ec2::KeyPair",
        "ec2::SecurityGroup",
        "ec2::Subnet",
        "ec2::ElasticIpAddress",
        "iam::InstanceProfile",
        "ec2::Volume",
        "ec2::NetworkInterface",
        "ec2::InternetGateway",
      ],
      Client: AutoScalingLaunchConfiguration,
      isOurMinion: () => true,
    },
  ]);
