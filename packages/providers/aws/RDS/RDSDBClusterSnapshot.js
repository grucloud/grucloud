const assert = require("assert");
const { pipe, tap, get, pick, eq, not } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");

const { Tagger } = require("./RDSCommon");

//TODO  Only manual snapshots may be deleted.
const cannotBeDeleted = () => pipe([not(eq(get("SnapshotType"), "manual"))]);

const buildArn = () =>
  pipe([
    get("DBClusterSnapshotIdentifier"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ DBClusterSnapshotIdentifier }) => {
    assert(DBClusterSnapshotIdentifier);
  }),
  pick(["DBClusterSnapshotIdentifier"]),
]);

const findNameClusterSnapshot = pipe([
  get("DBClusterSnapshotIdentifier"),
  tap((DBClusterSnapshotIdentifier) => {
    assert(DBClusterSnapshotIdentifier);
  }),
]);

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html
exports.RDSDBClusterSnapshot = ({ compare }) => ({
  type: "DBClusterSnapshot",
  package: "rds",
  client: "RDS",
  inferName: () => pipe([findNameClusterSnapshot]),
  findName: () => pipe([findNameClusterSnapshot]),
  findId: () =>
    pipe([
      findNameClusterSnapshot,
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["DBClusterSnapshotNotFoundFault"],
  propertiesDefault: {},
  omitProperties: [
    "DBClusterIdentifier",
    "DBClusterSnapshotResourceIdentifier",
    "SnapshotCreateTime",
    "Status",
    "DBClusterSnapshotArn",
    "AvailabilityZones",
    "Engine",
    "EngineMode",
    "AllocatedStorage",
    "Port",
    "VpcId",
    "ClusterCreateTime",
    "MasterUsername",
    "EngineVersion",
    "LicenseModel",
    "SnapshotType",
    "PercentProgress",
    "StorageEncrypted",
    "KmsKeyId",
  ],
  dependencies: {
    cluster: {
      type: "DBCluster",
      group: "RDS",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("DBClusterIdentifier"),
          tap((DBClusterIdentifier) => {
            assert(DBClusterIdentifier);
          }),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#getDBClusterSnapshot-property
  getById: {
    method: "describeDBClusterSnapshots",
    getField: "DBClusterSnapshots",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#describeDBClusterSnapshots-property
  getList: {
    method: "describeDBClusterSnapshots",
    getParam: "DBClusterSnapshots",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#createDBClusterSnapshot-property
  create: {
    method: "createDBClusterSnapshot",
    pickCreated: ({ payload }) => pipe([get("DBClusterSnapshot")]),
    isInstanceUp: pipe([eq(get("Status"), "available")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#modifyDBClusterSnapshot-property
  update: {
    method: "modifyDBClusterSnapshot",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#deleteDBClusterSnapshot-property
  destroy: {
    method: "deleteDBClusterSnapshot",
    pickId,
  },
  managedByOther: cannotBeDeleted,
  cannotBeDeleted,
  getByName: ({ getById }) =>
    pipe([({ name }) => ({ DBClusterSnapshotIdentifier: name }), getById({})]),
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { cluster },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(cluster);
      }),
      () => otherProps,
      defaultsDeep({
        DBClusterIdentifier: getField(cluster, "DBClusterIdentifier"),
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
    ])(),
});
