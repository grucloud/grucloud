const assert = require("assert");
const { pipe, tap, get, pick, eq, map, assign, or } = require("rubico");
const { defaultsDeep, append, when, first } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");
const { getByNameCore } = require("@grucloud/core/Common");

const pickId = pick(["EndpointGroupArn"]);

const decorate = () =>
  pipe([
    ({ EndpointDescriptions, ...other }) => ({
      EndpointConfigurations: EndpointDescriptions,
      ...other,
    }),
  ]);

exports.GlobalAcceleratorEndpointGroup = () => ({
  type: "EndpointGroup",
  package: "global-accelerator",
  client: "GlobalAccelerator",
  region: "us-west-2",
  ignoreErrorCodes: ["EndpointGroupNotFoundException"],
  inferName:
    ({ dependenciesSpec: { listener } }) =>
    ({ EndpointGroupRegion }) =>
      pipe([() => `${listener}::${EndpointGroupRegion}`])(),
  findName:
    ({ lives, config }) =>
    (live) =>
      pipe([
        () => live,
        get("ListenerArn"),
        lives.getById({
          type: "Listener",
          group: "GlobalAccelerator",
          providerName: config.providerName,
        }),
        get("name"),
        tap((name) => {
          assert(name);
        }),
        append(`::${live.EndpointGroupRegion}`),
      ])(),
  findId: () => pipe([get("EndpointGroupArn")]),
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
  getByName: getByNameCore,
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GlobalAccelerator.html#describeEndpointGroup-property
  getById: {
    method: "describeEndpointGroup",
    getField: "EndpointGroup",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GlobalAccelerator.html#createEndpointGroup-property
  create: {
    method: "createEndpointGroup",
    pickCreated: ({ payload }) => pipe([get("EndpointGroup")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GlobalAccelerator.html#updateEndpointGroup-property
  update: {
    method: "updateEndpointGroup",
    filterParams: ({ payload, live }) =>
      pipe([
        () => payload,
        defaultsDeep({ EndpointGroupArn: live.EndpointGroupArn }),
      ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GlobalAccelerator.html#deleteEndpointGroup-property
  destroy: {
    method: "deleteEndpointGroup",
    pickId,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GlobalAccelerator.html#listEndpointGroups-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Listener", group: "GlobalAccelerator" },
          pickKey: pipe([pick(["ListenerArn"])]),
          method: "listEndpointGroups",
          getParam: "EndpointGroups",
          config,
          decorate: ({ parent }) =>
            pipe([
              tap((params) => {
                assert(parent);
              }),
              defaultsDeep({
                ListenerArn: parent.ListenerArn,
                AcceleratorName: parent.AcceleratorName,
              }),
              decorate(),
            ]),
        }),
    ])(),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { listener },
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        ListenerArn: getField(listener, "ListenerArn"),
      }),
    ])(),
});
