const assert = require("assert");
const { pipe, assign, map, omit, pick, tap, get } = require("rubico");
const { defaultsDeep, unless, when, pluck } = require("rubico/x");
const { compareAws, isOurMinion } = require("../AwsCommon");
const { ELBLoadBalancerV2 } = require("./ELBLoadBalancer");
const { ELBTargetGroup } = require("./ELBTargetGroup");
const { ELBListener } = require("./ELBListener");
const { ELBRule } = require("./ELBRule");
const { omitIfEmpty } = require("@grucloud/core/Common");
const { hasDependency } = require("@grucloud/core/generatorUtils");

const GROUP = "ElasticLoadBalancingV2";

const compareELB = compareAws({});

module.exports = pipe([
  () => [
    {
      type: "LoadBalancer",
      Client: ELBLoadBalancerV2,
      inferName: () => get("Name"),
      dependencies: {
        subnets: {
          type: "Subnet",
          group: "EC2",
          list: true,
          dependencyIds: ({ lives, config }) =>
            pipe([get("AvailabilityZones"), pluck("SubnetId")]),
        },
        securityGroups: {
          type: "SecurityGroup",
          group: "EC2",
          list: true,
          dependencyIds: ({ lives, config }) => get("SecurityGroups"),
        },
      },
      omitProperties: [
        "Subnets",
        "LoadBalancerArn",
        "DNSName",
        "CanonicalHostedZoneId",
        "CreatedTime",
        "LoadBalancerName",
        "VpcId",
        "State",
        "AvailabilityZones",
      ],
      filterLive: () => pick(["Name", "Scheme", "Type", "IpAddressType"]),
    },
    {
      type: "TargetGroup",
      Client: ELBTargetGroup,
      inferName: () => get("Name"),
      dependencies: {
        vpc: {
          type: "Vpc",
          group: "EC2",
          dependencyId: ({ lives, config }) => get("VpcId"),
        },
        //TODO autoScalingGroup
      },
      propertiesDefault: {
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
        IpAddressType: "ipv4",
      },
      omitProperties: ["TargetGroupArn", "LoadBalancerArns"],
      filterLive: () =>
        pick([
          "Name",
          "Protocol",
          "Port",
          "HealthCheckProtocol",
          "HealthCheckPort",
          "HealthCheckEnabled",
          "HealthCheckIntervalSeconds",
          "HealthCheckTimeoutSeconds",
          "HealthyThresholdCount",
          "HealthCheckPath",
          "Matcher",
          "TargetType",
          "ProtocolVersion",
        ]),
    },
    {
      type: "Listener",
      Client: ELBListener,
      dependencies: {
        loadBalancer: {
          type: "LoadBalancer",
          group: "ElasticLoadBalancingV2",
          parent: true,
          dependencyId: ({ lives, config }) => get("LoadBalancerArn"),
        },
        targetGroup: {
          type: "TargetGroup",
          group: "ElasticLoadBalancingV2",
          dependencyIds: ({ lives, config }) =>
            pipe([get("DefaultActions"), pluck("TargetGroupArn")]),
        },
        certificate: {
          type: "Certificate",
          group: "ACM",
          dependencyIds: ({ lives, config }) =>
            pipe([get("Certificates"), pluck("CertificateArn")]),
        },
      },
      omitProperties: ["ListenerArn", "SslPolicy"],
      compare: compareELB({
        filterLive: () => pipe([omitIfEmpty(["AlpnPolicy", "Certificates"])]),
      }),
      inferName:
        ({ dependenciesSpec: { loadBalancer } }) =>
        ({ Protocol, Port }) =>
          pipe([
            tap(() => {
              assert(loadBalancer);
              assert(Protocol);
              assert(Port);
            }),
            () => `listener::${loadBalancer}::${Protocol}::${Port}`,
          ])(),
      filterLive: pipe([
        ({ resource }) =>
          (live) =>
            pipe([
              () => live,
              when(
                () =>
                  hasDependency({
                    type: "TargetGroup",
                    group: "ElasticLoadBalancingV2",
                  })(resource),
                omit(["DefaultActions"])
              ),
              pick(["Port", "Protocol", "DefaultActions"]),
            ])(),
      ]),
    },
    {
      type: "Rule",
      Client: ELBRule,
      dependencies: {
        listener: {
          type: "Listener",
          group: "ElasticLoadBalancingV2",
          parent: true,
          dependencyId: ({ lives, config }) => get("ListenerArn"),
        },
        targetGroup: {
          type: "TargetGroup",
          group: "ElasticLoadBalancingV2",
          //TODO list ?
          dependencyIds: ({ lives, config }) =>
            pipe([get("Actions"), pluck("TargetGroupArn")]),
        },
      },
      omitProperties: [
        "RuleArn",
        "TargetGroupName",
        "HealthCheckProtocol",
        "LoadBalancerArns",
      ],
      propertiesDefault: {
        IsDefault: false,
      },
      compare: compareELB({
        filterTarget: () =>
          pipe([
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
        filterLive: () =>
          pipe([
            assign({
              Conditions: pipe([
                get("Conditions"),
                map(omit(["PathPatternConfig"])),
              ]),
            }),
          ]),
      }),
      inferName:
        ({ dependenciesSpec: { listener } }) =>
        ({ Priority }) =>
          pipe([
            tap(() => {
              assert(listener);
              assert(Priority);
            }),
            () => `rule::${listener}::${Priority}`,
          ])(),
      filterLive: pipe([
        ({ resource }) =>
          (live) =>
            pipe([
              () => live,
              when(
                () =>
                  hasDependency({
                    type: "TargetGroup",
                    group: "ElasticLoadBalancingV2",
                  })(resource),
                omit(["Actions"])
              ),
              pick(["Priority", "Conditions", "Actions"]),
              assign({
                Conditions: pipe([
                  get("Conditions"),
                  map(omit(["PathPatternConfig"])),
                ]),
              }),
            ])(),
      ]),
    },
  ],
  map(defaultsDeep({ group: GROUP, compare: compareELB({}), isOurMinion })),
]);
