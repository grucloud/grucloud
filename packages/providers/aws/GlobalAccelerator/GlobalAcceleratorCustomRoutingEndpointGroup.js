const assert = require("assert");
const { pipe, tap, get, pick, map, assign, switchCase } = require("rubico");
const { defaultsDeep, append, pluck, callProp, identity } = require("rubico/x");

const { replaceWithName } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { getByNameCore } = require("@grucloud/core/Common");

const pickId = pipe([
  pick(["EndpointGroupArn"]),
  tap(({ EndpointGroupArn }) => {
    assert(EndpointGroupArn);
  }),
]);

const decorate = () =>
  pipe([
    tap(({ EndpointDescriptions }) => {
      assert(EndpointDescriptions);
    }),
    ({ EndpointDescriptions, ...other }) => ({
      EndpointConfigurations: EndpointDescriptions,
      ...other,
    }),
  ]);

exports.GlobalAcceleratorCustomRoutingEndpointGroup = () => ({
  type: "CustomRoutingEndpointGroup",
  package: "global-accelerator",
  client: "GlobalAccelerator",
  region: "us-west-2",
  ignoreErrorCodes: ["EndpointGroupNotFoundException"],
  inferName:
    ({ dependenciesSpec: { listener } }) =>
    ({ EndpointGroupRegion }) =>
      pipe([
        tap(() => {
          assert(listener);
          assert(EndpointGroupRegion);
        }),
        () => `${listener}::${EndpointGroupRegion}`,
      ])(),
  findName:
    ({ lives, config }) =>
    (live) =>
      pipe([
        tap(() => {
          assert(live.EndpointGroupRegion);
        }),
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
      type: "CustomRoutingListener",
      group: "GlobalAccelerator",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("ListenerArn"),
          tap((ListenerArn) => {
            assert(ListenerArn);
          }),
        ]),
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
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GlobalAccelerator.html#describeCustomRoutingEndpointGroup-property
  getById: {
    method: "describeCustomRoutingEndpointGroup",
    getField: "EndpointGroup",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GlobalAccelerator.html#createCustomRoutingEndpointGroup-property
  create: {
    method: "createCustomRoutingEndpointGroup",
    pickCreated: ({ payload }) => pipe([get("EndpointGroup")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GlobalAccelerator.html#updateCustomRoutingEndpointGroup-property
  update: {
    method: "updateCustomRoutingEndpointGroup",
    filterParams: ({ payload, live }) =>
      pipe([
        () => payload,
        defaultsDeep({ EndpointGroupArn: live.EndpointGroupArn }),
      ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GlobalAccelerator.html#deleteCustomRoutingEndpointGroup-property
  destroy: {
    method: "deleteCustomRoutingEndpointGroup",
    pickId,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GlobalAccelerator.html#listEndpointGroups-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "CustomRoutingListener", group: "GlobalAccelerator" },
          pickKey: pipe([pick(["ListenerArn"])]),
          method: "listCustomRoutingEndpointGroups",
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
    properties: { ...otherProps },
    dependencies: { listener },
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        ListenerArn: getField(listener, "ListenerArn"),
      }),
    ])(),
});
