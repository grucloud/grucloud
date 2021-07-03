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
      dependsOn: ["Subnet", "InternetGateway", "NetworkInterface"],
      Client: ELBLoadBalancerV2,
      isOurMinion,
    },
    {
      type: "TargetGroup",
      dependsOn: ["Vpc"],
      Client: ELBTargetGroup,
      isOurMinion,
    },
    {
      type: "Listener",
      dependsOn: ["LoadBalancer", "TargetGroup", "Certificate"],
      Client: ELBListener,
      isOurMinion,
    },
    {
      type: "Rule",
      dependsOn: ["Listener", "TargetGroup"],
      Client: ELBRule,
      isOurMinion,
    },
  ]);
