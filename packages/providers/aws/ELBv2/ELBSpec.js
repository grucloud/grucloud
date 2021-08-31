const assert = require("assert");
const { pipe, assign, map, omit, tap } = require("rubico");
const { isOurMinion } = require("../AwsCommon");
const { ELBLoadBalancerV2 } = require("./ELBLoadBalancer");
const { ELBTargetGroup } = require("./ELBTargetGroup");
const { ELBListener } = require("./ELBListener");
const { ELBRule } = require("./ELBRule");
const { compare } = require("@grucloud/core/Common");

const GROUP = "ELBv2";

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "LoadBalancer",
      dependsOn: [
        "EC2::Subnet",
        "EC2::InternetGateway",
        "EC2::NetworkInterface",
        "EC2::SecurityGroup",
      ],
      Client: ELBLoadBalancerV2,
      isOurMinion,
      compare: compare({
        filterTarget: pipe([omit(["Name", "Subnets"])]),
      }),
    },
    {
      type: "TargetGroup",
      dependsOn: ["EC2::Vpc"],
      Client: ELBTargetGroup,
      isOurMinion,
      compare: compare({
        filterTarget: pipe([omit(["Name"])]),
      }),
    },
    {
      type: "Listener",
      dependsOn: [
        "ELBv2::LoadBalancer",
        "ELBv2::TargetGroup",
        "ACM::Certificate",
      ],
      Client: ELBListener,
      isOurMinion,
    },
    {
      type: "Rule",
      dependsOn: ["ELBv2::Listener", "ELBv2::TargetGroup"],
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
