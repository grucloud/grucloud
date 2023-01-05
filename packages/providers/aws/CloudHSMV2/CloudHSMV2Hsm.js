const assert = require("assert");
const { pipe, tap, get, pick, eq, flatMap, map, assign } = require("rubico");
const { defaultsDeep, find, isEmpty, first, unless } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");
const { replaceAccountAndRegion } = require("../AwsCommon");

const { decorateCluster } = require("./CloudHSMV2Common");

const pickId = pipe([
  tap(({ HsmId, ClusterId }) => {
    assert(HsmId);
    assert(ClusterId);
  }),
  pick(["ClusterId", "HsmId"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudHSMV2.html
exports.CloudHSMV2Hsm = () => ({
  type: "Hsm",
  package: "cloudhsm-v2",
  client: "CloudHSMV2",
  propertiesDefault: {},
  omitProperties: [
    "ClusterId",
    "EniId",
    "EniIp",
    "HsmId",
    "State",
    "SubnetId",
    "HsmName",
    "StateMessage",
    "ClusterName",
  ],
  inferName: ({ dependenciesSpec: { cluster } }) =>
    pipe([({ AvailabilityZone }) => `${cluster}::${AvailabilityZone}`]),
  findName: () =>
    pipe([
      ({ ClusterName, AvailabilityZone }) =>
        `${ClusterName}::${AvailabilityZone}`,
    ]),
  findId: () =>
    pipe([
      get("HsmId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  dependencies: {
    cluster: {
      type: "Cluster",
      group: "CloudHSMV2",
      parent: true,
      dependencyId: ({ lives, config }) => get("ClusterId"),
    },
  },
  ignoreErrorCodes: [
    "CloudHsmResourceNotFoundException",
    "ResourceNotFoundException",
  ],
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      assign({
        AvailabilityZone: pipe([
          get("AvailabilityZone"),
          replaceAccountAndRegion({
            providerConfig,
            lives,
          }),
        ]),
      }),
    ]),
  getById:
    ({ endpoint }) =>
    ({ lives, config }) =>
    (live) =>
      pipe([
        tap((params) => {
          assert(endpoint);
          assert(live);
          assert(live.ClusterId);
          assert(live.HsmId);
        }),
        () => ({
          Filters: { clusterIds: [live.ClusterId] },
        }),
        endpoint().describeClusters,
        get("Clusters"),
        tap((params) => {
          assert(true);
        }),
        first,
        get("Hsms"),
        find(eq(get("HsmId"), live.HsmId)),
        tap((params) => {
          assert(true);
        }),
      ])(),
  getList:
    ({ client, endpoint, getById, config }) =>
    ({ lives }) =>
      pipe([
        lives.getByType({
          type: "Cluster",
          group: "CloudHSMV2",
          providerName: config.providerName,
        }),
        flatMap(
          pipe([
            get("live"),
            ({ Hsms, ClusterName }) =>
              pipe([() => Hsms, map(defaultsDeep({ ClusterName }))])(),
          ])
        ),
      ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudHSMV2.html#createHsm-property
  create: {
    method: "createHsm",
    pickCreated: ({ payload }) => pipe([get("Hsm")]),
    isInstanceUp: pipe([eq(get("State"), "ACTIVE")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudHSMV2.html#updateHsm-property
  update: {
    method: "updateHsm",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudHSMV2.html#deleteHsm-property
  destroy: {
    method: "deleteHsm",
    pickId,
  },
  getByName:
    ({ getList, endpoint }) =>
    ({ name, resolvedDependencies: { cluster }, lives, config }) =>
      pipe([
        tap((params) => {
          assert(cluster);
          assert(lives);
          assert(config);
        }),
        () => cluster,
        get("live.ClusterId"),
        (ClusterId) => ({
          Filters: { clusterIds: [ClusterId] },
        }),
        endpoint().describeClusters,
        get("Clusters"),
        first,
        decorateCluster({ lives, config }),
        get("Hsms"),
        find(eq(get("HsmName"), name)),
        unless(isEmpty, decorate({ endpoint, lives, config })),
      ])(),

  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { cluster },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        ClusterId: getField(cluster, "ClusterId"),
      }),
    ])(),
});
