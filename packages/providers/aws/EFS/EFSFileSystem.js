const assert = require("assert");
const { pipe, tap, get, assign, pick, eq, omit } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { replaceAccountAndRegion } = require("../AwsCommon");

const { buildTags, findNameInTagsOrId } = require("../AwsCommon");
const { Tagger } = require("./EFSCommon");

const pickId = pipe([pick(["FileSystemId"])]);

const buildArn = () =>
  pipe([
    get("FileSystemId"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EFS.html
exports.EFSFileSystem = ({ compare }) => ({
  type: "FileSystem",
  package: "efs",
  client: "EFS",
  findName: findNameInTagsOrId({ findId: () => get("FileSystemId") }),
  findId: () => pipe([get("FileSystemArn")]),
  ignoreErrorCodes: ["FileSystemNotFound", "BadRequest"],
  omitProperties: [
    "FileSystemArn",
    "CreationTime",
    "CreationToken",
    "FileSystemId",
    "LifeCycleState",
    "NumberOfMountTargets",
    "OwnerId",
    "SizeInBytes",
    "Name",
    "KmsKeyId",
    "AvailabilityZoneId",
  ],
  propertiesDefault: {
    Encrypted: true,
    PerformanceMode: "generalPurpose",
    ThroughputMode: "bursting",
  },
  compare: compare({
    filterAll: () => pipe([omit([])]),
  }),
  dependencies: {
    kmsKey: {
      type: "Key",
      group: "KMS",
      excludeDefaultDependencies: true,
      dependencyId: ({ lives, config }) => get("KmsKeyId"),
    },
  },
  filterLive: ({ providerConfig, lives }) =>
    pipe([
      when(
        get("AvailabilityZoneName"),
        assign({
          AvailabilityZoneName: pipe([
            get("AvailabilityZoneName"),
            replaceAccountAndRegion({ providerConfig, lives }),
          ]),
        })
      ),
    ]),
  getById: { method: "describeFileSystems", getField: "FileSystems", pickId },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EFS.html#describeFileSystems-property
  getList: {
    method: "describeFileSystems",
    getParam: "FileSystems",
  },
  create: {
    method: "createFileSystem",
    isInstanceUp: eq(get("LifeCycleState"), "available"),
  },
  update: {
    method: "updateFileSystem",
    filterParams: ({ payload }) => pipe([() => payload]),
  },
  destroy: { method: "deleteFileSystem", pickId },
  getByName: getByNameCore,
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { kmsKey },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
      when(
        () => kmsKey,
        defaultsDeep({
          KmsKeyId: getField(kmsKey, "Arn"),
        })
      ),
    ])(),
});
