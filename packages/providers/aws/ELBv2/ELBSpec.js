const assert = require("assert");
const { pipe, assign, map, omit, tap, get } = require("rubico");
const { defaultsDeep, unless } = require("rubico/x");
const { isOurMinion } = require("../AwsCommon");
const { ELBLoadBalancerV2 } = require("./ELBLoadBalancer");
const { ELBTargetGroup } = require("./ELBTargetGroup");
const { ELBListener } = require("./ELBListener");
const { ELBRule } = require("./ELBRule");
const { compare, omitIfEmpty } = require("@grucloud/core/Common");

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
        filterLive: pipe([
          omit([
            "LoadBalancerArn",
            "DNSName",
            "CanonicalHostedZoneId",
            "CreatedTime",
            "LoadBalancerName",
            "VpcId",
            "State",
            "AvailabilityZones",
            "IpAddressType",
          ]),
        ]),
      }),
    },
    {
      type: "TargetGroup",
      dependsOn: ["EC2::Vpc"],
      Client: ELBTargetGroup,
      isOurMinion,
      compare: compare({
        filterTarget: pipe([
          omit(["Name"]),
          defaultsDeep({
            HealthCheckPath: "/",
            HealthCheckPort: "traffic-port",
            HealthCheckEnabled: true,
            HealthCheckIntervalSeconds: 30,
            HealthCheckTimeoutSeconds: 5,
            HealthyThresholdCount: 5,
            UnhealthyThresholdCount: 2,
            Matcher: { HttpCode: "200" },
            TargetType: "instance",
            ProtocolVersion: "HTTP1",
          }),
        ]),
        filterLive: pipe([
          omit([
            "TargetGroupArn",
            "TargetGroupName",
            "HealthCheckProtocol",
            "LoadBalancerArns",
          ]),
        ]),
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
      compare: compare({
        filterLive: pipe([
          omit(["ListenerArn", "SslPolicy"]),
          omitIfEmpty(["AlpnPolicy", "Certificates"]),
        ]),
      }),
    },
    {
      type: "Rule",
      dependsOn: ["ELBv2::Listener", "ELBv2::TargetGroup"],
      Client: ELBRule,
      isOurMinion,
      compare: compare({
        filterTarget: pipe([
          defaultsDeep({
            IsDefault: false,
          }),
          unless(
            get("Conditions[0].Values"),
            assign({
              Conditions: () => [
                {
                  Field: "path-pattern",
                  Values: ["/*"],
                },
              ],
            })
          ),
        ]),
        filterLive: pipe([
          omit([
            "RuleArn",
            "TargetGroupName",
            "HealthCheckProtocol",
            "LoadBalancerArns",
          ]),
          assign({
            Conditions: pipe([
              get("Conditions"),
              map(omit(["PathPatternConfig"])),
            ]),
          }),
        ]),
      }),
    },
  ]);
