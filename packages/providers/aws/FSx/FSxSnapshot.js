const assert = require("assert");
const { pipe, tap, get, pick, eq } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");

const { Tagger } = require("./FSxCommon");

const buildArn = () =>
  pipe([
    get("ResourceARN"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ SnapshotId }) => {
    assert(SnapshotId);
  }),
  pick(["SnapshotId"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/FSx.html
exports.FSxSnapshot = () => ({
  type: "Snapshot",
  package: "fsx",
  client: "FSx",
  propertiesDefault: {},
  omitProperties: [
    "SnapshotId",
    "OwnerId",
    "CreationTime",
    "Lifecycle",
    "FailureDetails",
    "ResourceARN",
    "VolumeId",
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
      get("SnapshotId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  dependencies: {
    volume: {
      type: "Volume",
      group: "FSx",
      dependencyId: ({ lives, config }) => pipe([get("VolumeId")]),
    },
  },
  ignoreErrorCodes: ["SnapshotNotFound"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/FSx.html#describeSnapshots-property
  getById: {
    method: "describeSnapshots",
    getField: "Snapshots",
    pickId: pipe([
      tap(({ SnapshotId }) => {
        assert(SnapshotId);
      }),
      ({ SnapshotId }) => ({
        SnapshotIds: [SnapshotId],
      }),
    ]),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/FSx.html#describeSnapshots-property
  getList: {
    method: "describeSnapshots",
    getParam: "Snapshots",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/FSx.html#createSnapshot-property
  create: {
    method: "createSnapshot",
    pickCreated: ({ payload }) => pipe([get("Snapshot")]),
    configIsUp: { retryCount: 45 * 12, retryDelay: 5e3 },
    isInstanceUp: pipe([
      tap(({ Lifecycle }) => {
        assert(Lifecycle);
      }),
      eq(get("Lifecycle"), "AVAILABLE"),
    ]),
    isInstanceError: pipe([eq(get("Lifecycle"), "FAILED")]),
    getErrorMessage: get("FailureDetails.Message", "error"),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/FSx.html#updateSnapshot-property
  update: {
    method: "updateSnapshot",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/FSx.html#deleteSnapshot-property
  destroy: {
    method: "deleteSnapshot",
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
    dependencies: { volume },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
      when(
        () => volume,
        defaultsDeep({
          VolumeId: getField(volume, "VolumeId"),
        })
      ),
    ])(),
});
