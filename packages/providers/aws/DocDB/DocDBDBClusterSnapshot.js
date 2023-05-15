const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");

const { Tagger, assignTags } = require("./DocDBCommon");

const buildArn = () =>
  pipe([
    get("DBClusterSnapshotArn"),
    tap((DBClusterSnapshotArn) => {
      assert(DBClusterSnapshotArn);
    }),
  ]);

const pickId = pipe([
  tap(({ DBClusterSnapshotIdentifier }) => {
    assert(DBClusterSnapshotIdentifier);
  }),
  pick(["DBClusterSnapshotIdentifier"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignTags({ buildArn: buildArn(config), endpoint }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DocDB.html
exports.DocDBDBClusterSnapshot = () => ({
  type: "DBClusterSnapshot",
  package: "docdb",
  client: "DocDB",
  propertiesDefault: {},
  omitProperties: [
    "DBClusterIdentifier",
    "SnapshotCreateTime",
    "Status",
    "VpcId",
    "ClusterCreateTime",
    "PercentProgress",
    "DBClusterSnapshotArn",
    "SourceDBClusterSnapshotArn",
  ],
  inferName: () =>
    pipe([
      get("DBClusterSnapshotIdentifier"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("DBClusterSnapshotIdentifier"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("DBClusterSnapshotArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["DBClusterSnapshotNotFoundFault"],
  dependencies: {
    dbCluster: {
      type: "DBCluster",
      group: "DocDB",
      required: true,
      pathId: "DBClusterIdentifier",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("DBClusterIdentifier"),
          tap((DBClusterIdentifier) => {
            assert(DBClusterIdentifier);
          }),
        ]),
    },
    kmsKey: {
      type: "Key",
      group: "KMS",
      excludeDefaultDependencies: true,
      pathId: "KmsKeyId",
      dependencyId: ({ lives, config }) => get("KmsKeyId"),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DocDB.html#describeDBClusterSnapshots-property
  getById: {
    method: "describeDBClusterSnapshots",
    getField: "DBClusterSnapshots",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DocDB.html#describeDBClusterSnapshots-property
  getList: {
    method: "describeDBClusterSnapshots",
    getParam: "DBClusterSnapshots",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DocDB.html#createDBClusterSnapshot-property
  create: {
    method: "createDBClusterSnapshot",
    pickCreated: ({ payload }) => pipe([get("DBClusterSnapshot")]),
    // TODO
    // isInstanceUp: pipe([get("Status"), isIn(["RUNNING"])]),
    // isInstanceError: pipe([get("Status"), isIn(["FAILED"])]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DocDB.html#modifyDBClusterSnapshot-property
  // TODO ValuesToAdd ValuesToRemove
  update: {
    method: "modifyDBClusterSnapshot",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DocDB.html#deleteDBClusterSnapshot-property
  destroy: {
    method: "deleteDBClusterSnapshot",
    pickId,
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
    dependencies: { dbCluster, kmsKey },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(dbCluster);
      }),
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
        DBClusterIdentifier: getField(dbCluster, "DBClusterIdentifier"),
      }),
      when(
        () => kmsKey,
        defaultsDeep({
          KmsKeyId: getField(kmsKey, "Arn"),
        })
      ),
    ])(),
});
