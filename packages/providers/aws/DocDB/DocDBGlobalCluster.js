const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, isIn } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");

const pickId = pipe([
  tap(({ GlobalClusterIdentifier }) => {
    assert(GlobalClusterIdentifier);
  }),
  pick(["GlobalClusterIdentifier"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DocDB.html
exports.DocDBGlobalCluster = () => ({
  type: "GlobalCluster",
  package: "docdb",
  client: "DocDB",
  propertiesDefault: {},
  omitProperties: [
    "Status",
    "GlobalClusterMembers",
    "GlobalClusterArn",
    "GlobalClusterResourceId",
  ],
  inferName: () =>
    pipe([
      get("GlobalClusterIdentifier"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("GlobalClusterIdentifier"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("GlobalClusterIdentifier"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["GlobalClusterNotFoundFault"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DocDB.html#describeGlobalClusters-property
  getById: {
    method: "describeGlobalClusters",
    getField: "GlobalClusters",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DocDB.html#describeGlobalClusters-property
  getList: {
    method: "describeGlobalClusters",
    getParam: "GlobalClusters",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DocDB.html#createGlobalCluster-property
  create: {
    method: "createGlobalCluster",
    pickCreated: ({ payload }) => pipe([get("GlobalCluster")]),
    isInstanceUp: pipe([get("Status"), isIn(["available"])]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DocDB.html#modifyGlobalCluster-property
  // TODO
  update: {
    method: "modifyGlobalCluster",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DocDB.html#deleteGlobalCluster-property
  destroy: {
    method: "deleteGlobalCluster",
    pickId,
    shouldRetryOnExceptionMessages: ["is not empty"],
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: {},
    config,
  }) => pipe([() => otherProps, defaultsDeep({})])(),
});
