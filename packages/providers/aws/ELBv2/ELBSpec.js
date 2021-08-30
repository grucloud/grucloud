const assert = require("assert");
const { pipe, assign, map, omit, tap } = require("rubico");
const { isOurMinion } = require("../AwsCommon");
const { ELBLoadBalancerV2 } = require("./ELBLoadBalancer");
const { ELBTargetGroup } = require("./ELBTargetGroup");
const { ELBListener } = require("./ELBListener");
const { ELBRule } = require("./ELBRule");
const { compare } = require("@grucloud/core/Common");

const GROUP = "elb";

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "LoadBalancer",
      dependsOn: [
        "ec2::Subnet",
        "ec2::InternetGateway",
        "ec2::NetworkInterface",
        "ec2::SecurityGroup",
      ],
      Client: ELBLoadBalancerV2,
      isOurMinion,
      compare: compare({
        filterTarget: pipe([omit(["Name", "Subnets"])]),
      }),
    },
    {
      type: "TargetGroup",
      dependsOn: ["ec2::Vpc"],
      Client: ELBTargetGroup,
      isOurMinion,
      compare: compare({
        filterTarget: pipe([omit(["Name"])]),
      }),
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
      compare: compare({
        filterTarget: pipe([
          tap((params) => {
            assert(true);
          }),
        ]),
        filterLive: pipe([
          tap((params) => {
            assert(true);
          }),
        ]),
      }),
    },
  ]);
