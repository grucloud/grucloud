const assert = require("assert");
const {
  pipe,
  assign,
  map,
  omit,
  pick,
  tap,
  get,
  switchCase,
} = require("rubico");
const { defaultsDeep, identity, unless } = require("rubico/x");
const { isOurMinion } = require("../AwsCommon");
const { ELBLoadBalancerV2 } = require("./ELBLoadBalancer");
const { ELBTargetGroup } = require("./ELBTargetGroup");
const { ELBListener } = require("./ELBListener");
const { ELBRule } = require("./ELBRule");
const { compare, omitIfEmpty } = require("@grucloud/core/Common");
const { hasDependency } = require("@grucloud/core/generatorUtils");

const GROUP = "ELBv2";

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "LoadBalancer",
      dependsOn: [
        "EC2::Subnet",
        "EC2::InternetGateway",
        //"EC2::NetworkInterface",
        "EC2::SecurityGroup",
      ],

      Client: ELBLoadBalancerV2,
      isOurMinion,
      compare: compare({
        filterTarget: () => pipe([omit(["Name", "Subnets", "Tags"])]),
        filterLive: () =>
          pipe([
            omit([
              "LoadBalancerArn",
              "DNSName",
              "CanonicalHostedZoneId",
              "CreatedTime",
              "LoadBalancerName",
              "VpcId",
              "State",
              "AvailabilityZones",
              "Tags",
            ]),
          ]),
      }),
      includeDefaultDependencies: true,
      filterLive: () => pick(["Scheme", "Type", "IpAddressType"]),
      dependencies: {
        subnets: { type: "Subnet", group: "EC2", list: true },
        securityGroups: { type: "SecurityGroup", group: "EC2", list: true },
        role: { type: "Role", group: "IAM" },
        key: { type: "Key", group: "KMS" },
      },
    },
    {
      type: "TargetGroup",
      dependsOn: ["EC2::Vpc"],
      Client: ELBTargetGroup,
      isOurMinion,
      compare: compare({
        filterTarget: () =>
          pipe([
            omit(["Name", "Tags"]),
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
              IpAddressType: "ipv4",
            }),
          ]),
        filterLive: () =>
          pipe([
            omit([
              "TargetGroupArn",
              "TargetGroupName",
              "LoadBalancerArns",
              "Tags",
            ]),
          ]),
      }),
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
      dependencies: {
        vpc: { type: "Vpc", group: "EC2" },
        nodeGroup: {
          type: "NodeGroup",
          group: "EKS",
        },
        //TODO autoScalingGroup
      },
    },
    {
      type: "Listener",
      dependsOn: [
        "ELBv2::LoadBalancer",
        "ELBv2::TargetGroup",
        "ACM::Certificate",
      ],
      dependsOnList: ["ELBv2::LoadBalancer"],
      Client: ELBListener,
      isOurMinion,
      compare: compare({
        filterTarget: () => pipe([omit(["Tags"])]),
        filterLive: () =>
          pipe([
            omit(["ListenerArn", "SslPolicy", "Tags"]),
            omitIfEmpty(["AlpnPolicy", "Certificates"]),
          ]),
      }),
      inferName: ({ properties, dependencies }) =>
        pipe([
          dependencies,
          tap(({ loadBalancer }) => {
            assert(loadBalancer);
          }),
          ({ loadBalancer }) =>
            `listener::${loadBalancer.name}::${properties.Protocol}::${properties.Port}`,
          tap((params) => {
            assert(true);
          }),
        ])(),
      filterLive: () =>
        pipe([
          tap((params) => {
            assert(true);
          }),
          ({ resource }) =>
            (live) =>
              pipe([
                () => live,
                //TODO when
                switchCase([
                  () =>
                    hasDependency({ type: "TargetGroup", group: "ELBv2" })(
                      resource
                    ),
                  omit(["DefaultActions"]),
                  identity,
                ]),
                tap((params) => {
                  assert(true);
                }),
                pick(["Port", "Protocol", "DefaultActions"]),
              ])(),
        ]),
      dependencies: {
        loadBalancer: { type: "LoadBalancer", group: "ELBv2", parent: true },
        targetGroup: { type: "TargetGroup", group: "ELBv2" },
        certificate: { type: "Certificate", group: "ACM" },
      },
    },
    {
      type: "Rule",
      dependsOn: ["ELBv2::Listener", "ELBv2::TargetGroup"],
      dependsOnList: ["ELBv2::Listener"],
      Client: ELBRule,
      isOurMinion,
      compare: compare({
        filterTarget: () =>
          pipe([
            omit(["Tags"]),
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
        filterLive: () =>
          pipe([
            omit([
              "Tags",
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
      inferName: ({ properties, dependencies }) =>
        pipe([
          dependencies,
          tap(({ listener }) => {
            assert(listener);
          }),
          ({ listener }) => `rule::${listener.name}::${properties.Priority}`,
        ])(),
      filterLive: () =>
        pipe([
          ({ resource }) =>
            (live) =>
              pipe([
                () => live,
                //TODO when
                switchCase([
                  () =>
                    hasDependency({ type: "TargetGroup", group: "ELBv2" })(
                      resource
                    ),
                  omit(["Actions"]),
                  identity,
                ]),
                pick(["Priority", "Conditions", "Actions"]),
                assign({
                  Conditions: pipe([
                    get("Conditions"),
                    map(omit(["PathPatternConfig"])),
                  ]),
                }),
              ])(),
        ]),
      //TODO do we need this ?
      configBuildProperties: ({ properties, lives }) =>
        pipe([
          tap(() => {
            assert(lives);
          }),
          () => `\n,properties: ${JSON.stringify(properties, null, 4)}`,
        ])(),
      codeBuildProperties: ({ group, type, resourceVarName }) =>
        pipe([
          tap(() => {
            assert(true);
          }),
          () =>
            `\nproperties: () => config.${group}.${type}.${resourceVarName}.properties,`,
        ])(),
      dependencies: {
        listener: { type: "Listener", group: "ELBv2", parent: true },
        targetGroup: { type: "TargetGroup", group: "ELBv2" },
      },
    },
  ]);
