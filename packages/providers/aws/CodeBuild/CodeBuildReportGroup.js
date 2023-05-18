const assert = require("assert");
const { pipe, tap, get, pick, set, eq } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags } = require("../AwsCommon");
const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  tap(({ arn }) => {
    assert(arn);
  }),
  pick(["arn"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    //when(pipe([]))
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeBuild.html
exports.CodeBuildReportGroup = () => ({
  type: "ReportGroup",
  package: "codebuild",
  client: "CodeBuild",
  propertiesDefault: {},
  omitProperties: ["status", "arn", "created", "lastModified"],
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
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      when(
        eq(
          get("exportConfig.s3Destination.bucketOwner"),
          providerConfig.accountId()
        ),
        set(
          "exportConfig.s3Destination.bucketOwner",
          () => () => "config.accountId()"
        )
      ),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  dependencies: {
    s3Bucket: {
      type: "Bucket",
      group: "S3",
      dependencyId: ({ lives, config }) =>
        get("exportConfig.s3Destination.bucket"),
    },
    kmsKey: {
      type: "Key",
      group: "KMS",
      pathId: "exportConfig.s3Destination.encryptionKey",
      excludeDefaultDependencies: true,
      dependencyId: ({ lives, config }) =>
        get("exportConfig.s3Destination.encryptionKey"),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeBuild.html#batchGetReportGroups-property
  getById: {
    method: "batchGetReportGroups",
    getField: "reportGroups",
    pickId: pipe([
      tap(({ arn }) => {
        assert(arn);
      }),
      ({ arn }) => ({ reportGroupArns: [arn] }),
    ]),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeBuild.html#listReportGroups-property
  getList: {
    method: "listReportGroups",
    getParam: "reportGroups",
    decorate: ({ getById }) => pipe([(arn) => ({ arn }), getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeBuild.html#createReportGroup-property
  create: {
    method: "createReportGroup",
    pickCreated: ({ payload }) => pipe([get("reportGroup")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeBuild.html#updateReportGroup-property
  update: {
    method: "updateReportGroup",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeBuild.html#deleteReportGroup-property
  destroy: {
    method: "deleteReportGroup",
    pickId: pipe([pickId, defaultsDeep({ deleteReports: true })]),
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { tags, ...otherProps },
    dependencies: { kmsKey },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        tags: buildTags({
          name,
          config,
          namespace,
          UserTags: tags,
          key: "key",
          value: "value",
        }),
      }),
      when(
        () => kmsKey,
        set("exportConfig.s3Destination.encryptionKey", () =>
          getField(kmsKey, "Arn")
        )
      ),
    ])(),
});
