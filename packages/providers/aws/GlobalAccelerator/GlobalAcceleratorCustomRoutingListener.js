const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");
const { getByNameCore } = require("@grucloud/core/Common");

const pickId = pipe([
  pick(["ListenerArn"]),
  tap(({ ListenerArn }) => {
    assert(ListenerArn);
  }),
]);

exports.GlobalAcceleratorCustomRoutingListener = () => ({
  type: "CustomRoutingListener",
  package: "global-accelerator",
  client: "GlobalAccelerator",
  region: "us-west-2",
  ignoreErrorCodes: ["ListenerNotFoundException"],
  inferName:
    ({ dependenciesSpec: { accelerator } }) =>
    ({ Protocol, PortRanges }) =>
      pipe([
        tap(() => {
          assert(accelerator);
          assert(Protocol);
          assert(PortRanges);
        }),
        () =>
          `${accelerator}::${Protocol}::${PortRanges[0].FromPort}::${PortRanges[0].ToPort}`,
      ])(),
  findName: () =>
    pipe([
      tap(({ AcceleratorName, Protocol, PortRanges }) => {
        assert(AcceleratorName);
        assert(Protocol);
        assert(PortRanges);
      }),
      ({ AcceleratorName, Protocol, PortRanges }) =>
        `${AcceleratorName}::${Protocol}::${PortRanges[0].FromPort}::${PortRanges[0].ToPort}`,
    ]),
  findId: () =>
    pipe([
      get("ListenerArn"),
      tap((ListenerArn) => {
        assert(ListenerArn);
      }),
    ]),
  propertiesDefault: { ClientAffinity: "NONE" },
  omitProperties: ["AcceleratorArn", "ListenerArn"],
  dependencies: {
    accelerator: {
      type: "CustomRoutingAccelerator",
      group: "GlobalAccelerator",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("AcceleratorArn"),
          tap((AcceleratorArn) => {
            assert(AcceleratorArn);
          }),
        ]),
    },
  },
  getByName: getByNameCore,
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GlobalAccelerator.html#listListeners-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: {
            type: "CustomRoutingAccelerator",
            group: "GlobalAccelerator",
          },
          pickKey: pipe([pick(["AcceleratorArn"])]),
          method: "listCustomRoutingListeners",
          getParam: "Listeners",
          config,
          decorate: ({ parent }) =>
            pipe([
              tap((params) => {
                assert(parent.Name);
                assert(parent.AcceleratorArn);
              }),
              defaultsDeep({
                AcceleratorArn: parent.AcceleratorArn,
                AcceleratorName: parent.Name,
              }),
            ]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GlobalAccelerator.html#updateAccelerator-property
  //TODO
  update:
    ({ endpoint }) =>
    async ({ pickId, payload, diff, live }) =>
      pipe([
        tap((params) => {
          assert(endpoint);
        }),
        () => diff,
      ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GlobalAccelerator.html#describeCustomRoutingListener-property
  getById: {
    method: "describeCustomRoutingListener",
    getField: "Listener",
    pickId,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GlobalAccelerator.html#createCustomRoutingListener-property
  create: {
    method: "createCustomRoutingListener",
    pickCreated: ({ payload }) => pipe([get("Listener")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GlobalAccelerator.html#deleteCustomRoutingListener-property
  destroy: {
    method: "deleteCustomRoutingListener",
    pickId,
  },
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { accelerator },
  }) =>
    pipe([
      tap((params) => {
        assert(accelerator);
      }),
      () => otherProps,
      defaultsDeep({
        AcceleratorArn: getField(accelerator, "AcceleratorArn"),
      }),
    ])(),
});
