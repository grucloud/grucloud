const assert = require("assert");
const { pipe, tap, get, pick, switchCase } = require("rubico");
const { defaultsDeep, isIn, when } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  tap(({ ExportTaskIdentifier }) => {
    assert(ExportTaskIdentifier);
  }),
  pick(["ExportTaskIdentifier"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html
exports.RDSExportTask = () => ({
  type: "ExportTask",
  package: "rds",
  client: "RDS",
  propertiesDefault: {},
  omitProperties: [
    "FailureCause",
    "TotalExtractedDataInGB",
    "PercentProgress",
    "Status",
    "WarningMessage",
    "SourceArn",
  ],
  inferName: () =>
    pipe([
      get("ExportTaskIdentifier"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("ExportTaskIdentifier"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("ExportTaskIdentifier"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ExportTaskNotFoundFault"],
  dependencies: {
    dbCluster: {
      type: "DBCluster",
      group: "RDS",
      dependencyId: ({ lives, config }) => pipe([get("SourceArn")]),
    },
    dbSnapshot: {
      type: "DBSnapshot",
      group: "RDS",
      dependencyId: ({ lives, config }) => pipe([get("SourceArn")]),
    },
    kmsKey: {
      type: "Key",
      group: "KMS",
      excludeDefaultDependencies: true,
      dependencyId: ({ lives, config }) => get("KmsKeyId"),
    },
    iamRole: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) => get("IamRoleArn"),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#describeExportTasks-property
  getById: {
    method: "describeExportTasks",
    getField: "ExportTasks",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#describeExportTasks-property
  getList: {
    method: "describeExportTasks",
    getParam: "ExportTasks",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#createExportTask-property
  create: {
    method: "startExportTask",
    pickCreated: ({ payload }) => pipe([() => payload]),
    isInstanceUp: pipe([get("Status"), isIn(["COMPLETE"])]),
    isInstanceError: pipe([get("Status"), isIn(["FAILED"])]),
    getErrorMessage: pipe([get("FailureCause", "FAILED")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#cancelExportTask-property
  destroy: {
    method: "cancelExportTask",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { dbCluster, dbSnapshot, iamRole, kmsKey },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({}),
      when(() => kmsKey, defaultsDeep({ KmsKeyId: getField(kmsKey, "Arn") })),
      when(
        () => iamRole,
        defaultsDeep({
          IamRoleArn: getField(iamRole, "Arn"),
        })
      ),
      switchCase([
        () => dbCluster,
        defaultsDeep({ SourceArn: getField(dbCluster, "DBClusterArn") }),
        () => dbSnapshot,
        defaultsDeep({ SourceArn: getField(dbSnapshot, "DBSnapshotArn") }),
        () => {
          assert(false, "missing dbCluster or dbSnapshot");
        },
      ]),
    ])(),
});
