const assert = require("assert");
const { pipe, tap, get, pick, eq } = require("rubico");
const { defaultsDeep, find, isIn, when, isEmpty, unless } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  tap(({ SyncName }) => {
    assert(SyncName);
  }),
  pick(["SyncName", "SyncType"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSM.html
exports.SSMResourceDataSync = () => ({
  type: "ResourceDataSync",
  package: "ssm",
  client: "SSM",
  propertiesDefault: {},
  omitProperties: [
    "LastSyncTime",
    "LastSuccessfulSyncTime",
    "SyncLastModifiedTime",
    "LastStatus",
    "SyncCreatedTime",
    "LastSyncStatusMessage",
    "S3Destination.AWSKMSKeyARN",
  ],
  inferName: () =>
    pipe([
      get("SyncName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("SyncName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("SyncName"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceDataSyncNotFoundException"],
  dependencies: {
    kmsKey: {
      type: "Key",
      group: "KMS",
      excludeDefaultDependencies: true,
      dependencyId: ({ lives, config }) => get("S3Destination.AWSKMSKeyARN"),
    },
    s3Bucket: {
      type: "Bucket",
      group: "S3",
      dependencyId: ({ lives, config }) => get("S3Destination.BucketName"),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSM.html#listResourceDataSync-property
  getById: {
    method: "listResourceDataSync",
    pickId,
    decorate: ({ live, endpoint, config }) =>
      pipe([
        tap((params) => {
          assert(live.SyncName);
        }),
        get("ResourceDataSyncItems"),
        find(eq(get("SyncName"), live.SyncName)),
        unless(isEmpty, decorate({ config, endpoint })),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSM.html#listResourceDataSync-property
  getList: {
    method: "listResourceDataSync",
    getParam: "ResourceDataSyncItems",
    decorate,
  },

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSM.html#createResourceDataSync-property
  create: {
    method: "createResourceDataSync",
    pickCreated: ({ payload }) => pipe([() => payload]),
    isInstanceUp: pipe([get("LastStatus"), isIn(["Successful"])]),
    isInstanceError: pipe([get("LastStatus"), isIn(["Failed"])]),
    getErrorMessage: pipe([get("LastSyncStatusMessage", "FAILED")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSM.html#updateResourceDataSync-property
  update: {
    method: "updateResourceDataSync",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSM.html#deleteResourceDataSync-property
  destroy: {
    method: "deleteResourceDataSync",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { kmsKey },
    config,
  }) =>
    pipe([
      () => otherProps, //
      defaultsDeep({}),
      when(
        () => kmsKey,
        defaultsDeep({
          S3Destination: { AWSKMSKeyARN: getField(kmsKey, "Arn") },
        })
      ),
    ])(),
});
