const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTagsObject } = require("@grucloud/core/Common");

const { Tagger, assignTags } = require("./AppStreamCommon");

const buildArn = () =>
  pipe([
    get("Arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ Name }) => {
    assert(Name);
  }),
  pick(["Name"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignTags({ endpoint, buildArn: buildArn() }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppStream.html
exports.AppStreamAppBlock = () => ({
  type: "AppBlock",
  package: "appstream",
  client: "AppStream",
  propertiesDefault: {},
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
      get("Name"),
      tap((id) => {
        assert(id);
      }),
    ]),
  omitProperties: ["Arn", "CreatedTime"],
  dependencies: {
    s3BucketScript: {
      type: "Bucket",
      group: "S3",
      dependencyId: ({ lives, config }) =>
        get("SetupScriptDetails.ScriptS3Location.S3Bucket"),
    },
    s3BucketSource: {
      type: "Bucket",
      group: "S3",
      dependencyId: ({ lives, config }) => get("SourceS3Location.S3Bucket"),
    },
  },
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppStream.html#describeAppBlocks-property
  getById: {
    method: "describeAppBlocks",
    getField: "AppBlocks",
    pickId: pipe([
      tap(({ Arn }) => {
        assert(Arn);
      }),
      ({ Arn }) => ({ Arns: [Arn] }),
    ]),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppStream.html#describeAppBlocks-property
  getList: {
    method: "describeAppBlocks",
    getParam: "AppBlocks",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppStream.html#createAppBlock-property
  create: {
    method: "createAppBlock",
    pickCreated: ({ payload }) => pipe([get("AppBlock")]),
    //shouldRetryOnExceptionMessages: ["Either the specified S3 bucket"],
  },
  // No update
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppStream.html#deleteAppBlock-property
  destroy: {
    method: "deleteAppBlock",
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
    dependencies: {},
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTagsObject({ name, config, namespace, userTags: Tags }),
      }),
    ])(),
});
