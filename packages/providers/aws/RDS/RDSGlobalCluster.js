const assert = require("assert");
const { assign, map, pipe, tap, get, eq, pick, omit, or } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { getField } = require("@grucloud/core/ProviderCommon");
const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags } = require("../AwsCommon");
const { Tagger } = require("./RDSCommon");

const ignoreErrorCodes = ["GlobalClusterNotFoundFault"];

const buildArn = () =>
  pipe([
    get("GlobalClusterArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const decorate = () =>
  pipe([
    tap((params) => {
      assert(true);
    }),
  ]);

const pickId = pipe([
  pick(["GlobalClusterIdentifier"]),
  tap(({ GlobalClusterIdentifier }) => {
    assert(GlobalClusterIdentifier);
  }),
]);

exports.RDSGlobalCluster = ({ compare }) => ({
  type: "GlobalCluster",
  package: "rds",
  client: "RDS",
  inferName: () => get("GlobalClusterIdentifier"),
  findName: () => get("GlobalClusterIdentifier"),
  findId: () => get("GlobalClusterArn"),
  dependencies: {},
  omitProperties: [
    "GlobalClusterResourceId",
    "GlobalClusterArn",
    "Status",
    "GlobalClusterMembers",
    "FailoverState",
  ],
  propertiesDefault: {},
  ignoreErrorCodes,
  getById: {
    pickId,
    method: "describeGlobalClusters",
    getField: "GlobalClusters",
    decorate,
  },
  getList: {
    method: "describeGlobalClusters",
    getParam: "GlobalClusters",
    decorate,
  },
  create: {
    pickCreated: () => get("GlobalCluster"),
    method: "createGlobalCluster",
    isInstanceUp: pipe([eq(get("Status"), "available")]),
    configIsUp: { retryCount: 40 * 12, retryDelay: 5e3 },
  },
  destroy: {
    pickId: pipe([pickId, defaultsDeep({ SkipFinalSnapshot: true })]),
    method: "deleteGlobalCluster",
  },
  getByName: getByNameCore,
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: {},
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ config, namespace, name, UserTags: Tags }),
      }),
    ])(),
});
