const assert = require("assert");
const { pipe, tap, get, pick, eq, map, omit, flatMap } = require("rubico");
const { defaultsDeep, when, pluck } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");
const { findNameInTagsOrId } = require("../AwsCommon");

const { Tagger } = require("./FSxCommon");

const buildArn = () =>
  pipe([
    get("ResourceARN"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ BackupId }) => {
    assert(BackupId);
  }),
  pick(["BackupId"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

const findId = () =>
  pipe([
    get("BackupId"),
    tap((id) => {
      assert(id);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/FSx.html
exports.FSxBackup = () => ({
  type: "Backup",
  package: "fsx",
  client: "FSx",
  propertiesDefault: {},
  omitProperties: [
    "BackupId",
    "OwnerId",
    "CreationTime",
    "Lifecycle",
    "FailureDetails",
    "ResourceARN",
    "KmsKeyId",
    "FileSystem",
    "FileSystemId",
  ],
  findName: findNameInTagsOrId({ findId }),
  findId,
  dependencies: {
    fileSystem: {
      type: "FileSystem",
      group: "FSx",
      dependencyId: ({ lives, config }) =>
        pipe([get("FileSystem.FileSystemId")]),
    },
    volume: {
      type: "Volume",
      group: "FSx",
      dependencyId: ({ lives, config }) => pipe([get("VolumeId")]),
    },
  },
  ignoreErrorCodes: ["BackupNotFound"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/FSx.html#describeBackups-property
  getById: {
    method: "describeBackups",
    getField: "Backups",
    pickId: pipe([
      tap(({ BackupId }) => {
        assert(BackupId);
      }),
      ({ BackupId }) => ({
        BackupIds: [BackupId],
      }),
    ]),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/FSx.html#describeBackups-property
  getList: {
    enhanceParams: () => () => ({
      Filters: [
        {
          Name: "backup-type",
          Values: ["USER_INITIATED"],
        },
      ],
    }),
    method: "describeBackups",
    getParam: "Backups",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/FSx.html#createBackup-property
  create: {
    method: "createBackup",
    pickCreated: ({ payload }) => pipe([get("Backup")]),
    configIsUp: { retryCount: 45 * 12, retryDelay: 5e3 },
    // isInstanceUp: pipe([
    //   tap(({ Lifecycle }) => {
    //     assert(Lifecycle);
    //   }),
    //   eq(get("Lifecycle"), "AVAILABLE"),
    // ]),
    isInstanceError: pipe([eq(get("Lifecycle"), "FAILED")]),
    getErrorMessage: get("FailureDetails.Message", "error"),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/FSx.html#updateBackup-property
  // update: {
  //   method: "updateBackup",
  //   filterParams: ({ payload, diff, live }) =>
  //     pipe([() => payload, defaultsDeep(pickId(live))])(),
  // },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/FSx.html#deleteBackup-property
  destroy: {
    method: "deleteBackup",
    pickId,
    shouldRetryOnExceptionMessages: [],
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
    dependencies: { fileSystem, volume },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
      when(
        () => fileSystem,
        defaultsDeep({
          FileSystemId: getField(fileSystem, "FileSystemId"),
        })
      ),
      when(
        () => volume,
        defaultsDeep({
          VolumeId: getField(volume, "VolumeId"),
        })
      ),
    ])(),
});
