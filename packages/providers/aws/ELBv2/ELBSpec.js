const assert = require("assert");
const { pipe, assign, map, omit, pick, tap, get } = require("rubico");
const { defaultsDeep, unless, when } = require("rubico/x");
const { compareAws, isOurMinion } = require("../AwsCommon");
const { ELBLoadBalancerV2 } = require("./ELBLoadBalancer");
const { ELBTargetGroup } = require("./ELBTargetGroup");
const { ELBListener } = require("./ELBListener");
const { ELBRule } = require("./ELBRule");
const { omitIfEmpty } = require("@grucloud/core/Common");
const { hasDependency } = require("@grucloud/core/generatorUtils");

const GROUP = "ELBv2";

const compareELB = compareAws({});

module.exports = pipe([
  () => [
    {
      type: "LoadBalancer",
      dependencies: {
        subnets: { type: "Subnet", group: "EC2", list: true },
        internetGateway: { type: "InternetGateway", group: "EC2" },
        securityGroups: { type: "SecurityGroup", group: "EC2", list: true },
        role: { type: "Role", group: "IAM" },
        key: { type: "Key", group: "KMS" },
      },
      Client: ELBLoadBalancerV2,
      omitProperties: [
        "Name",
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
      includeDefaultDependencies: true,
      filterLive: () => pick(["Scheme", "Type", "IpAddressType"]),
    },
    {
      type: "TargetGroup",
      Client: ELBTargetGroup,
      dependencies: {
        vpc: { type: "Vpc", group: "EC2" },
        nodeGroup: {
          type: "NodeGroup",
          group: "EKS",
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
      omitProperties: [
        "Name",
        "TargetGroupArn",
        "TargetGroupName",
        "LoadBalancerArns",
      ],
      filterLive: () =>
        pick([
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
        loadBalancer: { type: "LoadBalancer", group: "ELBv2", parent: true },
        targetGroup: { type: "TargetGroup", group: "ELBv2" },
        certificate: { type: "Certificate", group: "ACM" },
      },
      omitProperties: ["ListenerArn", "SslPolicy"],
      compare: compareELB({
        filterLive: () => pipe([omitIfEmpty(["AlpnPolicy", "Certificates"])]),
      }),
      inferName: ({ properties, dependencies }) =>
        pipe([
          dependencies,
          tap(({ loadBalancer }) => {
            assert(loadBalancer);
          }),
          ({ loadBalancer }) =>
            `listener::${loadBalancer.name}::${properties.Protocol}::${properties.Port}`,
        ])(),
      filterLive: pipe([
        ({ resource }) =>
          (live) =>
            pipe([
              () => live,
              when(
                () =>
                  hasDependency({ type: "TargetGroup", group: "ELBv2" })(
                    resource
                  ),
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
        listener: { type: "Listener", group: "ELBv2", parent: true },
        targetGroup: { type: "TargetGroup", group: "ELBv2" },
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
      inferName: ({ properties, dependencies }) =>
        pipe([
          dependencies,
          tap(({ listener }) => {
            assert(listener);
          }),
          ({ listener }) => `rule::${listener.name}::${properties.Priority}`,
        ])(),
      filterLive: pipe([
        ({ resource }) =>
          (live) =>
            pipe([
              () => live,
              when(
                () =>
                  hasDependency({ type: "TargetGroup", group: "ELBv2" })(
                    resource
                  ),
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
