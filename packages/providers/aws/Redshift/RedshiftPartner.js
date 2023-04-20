const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, append, isIn } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  tap(({ AccountId, ClusterIdentifier, DatabaseName, PartnerName }) => {
    assert(AccountId);
    assert(ClusterIdentifier);
    assert(DatabaseName);
    assert(PartnerName);
  }),
  pick(["AccountId", "ClusterIdentifier", "DatabaseName", "PartnerName"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(config);
    }),
    defaultsDeep({ AccountId: config.accountId() }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Redshift.html
exports.RedshiftPartner = () => ({
  type: "Partner",
  package: "redshift",
  client: "Redshift",
  propertiesDefault: {},
  omitProperties: [
    "ClusterIdentifier",
    "Status",
    "StatusMessage",
    "CreatedAt",
    "UpdatedAt",
  ],
  inferName:
    ({ dependenciesSpec: { cluster } }) =>
    ({ PartnerName }) =>
      pipe([
        tap(() => {
          assert(cluster);
          assert(PartnerName);
        }),
        () => `${cluster}::${PartnerName}`,
      ])(),
  findName:
    ({ lives, config }) =>
    ({ PartnerName, ClusterIdentifier }) =>
      pipe([
        () => ClusterIdentifier,
        lives.getById({
          type: "Cluster",
          group: "Redshift",
          providerName: config.providerName,
        }),
        get("name"),
        tap((name) => {
          assert(name);
        }),
        append(`::${PartnerName}`),
      ])(),
  findId: () =>
    pipe([
      tap(({ ClusterIdentifier, PartnerName }) => {
        assert(ClusterIdentifier);
        assert(PartnerName);
      }),
      ({ ClusterIdentifier, PartnerName }) =>
        `${ClusterIdentifier}::${PartnerName}`,
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException", "ClusterNotFoundFault"],
  dependencies: {
    cluster: {
      type: "Cluster",
      group: "Redshift",
      parent: true,
      dependencyId: () =>
        pipe([
          get("ClusterIdentifier"),
          tap((ClusterIdentifier) => {
            assert(ClusterIdentifier);
          }),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Redshift.html#describePartners-property
  getById: {
    method: "describePartners",
    getField: "PartnerIntegrationInfoList",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Redshift.html#describePartners-property
  getList: {
    method: "describePartners",
    getParam: "PartnerIntegrationInfoList",
    decorate,
  },
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Cluster", group: "Redshift" },
          pickKey: pipe([
            pick(["ClusterIdentifier"]),
            defaultsDeep({ AccountId: config.accountId() }),
          ]),
          method: "describePartners",
          getParam: "PartnerIntegrationInfoList",
          config,
          decorate: ({ parent }) =>
            pipe([decorate({ endpoint, config, live: parent })]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Redshift.html#addPartner-property
  create: {
    method: "addPartner",
    pickCreated: ({ payload }) => pipe([() => payload]),
    // isInstanceUp: pipe([get("Status"), isIn(["Active"])]),
    isInstanceError: pipe([
      get("Status"),
      isIn(["ConnectionFailure", "RuntimeFailure"]),
    ]),
    getErrorMessage: pipe([get("StatusMessage", "FAILED")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Redshift.html#deletePartner-property
  destroy: {
    method: "deletePartner",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { cluster },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(cluster);
      }),
      () => otherProps,
      defaultsDeep({
        ClusterIdentifier: getField(cluster, "ClusterIdentifier"),
        AccountId: config.accountId(),
      }),
    ])(),
});
