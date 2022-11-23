const { replaceWithName } = require("@grucloud/core/Common");
const assert = require("assert");
const { tap, pipe, map, get, assign, switchCase } = require("rubico");
const { defaultsDeep, pluck, identity, callProp } = require("rubico/x");

const { compareAws } = require("../AwsCommon");
const {
  GlobalAcceleratorAccelerator,
} = require("./GlobalAcceleratorAccelerator");
const {
  GlobalAcceleratorEndpointGroup,
} = require("./GlobalAcceleratorEndpointGroup");

const { GlobalAcceleratorListener } = require("./GlobalAcceleratorListener");

const GROUP = "GlobalAccelerator";
const tagsKey = "Tags";
const compare = compareAws({ tagsKey, key: "Key" });

module.exports = pipe([
  () => [
    {
      type: "Accelerator",
      Client: GlobalAcceleratorAccelerator,
      propertiesDefault: { Enabled: true, IpAddressType: "IPV4" },
      omitProperties: [
        "AcceleratorArn",
        "DnsName",
        "Status",
        "CreatedTime",
        "LastModifiedTime",
        "DualStackDnsName",
        "Events",
        "IpSets",
      ],
      inferName: () => get("Name"),
      dependencies: {
        s3Bucket: {
          type: "Bucket",
          group: "S3",
          dependencyId: ({ lives, config }) =>
            get("AcceleratorAttributes.FlowLogsS3Bucket"),
        },
      },
    },
    {
      type: "EndpointGroup",
      Client: GlobalAcceleratorEndpointGroup,
      propertiesDefault: {
        HealthCheckIntervalSeconds: 30,
        ThresholdCount: 3,
        TrafficDialPercentage: 100,
      },
      omitProperties: [
        "ListenerArn",
        "HealthState",
        "EndpointGroupArn",
        "EndpointConfigurations[].HealthState",
        "EndpointConfigurations[].HealthReason",
      ],
      inferName:
        ({ dependenciesSpec: { listener } }) =>
        ({ EndpointGroupRegion }) =>
          pipe([() => `${listener}::${EndpointGroupRegion}`])(),
      dependencies: {
        listener: {
          type: "Listener",
          group: "GlobalAccelerator",
          parent: true,
          dependencyId: ({ lives, config }) => get("ListenerArn"),
        },
        ec2Instances: {
          type: "Instance",
          group: "EC2",
          list: true,
          dependencyIds: ({ lives, config }) =>
            pipe([get("EndpointConfigurations"), pluck("EndpointId")]),
        },
        eips: {
          type: "ElasticIpAddress",
          group: "EC2",
          list: true,
          dependencyIds: ({ lives, config }) =>
            pipe([get("EndpointConfigurations"), pluck("EndpointId")]),
        },
        loadBalancers: {
          type: "LoadBalancer",
          group: "ElasticLoadBalancingV2",
          list: true,
          dependencyIds: ({ lives, config }) =>
            pipe([get("EndpointConfigurations"), pluck("EndpointId")]),
        },
      },
      filterLive: ({ lives, providerConfig }) =>
        pipe([
          assign({
            EndpointConfigurations: pipe([
              get("EndpointConfigurations"),
              map(
                assign({
                  EndpointId: pipe([
                    get("EndpointId"),
                    switchCase([
                      callProp("startsWith", "arn:aws:elasticloadbalancing"),
                      replaceWithName({
                        groupType: "ElasticLoadBalancingV2::LoadBalancer",
                        path: "id",
                        providerConfig,
                        lives,
                      }),
                      callProp("startsWith", "eipalloc-"),
                      replaceWithName({
                        groupType: "EC2::ElasticIpAddress",
                        path: "id",
                        providerConfig,
                        lives,
                      }),
                      callProp("startsWith", "i-"),
                      replaceWithName({
                        groupType: "EC2::Instance",
                        path: "id",
                        providerConfig,
                        lives,
                      }),
                      identity,
                    ]),
                  ]),
                })
              ),
            ]),
          }),
        ]),
    },
    {
      type: "Listener",
      Client: GlobalAcceleratorListener,
      propertiesDefault: { ClientAffinity: "NONE" },
      omitProperties: ["AcceleratorArn", "ListenerArn"],
      inferName:
        ({ dependenciesSpec: { accelerator } }) =>
        ({ Protocol, PortRanges }) =>
          pipe([
            () =>
              `${accelerator}::${Protocol}::${PortRanges[0].FromPort}::${PortRanges[0].ToPort}`,
          ])(),
      dependencies: {
        accelerator: {
          type: "Accelerator",
          group: "GlobalAccelerator",
          parent: true,
          dependencyId: ({ lives, config }) => get("AcceleratorArn"),
        },
      },
    },
  ],
  map(
    defaultsDeep({
      group: GROUP,
      compare: compare({}),
      tagsKey,
    })
  ),
]);
