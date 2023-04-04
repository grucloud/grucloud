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

exports.GlobalAcceleratorListener = () => ({
  type: "Listener",
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
      type: "Accelerator",
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
          parent: { type: "Accelerator", group: "GlobalAccelerator" },
          pickKey: pipe([pick(["AcceleratorArn"])]),
          method: "listListeners",
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
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GlobalAccelerator.html#describeListener-property
  getById: {
    method: "describeListener",
    getField: "Listener",
    pickId,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GlobalAccelerator.html#createListener-property
  create: {
    method: "createListener",
    pickCreated: ({ payload }) => pipe([get("Listener")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GlobalAccelerator.html#deleteListener-property
  destroy: {
    method: "deleteListener",
    pickId,
  },
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
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
