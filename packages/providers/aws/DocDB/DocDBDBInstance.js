const assert = require("assert");
const { pipe, tap, get, pick, assign, map } = require("rubico");
const { defaultsDeep, when, isIn } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");
const { replaceAccountAndRegion } = require("../AwsCommon");

const { Tagger, assignTags } = require("./DocDBCommon");

const buildArn = () =>
  pipe([
    get("DBInstanceArn"),
    tap((DBInstanceArn) => {
      assert(DBInstanceArn);
    }),
  ]);

const pickId = pipe([
  tap(({ DBInstanceIdentifier }) => {
    assert(DBInstanceIdentifier);
  }),
  pick(["DBInstanceIdentifier"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignTags({ buildArn: buildArn(config), endpoint }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DocDB.html
exports.DocDBDBInstance = () => ({
  type: "DBInstance",
  package: "docdb",
  client: "DocDB",
  propertiesDefault: { Engine: "docdb", BackupRetentionPeriod: 1 },
  omitProperties: [
    "DBInstanceStatus",
    "Endpoint",
    "InstanceCreateTime",
    "VpcSecurityGroups",
    "DBSubnetGroup",
    "PendingModifiedValues",
    "LatestRestorableTime",
    "PubliclyAccessible",
    "StatusInfos",
    "KmsKeyId",
    "DbiResourceId",
    "CACertificateIdentifier",
    "DBInstanceArn",
  ],
  inferName: () =>
    pipe([
      get("DBInstanceIdentifier"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("DBInstanceIdentifier"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("DBInstanceArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["DBInstanceNotFoundFault"],
  dependencies: {
    // TODO EnabledCloudwatchLogsExports
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
    kmsKeyPerformance: {
      type: "Key",
      group: "KMS",
      excludeDefaultDependencies: true,
      pathId: "PerformanceInsightsKMSKeyId",
      dependencyId: ({ lives, config }) => get("PerformanceInsightsKMSKeyId"),
    },
  },
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      when(
        get("AvailabilityZone"),
        assign({
          AvailabilityZone: pipe([
            get("AvailabilityZone"),
            replaceAccountAndRegion({ lives, providerConfig }),
          ]),
        })
      ),
    ]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DocDB.html#describeDBInstances-property
  getById: {
    method: "describeDBInstances",
    getField: "DBInstances",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DocDB.html#describeDBInstances-property
  getList: {
    method: "describeDBInstances",
    getParam: "DBInstances",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DocDB.html#createDBInstance-property
  create: {
    method: "createDBInstance",
    pickCreated: ({ payload }) => pipe([() => payload]),
    isInstanceUp: pipe([get("DBInstanceStatus"), isIn(["available"])]),
    // isInstanceError: pipe([get("DBInstanceStatus"), isIn(["FAILED"])]),
    configIsUp: { retryCount: 45 * 12, retryDelay: 5e3 },
    shouldRetryOnExceptionMessages: [
      "IAM role ARN value is invalid or does not include the required permissions",
    ],
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DocDB.html#modifyDBInstance-property
  update: {
    method: "modifyDBInstance",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DocDB.html#deleteDBInstance-property
  destroy: {
    method: "deleteDBInstance",
    pickId,
    shouldRetryOnExceptionMessages: [
      "is already being deleted",
      "is currently creating - a final snapshot cannot be taken.",
      "Cannot delete the last instance of the master cluster. Delete the replica cluster before deleting the last master cluster instance",
    ],
    configIsDown: { retryCount: 45 * 12, retryDelay: 5e3 },
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
    dependencies: { dbCluster, kmsKeyPerformance },
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
        () => kmsKeyPerformance,
        defaultsDeep({
          PerformanceInsightsKMSKeyId: getField(kmsKeyPerformance, "Arn"),
        })
      ),
    ])(),
});
