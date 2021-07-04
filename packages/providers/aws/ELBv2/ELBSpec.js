const { pipe, assign, map } = require("rubico");
const { isOurMinion } = require("../AwsCommon");
const { ELBLoadBalancerV2 } = require("./ELBLoadBalancer");
const { ELBTargetGroup } = require("./ELBTargetGroup");
const { ELBListener } = require("./ELBListener");
const { ELBRule } = require("./ELBRule");

const GROUP = "elb";

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "LoadBalancer",
      dependsOn: [
        "ec2::Subnet",
        "ec2::InternetGateway",
        "ec2::NetworkInterface",
      ],
      Client: ELBLoadBalancerV2,
      isOurMinion,
    },
    {
      type: "TargetGroup",
      dependsOn: ["ec2::Vpc"],
      Client: ELBTargetGroup,
      isOurMinion,
    },
    {
      type: "Listener",
      dependsOn: ["elb::LoadBalancer", "elb::TargetGroup", "acm::Certificate"],
      Client: ELBListener,
      isOurMinion,
    },
    {
      type: "Rule",
      dependsOn: ["elb::Listener", "elb::TargetGroup"],
      Client: ELBRule,
      isOurMinion,
    },
  ]);
