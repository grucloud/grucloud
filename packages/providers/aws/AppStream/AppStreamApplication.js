const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTagsObject } = require("@grucloud/core/Common");

const { Tagger } = require("./AppStreamCommon");
const { getField } = require("@grucloud/core/ProviderCommon");

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

const decorate =
  ({ endpoint, config }) =>
  (live) =>
    pipe([
      tap((params) => {
        assert(endpoint);
      }),
      () => live,
    ])();

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppStream.html
exports.AppStreamApplication = () => ({
  type: "Application",
  package: "appstream",
  client: "AppStream",
  propertiesDefault: { Enabled: true },
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
      get("Arn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  omitProperties: ["AppBlockArn", "Arn", "CreatedTime"],
  dependencies: {
    appBlock: {
      type: "AppBlock",
      group: "AppStream",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("AppBlockArn"),
          tap((AppBlockArn) => {
            assert(AppBlockArn);
          }),
        ]),
    },
    s3BucketIcon: {
      type: "Bucket",
      group: "S3",
      dependencyId: ({ lives, config }) => get("IconS3Location.S3Bucket"),
    },
  },
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppStream.html#describeApplications-property
  getById: {
    method: "describeApplications",
    getField: "Applications",
    pickId: pipe([
      tap(({ Arn }) => {
        assert(Arn);
      }),
      ({ Arn }) => ({ Arns: [Arn] }),
    ]),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppStream.html#describeApplications-property
  getList: {
    method: "describeApplications",
    getParam: "Applications",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppStream.html#createApplication-property
  create: {
    method: "createApplication",
    pickCreated: ({ payload }) => pipe([get("Application")]),
  },
  // No update
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppStream.html#deleteApplication-property
  destroy: {
    method: "deleteApplication",
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
    dependencies: { appBlock },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTagsObject({ name, config, namespace, userTags: Tags }),
        AppBlockArn: getField(appBlock, "Arn"),
      }),
    ])(),
});
