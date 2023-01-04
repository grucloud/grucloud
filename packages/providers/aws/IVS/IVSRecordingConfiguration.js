const assert = require("assert");
const { pipe, tap, get, pick, eq } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { buildTagsObject } = require("@grucloud/core/Common");
const { getByNameCore } = require("@grucloud/core/Common");

const { Tagger } = require("./IVSCommon");

const buildArn = () =>
  pipe([
    get("arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ arn }) => {
    assert(arn);
  }),
  pick(["arn"]),
]);

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IVS.html
exports.IVSRecordingConfiguration = ({ compare }) => ({
  type: "RecordingConfiguration",
  package: "ivs",
  client: "Ivs",
  propertiesDefault: {
    recordingReconnectWindowSeconds: 0,
    thumbnailConfiguration: {
      recordingMode: "INTERVAL",
      targetIntervalSeconds: 60,
    },
  },
  omitProperties: ["arn", "state"],
  inferName: () =>
    pipe([
      get("name"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("name"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("arn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  dependencies: {
    s3Bucket: {
      type: "Bucket",
      group: "S3",
      dependencyId: ({ lives, config }) =>
        pipe([get("destinationConfiguration.s3.bucketName")]),
    },
  },
  ignoreErrorCodes: ["ResourceNotFoundException"],
  //compare: compare({ filterTarget: () => pipe([omit(["adminUserPassword"])]) }),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IVS.html#getRecordingConfiguration-property
  getById: {
    method: "getRecordingConfiguration",
    getField: "recordingConfiguration",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IVS.html#listRecordingConfigurations-property
  getList: {
    method: "listRecordingConfigurations",
    getParam: "recordingConfigurations",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IVS.html#createRecordingConfiguration-property
  create: {
    method: "createRecordingConfiguration",
    pickCreated: ({ payload }) => pipe([get("recordingConfiguration")]),
    isInstanceUp: pipe([eq(get("state"), "ACTIVE")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IVS.html#deleteRecordingConfiguration-property
  destroy: {
    method: "deleteRecordingConfiguration",
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
    properties: { tags, ...otherProps },
    dependencies: {},
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        tags: buildTagsObject({ name, config, namespace, userTags: tags }),
      }),
    ])(),
});
