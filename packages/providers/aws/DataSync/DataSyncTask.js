const assert = require("assert");
const { pipe, tap, get, pick, eq, assign, switchCase } = require("rubico");
const { defaultsDeep, when, identity } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");

const { Tagger, assignTags } = require("./DataSyncCommon");
const { omitIfEmpty } = require("@grucloud/core/Common");

const buildArn = () =>
  pipe([
    get("TaskArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ TaskArn }) => {
    assert(TaskArn);
  }),
  pick(["TaskArn"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    omitIfEmpty(["Excludes", "Includes"]),
    assignTags({ buildArn: buildArn(config), endpoint }),
  ]);

const findSource = ({
  sourceS3,
  sourceEfs,
  sourceFsxLustre,
  sourceFsxOpenZfs,
  sourceFsxWindows,
}) =>
  switchCase([
    () => sourceS3,
    () => getField(sourceS3, "LocationArn"),
    () => sourceEfs,
    () => getField(sourceEfs, "LocationArn"),
    () => sourceFsxLustre,
    () => getField(sourceFsxLustre, "LocationArn"),
    () => sourceFsxOpenZfs,
    () => getField(sourceFsxOpenZfs, "LocationArn"),
    () => sourceFsxWindows,
    () => getField(sourceFsxWindows, "LocationArn"),
    () => {
      assert(false, "not implemented yet");
    },
  ]);

const findDestination = ({
  destinationS3,
  destinationEfs,
  destinationFsxLustre,
  destinationFsxOpenZfs,
  destinationFsxWindows,
}) =>
  switchCase([
    () => destinationS3,
    () => getField(destinationS3, "LocationArn"),
    () => destinationEfs,
    () => getField(destinationEfs, "LocationArn"),
    () => destinationFsxLustre,
    () => getField(destinationFsxLustre, "LocationArn"),
    () => destinationFsxOpenZfs,
    () => getField(destinationFsxOpenZfs, "LocationArn"),
    () => destinationFsxWindows,
    () => getField(destinationFsxWindows, "LocationArn"),
    () => {
      assert(false, "not implemented yet");
    },
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DataSync.html
exports.DataSyncTask = () => ({
  type: "Task",
  package: "datasync",
  client: "DataSync",
  propertiesDefault: {
    Options: {
      Atime: "BEST_EFFORT",
      BytesPerSecond: -1,
      Gid: "NONE",
      LogLevel: "OFF",
      Mtime: "PRESERVE",
      ObjectTags: "PRESERVE",
      OverwriteMode: "ALWAYS",
      PosixPermissions: "NONE",
      PreserveDeletedFiles: "PRESERVE",
      PreserveDevices: "NONE",
      SecurityDescriptorCopyFlags: "NONE",
      TaskQueueing: "ENABLED",
      TransferMode: "CHANGED",
      Uid: "NONE",
      VerifyMode: "ONLY_FILES_TRANSFERRED",
    },
  },
  omitProperties: [
    "TaskArn",
    "Status",
    "CurrentTaskExecutionArn",
    "SourceLocationArn",
    "DestinationLocationArn",
    "CloudWatchLogGroupArn",
    "SourceNetworkInterfaceArns",
    "DestinationNetworkInterfaceArns",
    "ErrorCode",
    "ErrorDetail",
    "CreationTime",
  ],
  inferName: () =>
    pipe([
      get("Name"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("Name"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("TaskArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["InvalidRequestException"],
  dependencies: {
    logGroup: {
      type: "LogGroup",
      group: "CloudWatchLogs",
      dependencyId: () => pipe([get("CloudWatchLogGroupArn")]),
    },
    // iamRoleExecution: {
    //   type: "Role",
    //   group: "IAM",
    //   list: true,
    //   dependencyIds: () => pipe([get("CurrentTaskExecutionArn")]),
    // },
    sourceS3: {
      type: "LocationS3",
      group: "Bucket",
      dependencyId: ({ lives, config }) => pipe([get("SourceLocationArn")]),
    },
    destinationS3: {
      type: "LocationS3",
      group: "DataSync",
      dependencyId: ({ lives, config }) =>
        pipe([get("DestinationLocationArn")]),
    },
    sourceEfs: {
      type: "LocationEfs",
      group: "DataSync",
      dependencyId: ({ lives, config }) => pipe([get("SourceLocationArn")]),
    },
    destinationEfs: {
      type: "LocationEfs",
      group: "DataSync",
      dependencyId: ({ lives, config }) =>
        pipe([get("DestinationLocationArn")]),
    },
    sourceFsxLustre: {
      type: "LocationFsxLustre",
      group: "DataSync",
      dependencyId: ({ lives, config }) => pipe([get("SourceLocationArn")]),
    },
    destinationFsxLustre: {
      type: "LocationFsxLustre",
      group: "DataSync",
      dependencyId: ({ lives, config }) =>
        pipe([get("DestinationLocationArn")]),
    },
    sourceFsxOpenZfs: {
      type: "LocationFsxOpenZfs",
      group: "DataSync",
      dependencyId: ({ lives, config }) => pipe([get("SourceLocationArn")]),
    },
    destinationFsxOpenZfs: {
      type: "LocationFsxOpenZfs",
      group: "DataSync",
      dependencyId: ({ lives, config }) =>
        pipe([get("DestinationLocationArn")]),
    },
    sourceFsxWindows: {
      type: "LocationFsxWindows",
      group: "DataSync",
      dependencyId: ({ lives, config }) => pipe([get("SourceLocationArn")]),
    },
    destinationFsxWindows: {
      type: "LocationFsxWindows",
      group: "DataSync",
      dependencyId: ({ lives, config }) =>
        pipe([get("DestinationLocationArn")]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DataSync.html#describeTask-property
  getById: {
    method: "describeTask",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DataSync.html#listTasks-property
  getList: {
    method: "listTasks",
    getParam: "Tasks",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DataSync.html#createTask-property
  create: {
    method: "createTask",
    pickCreated: ({ payload }) => pipe([identity]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DataSync.html#updateTask-property
  update: {
    method: "updateTask",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DataSync.html#deleteTask-property
  destroy: {
    method: "deleteTask",
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
    dependencies: {
      //iamRoleExecution,
      logGroup,
      sourceEfs,
      destinationEfs,
      sourceS3,
      destinationS3,
      sourceFsxLustre,
      destinationFsxLustre,
      sourceFsxOpenZfs,
      destinationFsxOpenZfs,
      sourceFsxWindows,
      destinationFsxWindows,
    },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
      assign({
        SourceLocationArn: pipe([
          findSource({
            sourceS3,
            sourceEfs,
            sourceFsxLustre,
            sourceFsxOpenZfs,
            sourceFsxWindows,
          }),
        ]),
        DestinationLocationArn: pipe([
          findDestination({
            destinationS3,
            destinationEfs,
            destinationFsxLustre,
            destinationFsxOpenZfs,
            destinationFsxWindows,
          }),
        ]),
      }),
      //   when(
      //     () => iamRoleExecution,
      //     defaultsDeep({
      //       CurrentTaskExecutionArn: getField(iamRoleExecution, "Arn"),
      //     })
      //   ),
      when(
        () => logGroup,
        defaultsDeep({
          CloudWatchLogGroupArn: getField(logGroup, "arn"),
        })
      ),
      //
    ])(),
});
