const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, append } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const toInstanceId = ({ Id, ...other }) => ({
  InstanceId: Id,
  ...other,
});

const pickId = pipe([
  tap(({ InstanceId, ServiceId }) => {
    assert(InstanceId);
    assert(ServiceId);
  }),
  pick(["InstanceId", "ServiceId"]),
]);

const decorate = ({ endpoint, config, live }) =>
  pipe([
    tap((params) => {
      assert(live.ServiceId);
    }),
    toInstanceId,
    defaultsDeep({ ServiceId: live.ServiceId }),
  ]);

const findName =
  ({ lives, config }) =>
  ({ ServiceId, InstanceId }) =>
    pipe([
      tap((params) => {
        assert(ServiceId);
        assert(InstanceId);
      }),
      () => ServiceId,
      lives.getById({
        type: "Service",
        group: "ServiceCatalog",
        providerName: config.providerName,
      }),
      get("name", ServiceId),
      append(`::${InstanceId}`),
    ])();

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceDiscovery.html
exports.ServiceDiscoveryInstance = () => ({
  type: "Instance",
  package: "servicediscovery",
  client: "ServiceDiscovery",
  propertiesDefault: {},
  omitProperties: ["ServiceId"],
  inferName:
    ({ dependenciesSpec: { service } }) =>
    ({ InstanceId }) =>
      pipe([
        tap(() => {
          assert(service);
          assert(InstanceId);
        }),
        () => `${service}::${InstanceId}`,
      ])(),
  findName,
  findId: findName,
  ignoreErrorCodes: [
    "ResourceNotFoundException",
    "ServiceNotFound",
    "InstanceNotFound",
  ],
  dependencies: {
    service: {
      type: "Service",
      group: "ServiceCatalog",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("ServiceId"),
          tap((ServiceId) => {
            assert(ServiceId);
          }),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceDiscovery.html#getInstance-property
  getById: {
    method: "getInstance",
    getField: "Instance",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceDiscovery.html#listInstances-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Service", group: "ServiceCatalog" },
          pickKey: pipe([pick(["ServiceId"])]),
          method: "listInstances",
          getParam: "Instances",
          config,
          decorate: ({ parent }) => pipe([decorate({ live: parent })]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceDiscovery.html#registerInstance-property
  create: {
    method: "registerInstance",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceDiscovery.html#deleteInstance-property
  destroy: {
    method: "deregisterInstance",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { service },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(service);
      }),
      () => otherProps,
      defaultsDeep({ ServiceId: getField(service, "Id") }),
    ])(),
});
